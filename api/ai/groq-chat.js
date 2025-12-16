module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: GROQ_API_KEY missing' });
  }

  try {
    const { model, messages, temperature, max_tokens } = req.body || {};

    if (!model || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid body: model and messages are required' });
    }

    const payload = {
      model,
      messages,
      temperature: typeof temperature === 'number' ? temperature : 0.2,
      max_tokens: typeof max_tokens === 'number' ? max_tokens : 2048
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
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
      return res.status(response.status).json({
        error: 'Groq API error',
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected server error', details: String(err?.message || err) });
  }
};
