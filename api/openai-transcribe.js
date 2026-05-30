export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  try {
    const apiKey = String(req.headers['x-openai-key'] || process.env.OPENAI_API_KEY || '').trim()
    if (!apiKey || !apiKey.startsWith('sk-')) {
      res.status(400).json({ error: 'OpenAI API Key is missing. Add it in Settings or set OPENAI_API_KEY in Vercel.' })
      return
    }

    const upstream = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': req.headers['content-type'] || 'multipart/form-data'
      },
      body: req,
      duplex: 'half'
    })

    const text = await upstream.text()
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
    res.status(upstream.status).send(text)
  } catch (error) {
    res.status(500).json({ error: error?.message || 'OpenAI transcription failed.' })
  }
}
