// Minimal dev server for GR Perform (static files + Groq proxy)
// Usage (sh):
//   export GROQ_API_KEY="..."
//   node dev-server.js
// Then open: http://localhost:3000/generate-workout.html

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT_DIR = path.resolve(__dirname);

const AI_PROVIDER = String(process.env.AI_PROVIDER || 'groq').toLowerCase();
const AI_MIN_INTERVAL_MS = Math.max(0, Number(process.env.AI_MIN_INTERVAL_MS || 900));
const AI_MAX_429_RETRIES = Math.max(0, Number(process.env.AI_MAX_429_RETRIES || 2));
const AI_FALLBACK_PROVIDER = String(process.env.AI_FALLBACK_PROVIDER || '').toLowerCase();

const OLLAMA_URL = String(process.env.OLLAMA_URL || 'http://localhost:11434');
const OLLAMA_DEFAULT_MODEL = String(process.env.OLLAMA_MODEL || 'llama3.1:8b');

let aiQueue = Promise.resolve();
let lastAiCallAt = 0;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function enqueueAiCall(fn) {
  aiQueue = aiQueue.then(async () => {
    const now = Date.now();
    const wait = Math.max(0, AI_MIN_INTERVAL_MS - (now - lastAiCallAt));
    if (wait > 0) await sleep(wait);
    lastAiCallAt = Date.now();
    return fn();
  });
  return aiQueue;
}

function parseRetryAfterMs(headers) {
  try {
    const ra = headers?.get ? headers.get('Retry-After') : null;
    const n = ra != null ? Number(ra) : NaN;
    if (!Number.isFinite(n)) return null;
    return n * 1000;
  } catch {
    return null;
  }
}

function getLanAddress() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net && net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(text)
  });
  res.end(text);
}

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml; charset=utf-8';
    case '.woff':
      return 'font/woff';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('Body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', err => reject(err));
  });
}

async function callGroq(payload) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const e = new Error('Server misconfigured: GROQ_API_KEY missing');
    e.status = 500;
    throw e;
  }

  let attempt = 0;
  while (attempt <= AI_MAX_429_RETRIES) {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const text = await groqRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!groqRes.ok) {
      if (groqRes.status === 429 && attempt < AI_MAX_429_RETRIES) {
        const raMs = parseRetryAfterMs(groqRes.headers);
        const backoff = raMs != null ? raMs : Math.min(5000, 900 * Math.pow(2, attempt));
        await sleep(backoff);
        attempt++;
        continue;
      }
      const e = new Error('Groq API error');
      e.status = groqRes.status;
      e.details = data;
      throw e;
    }

    return data;
  }

  const e = new Error('Groq API error');
  e.status = 429;
  e.details = { error: 'Rate limited' };
  throw e;
}

function openAiMessagesToGemini(messages) {
  const contents = [];
  let systemInstruction = null;

  for (const msg of messages || []) {
    if (msg?.role === 'system') {
      systemInstruction = String(msg?.content ?? '');
      continue;
    }
    const role = msg?.role === 'assistant' ? 'model' : 'user';
    contents.push({ role, parts: [{ text: String(msg?.content ?? '') }] });
  }

  // Gemini requires at least one user message
  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: systemInstruction || 'Hello' }] });
    systemInstruction = null;
  }

  const body = { contents };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }
  return body;
}

