import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isProd = process.argv.includes('--prod')
const app = express()

app.use(express.json({ limit: '50mb' }))

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

app.post('/api/openai-transcribe', async (req, res) => {
  try {
    const finalKey = String(req.headers['x-openai-key'] || process.env.OPENAI_API_KEY || '').trim()
    if (!finalKey || !finalKey.startsWith('sk-')) return res.status(400).json({ error: 'OpenAI API Key is missing. Set key in Settings or server env OPENAI_API_KEY.' })

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${finalKey}`,
        'Content-Type': req.headers['content-type'] || 'multipart/form-data'
      },
      body: req,
      duplex: 'half'
    })

    const text = await response.text()
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    res.status(response.status).send(text)
  } catch (error) {
    console.error('[OpenAI Transcribe Error]', error)
    res.status(500).json({ error: error.message || 'OpenAI transcription failed.' })
  }
})

app.post('/api/openai-clean-subtitles', async (req, res) => {
  try {
    const { text = '', apiKey = '' } = req.body || {}
    const finalKey = String(req.headers['x-openai-key'] || apiKey || process.env.OPENAI_API_KEY || '').trim()
    if (!finalKey || !finalKey.startsWith('sk-')) return res.status(400).json({ error: 'OpenAI API Key is missing. Set key in Settings or server env OPENAI_API_KEY.' })
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Text is missing.' })

    const prompt = `你是英语字幕整理助手。
下面是一段英语口语的 Whisper 自动转录结果
（无标点，可能有分割错误）：

${text}

请把它整理成干净的英语句子列表，要求：
1. 加上正确的标点符号
2. 每个自然句子独占一行
3. 不要合并多个独立句子
4. 不要拆分本来是一句话的内容
5. 修正明显的转录错误
6. 不要改变原来说的内容，只整理格式
7. 直接输出句子列表，每行一句，
   不要序号，不要解释`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${finalKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [
          { role: 'system', content: 'You clean English transcript subtitles without adding new content.' },
          { role: 'user', content: prompt }
        ]
      })
    })

    if (!response.ok) return res.status(response.status).json({ error: await response.text() })
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    const sentences = content
      .split('\n')
      .map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
      .filter(Boolean)
    res.status(200).json({ sentences, raw: content })
  } catch (error) {
    console.error('[OpenAI Clean Subtitles Error]', error)
    res.status(500).json({ error: error.message || 'OpenAI subtitle cleaning failed.' })
  }
})

if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))
} else {
  const vite = await createViteServer({ server: { middlewareMode: true, hmr: false }, appType: 'spa' })
  app.use(vite.middlewares)
}

const port = Number(process.env.PORT || 5181)
const host = process.env.HOST || '127.0.0.1'
app.listen(port, host, () => {
  console.log('')
  console.log('  Kevin English Learning System V3.9.5')
  console.log(`  Local:   http://${host}:${port}/`)
  console.log('  Tip: set HOST=0.0.0.0 if you need phone testing on the same Wi-Fi.')
  console.log('')
})
