import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isProd = process.argv.includes('--prod')
const app = express()

app.use(express.json({ limit: '2mb' }))

app.post('/api/openai-voice', async (req, res) => {
  try {
    const { apiKey, text, voice = 'alloy' } = req.body || {}
    const finalKey = (apiKey || process.env.OPENAI_API_KEY || '').trim()
    if (!finalKey || !finalKey.startsWith('sk-')) return res.status(400).json({ error: 'OpenAI API Key is missing. Set key in Settings or server env OPENAI_API_KEY.' })
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Text is missing.' })

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${finalKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice, input: text, format: 'mp3' })
    })

    if (!response.ok) return res.status(response.status).json({ error: await response.text() })
    const buffer = Buffer.from(await response.arrayBuffer())
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-store')
    res.send(buffer)
  } catch (error) {
    console.error('[OpenAI Voice Error]', error)
    res.status(500).json({ error: error.message || 'OpenAI voice failed.' })
  }
})

if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))
} else {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

const port = Number(process.env.PORT || 5181)
app.listen(port, '0.0.0.0', () => {
  console.log('')
  console.log('  Kevin Audio Memory Stable (Dialogue Upgrade Baseline)')
  console.log(`  Local:   http://localhost:${port}/`)
  console.log(`  Network: use your Mac IP, e.g. http://192.168.x.x:${port}/`)
  console.log('')
})
