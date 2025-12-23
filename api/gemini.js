// api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    );

    const data = await geminiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to call Gemini API' });
  }
}

// Optional: for older Vercel runtime
export const config = {
  api: {
    bodyParser: true,
  },
};
