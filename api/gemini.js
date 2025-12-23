// api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  try {
    // Properly format the body for Gemini
    const geminiBody = {
      contents: req.body.contents || [{ parts: [{ text: req.body.prompt || '' }] }]  // fallback if needed
    };

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', data);  // This will show exact error in Vercel logs
      res.status(geminiResponse.status).json({ error: 'Gemini API error', details: data });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to call Gemini API', details: error.message });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
