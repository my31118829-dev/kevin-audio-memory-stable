export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const apiKey = String(body?.apiKey || process.env.OPENAI_API_KEY || '').trim()
    const text = String(body?.text || '').trim()
    const voice = String(body?.voice || 'alloy').trim()

    if (!apiKey || !apiKey.startsWith('sk-')) {
      res.status(400).json({
        error: 'OpenAI API Key is missing. Fill Settings key or set OPENAI_API_KEY in Vercel.'
      })
      return
    }

    if (!text) {
      res.status(400).json({ error: 'Text is missing.' })
      return
    }

    const upstream = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice,
        input: text,
        format: 'mp3'
      })
    })

    if (!upstream.ok) {
      const message = await upstream.text()
      res.status(upstream.status).json({ error: message || 'OpenAI voice failed.' })
      return
    }

    const audioBuffer = Buffer.from(await upstream.arrayBuffer())
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(audioBuffer)
  } catch (error) {
    res.status(500).json({ error: error?.message || 'OpenAI voice failed.' })
  }
}