async function callGemini(payload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const e = new Error('Server misconfigured: GEMINI_API_KEY missing');
    e.status = 500;
    throw e;
  }

  const model = String(payload?.model || 'gemini-2.0-flash');
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  const temperature = typeof payload?.temperature === 'number' ? payload.temperature : 0.2;
  const max_tokens = typeof payload?.max_tokens === 'number' ? payload.max_tokens : 2048;

  const body = openAiMessagesToGemini(messages);
  body.generationConfig = {
    temperature,
    maxOutputTokens: max_tokens
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const geminiRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const text = await geminiRes.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!geminiRes.ok) {
    const e = new Error('Gemini API error');
    e.status = geminiRes.status;
    e.details = data;
    throw e;
  }

  const content =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => String(p?.text ?? ''))
      .join('') || '';

  // Return OpenAI-like shape for frontend compatibility.
  return {
    id: `gemini-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop'
      }
    ],
    usage: {
      prompt_tokens: data?.usageMetadata?.promptTokenCount || 0,
      completion_tokens: data?.usageMetadata?.candidatesTokenCount || 0
    }
  };
}

async function callOllama(payload) {
  // Clients may still send Groq model ids (e.g. "llama-3.3-70b-versatile").
  // For Ollama, prefer OLLAMA_MODEL unless the client provided an Ollama-like id ("name:tag").
  const modelRaw = payload?.model;
  const looksLikeOllamaId = typeof modelRaw === 'string' && /.+:.+/.test(modelRaw);
  const model = looksLikeOllamaId ? modelRaw : OLLAMA_DEFAULT_MODEL;
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  const temperature = typeof payload?.temperature === 'number' ? payload.temperature : 0.2;
  const max_tokens = typeof payload?.max_tokens === 'number' ? payload.max_tokens : 2048;

  const ollamaRes = await fetch(`${OLLAMA_URL.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature,
        num_predict: max_tokens
      }
    })
  });

  const text = await ollamaRes.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!ollamaRes.ok) {
    const e = new Error('Ollama API error');
    e.status = ollamaRes.status;
    e.details = data;
    throw e;
  }

  const content = data?.message?.content;
  return {
    id: `ollama-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: content != null ? String(content) : '' },
        finish_reason: 'stop'
      }
    ]
  };
}

async function handleAiChat(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (e) {
    return sendJson(res, 400, { error: String(e.message || e) });
  }

  const { model, messages, temperature, max_tokens, jsonMode, response_format } = body || {};
  if (!model || !Array.isArray(messages)) {
    return sendJson(res, 400, { error: 'Invalid body: model and messages are required' });
  }

  const payload = {
    model,
    messages,
    temperature: typeof temperature === 'number' ? temperature : 0.2,
    max_tokens: typeof max_tokens === 'number' ? max_tokens : 2048
  };

  // Pass-through JSON mode for Groq/OpenAI-compatible backends.
  if (response_format && typeof response_format === 'object') {
    payload.response_format = response_format;
  } else if (jsonMode === true) {
    payload.response_format = { type: 'json_object' };
  }

  try {
    const provider = String((req && req.__gr_force_provider) || (body && body.provider) || AI_PROVIDER || 'groq').toLowerCase();

    const data = await enqueueAiCall(async () => {
      if (provider === 'ollama') return callOllama(payload);
      if (provider === 'gemini') return callGemini(payload);
      try {
        return await callGroq(payload);
      } catch (e) {
        if ((e?.status === 429 || e?.status === 401 || e?.status === 403 || e?.status === 500) && AI_FALLBACK_PROVIDER === 'ollama') {
          return callOllama(payload);
        }
        throw e;
      }
    });

    return sendJson(res, 200, data);
  } catch (e) {
    const status = Number.isFinite(Number(e?.status)) ? Number(e.status) : 500;
    return sendJson(res, status, { error: String(e.message || e), details: e?.details || null });
  }
}

async function handleGroqChat(req, res) {
  // Backward compatible: old endpoint always uses groq provider
  req.__gr_force_provider = 'groq';
  return handleAiChat(req, res);
}

async function handleOllamaChat(req, res) {
  // Convenience endpoint
  req.__gr_force_provider = 'ollama';
  return handleAiChat(req, res);
}

function safeResolveUrlToFile(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(cleanPath).replace(/^([/\\])+/, '');
  const fullPath = path.join(ROOT_DIR, normalized);
  if (!fullPath.startsWith(ROOT_DIR)) return null;
  return fullPath;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/ai/chat') {
    return handleAiChat(req, res);
  }

  if (url.pathname === '/api/ai/groq-chat') {
    return handleGroqChat(req, res);
  }

  if (url.pathname === '/api/ai/ollama-chat') {
    return handleOllamaChat(req, res);
  }

  // Static file serving
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendText(res, 405, 'Method not allowed');
  }

  const filePath = safeResolveUrlToFile(url.pathname === '/' ? '/index.html' : url.pathname);
  if (!filePath) {
    return sendText(res, 400, 'Bad request');
  }

  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      return sendText(res, 403, 'Forbidden');
    }

    const contentType = guessContentType(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store'
    });

    if (req.method === 'HEAD') {
      return res.end();
    }

    fs.createReadStream(filePath).pipe(res);
  } catch {
    return sendText(res, 404, 'Not found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[dev-server] Running on http://localhost:${PORT}`);
  if (HOST === '0.0.0.0') {
    const lan = getLanAddress();
    if (lan) {
      console.log(`[dev-server] LAN: http://${lan}:${PORT}`);
    }
  }
  console.log('[dev-server] Open: /generate-workout.html (AI) or /coach-dashboard.html (UI)');
});
