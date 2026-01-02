// Unified AI proxy (Groq + optional Gemini)
// Used by the frontend to avoid exposing provider API keys.

function clampNumber(value, { min, max, fallback }) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
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
    contents.push({
      role,
      parts: [{ text: String(msg?.content ?? '') }]
    });
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      provider = 'groq',
      model,
      messages,
      temperature,
      max_tokens,
      maxTokens,
      response_format,
      jsonMode
    } = req.body || {};

    if (!model || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid body: model and messages are required' });
    }

    const safeTemperature = clampNumber(temperature, { min: 0, max: 2, fallback: 0.2 });
    const safeMaxTokens = clampNumber(max_tokens ?? maxTokens, { min: 1, max: 4096, fallback: 2048 });

    const p = String(provider || 'groq').toLowerCase();

    if (p === 'gemini') {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.status(500).json({ error: 'Server misconfigured: GEMINI_API_KEY missing' });
      }

      const geminiBody = openAiMessagesToGemini(messages);
      geminiBody.generationConfig = {
        temperature: safeTemperature,
        maxOutputTokens: safeMaxTokens
      };

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(geminiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Gemini API error', details: data });
      }

      const content =
        data?.candidates?.[0]?.content?.parts
          ?.map((p) => String(p?.text ?? ''))
          .join('') || '';

      // Return OpenAI-like shape for frontend compatibility.
      return res.status(200).json({
        provider: 'gemini',
        model,
        choices: [{ message: { role: 'assistant', content } }],
        usage: {
          prompt_tokens: data?.usageMetadata?.promptTokenCount || 0,
          completion_tokens: data?.usageMetadata?.candidatesTokenCount || 0
        },
        raw: data
      });
    }

    // Default: Groq OpenAI-compatible endpoint
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return res.status(500).json({ error: 'Server misconfigured: GROQ_API_KEY missing' });
    }

    const payload = {
      model,
      messages: (messages || []).map((m) => ({
        role: m?.role,
        content: String(m?.content ?? '').slice(0, 12000)
      })),
      temperature: safeTemperature,
      max_tokens: safeMaxTokens
    };

    // Allow callers to request JSON mode.
    if (response_format && typeof response_format === 'object') {
      payload.response_format = response_format;
    } else if (jsonMode === true) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Groq API error', details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected server error', details: String(err?.message || err) });
  }
};
