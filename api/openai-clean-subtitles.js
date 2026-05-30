export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const apiKey = String(req.headers['x-openai-key'] || body.apiKey || process.env.OPENAI_API_KEY || '').trim()
    const text = String(body.text || '').trim()

    if (!apiKey || !apiKey.startsWith('sk-')) {
      res.status(400).json({ error: 'OpenAI API Key is missing. Add it in Settings or set OPENAI_API_KEY in Vercel.' })
      return
    }
    if (!text) {
      res.status(400).json({ error: 'Text is missing.' })
      return
    }

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

    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [
          { role: 'system', content: 'You clean English transcript subtitles without adding new content.' },
          { role: 'user', content: prompt }
        ]
      })
    })

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: await upstream.text() })
      return
    }

    const data = await upstream.json()
    const content = data.choices?.[0]?.message?.content || ''
    const sentences = content
      .split('\n')
      .map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
      .filter(Boolean)

    res.status(200).json({ sentences, raw: content })
  } catch (error) {
    res.status(500).json({ error: error?.message || 'OpenAI subtitle cleaning failed.' })
  }
}
