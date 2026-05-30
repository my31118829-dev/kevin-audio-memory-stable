import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const CARD_KEY = 'kam_stable_cards_v172_dialogue'
const SETTINGS_KEY = 'kam_stable_settings_v172_dialogue'
const QUEUE_KEY = 'kam_stable_learning_queue_v172_dialogue'

const defaultSettings = {
  apiKey: '',
  voice: 'alloy',
  contentVoice: 'onyx',
  exampleVoice: 'nova',
  fontSize: 'large',
  subtitleMode: 'BOTH',
  studyMode: 'LISTEN',
  pauseSeconds: 4,
  rolePlayPauseSeconds: 4,
  audioRepeat: 1,
  openaiStatus: 'Not tested',
  lastError: ''
}

const sampleText = `TYPE:
CHUNK

CONTENT:
in my free time

MEANING:
在空闲时间

EXAMPLES:
I study English in my free time.
What do you do in your free time?
My daughter likes reading in her free time.

SOURCE:
English File Unit 3

CATEGORY:
Daily Life

TAGS:
daily-life

---

TYPE:
CHUNK

CONTENT:
on weekends

MEANING:
在周末

EXAMPLES:
I usually stay at home on weekends.
We sometimes go shopping on weekends.
What do you usually do on weekends?

SOURCE:
English File Unit 3

CATEGORY:
Routine

TAGS:
routine

---

TYPE:
SENTENCE

CONTENT:
I usually study English at night.

MEANING:
我通常晚上学习英语。

EXAMPLES:
I usually study English at night.
I sometimes study English after dinner.

SOURCE:
Kevin Daily English

CATEGORY:
Routine

TAGS:
routine`

const chatGptFormatPrompt = `请按下面格式生成英语学习内容。内容主题、数量、难度可以按我的要求自由生成，但格式必须严格保持一致，方便程序自动导入。

重要格式要求：
1. 每一条内容必须用 TYPE 开始。
2. TYPE 可以写 CHUNK、SENTENCE、PATTERN、DIALOGUE。
3. 每一条都必须包含 CONTENT、MEANING、EXAMPLES、SOURCE、CATEGORY、TAGS。
4. 如果是句子，可以选择加入 PATTERN。
5. 如果是句型，TYPE 写 PATTERN，CONTENT 写句型，EXAMPLES 建议写 4 个例句。
6. 如果是迷你对话，TYPE 写 DIALOGUE，CONTENT 写主题，DIALOGUE 或 MINI_DIALOGUE 写 6-10 句对话。
7. 如果要显示 Mini Dialogue，必须加入 DIALOGUE 或 MINI_DIALOGUE；如果没有，程序不会自动编造对话。
8. EXAMPLES 每行一句英文；如需要中文，可以用 “英文 = 中文”。
9. 多条内容之间可以用 --- 分隔。
10. 对话每行请保留说话人标签，例如 A: / B: / Kevin: / Waitress:；程序显示标签，但播放音频时会自动过滤标签，只读实际台词。

格式样例：

TYPE:
CHUNK

CONTENT:
in my free time

MEANING:
在空闲时间

EXAMPLES:
I study English in my free time.
What do you do in your free time?

SOURCE:
English File Unit 3

CATEGORY:
Daily Life

TAGS:
daily-life

---

TYPE:
SENTENCE

CONTENT:
Can I have a small flat white, please?

MEANING:
请给我一杯小杯平白咖啡。

EXAMPLES:
Can I have a small flat white, please?
Can I have a large cappuccino, please?

PATTERN:
Can I have + noun + please?

MINI_DIALOGUE:
A: Can I have a small flat white, please?
B: Sure. Anything else?
A: No, thanks.

SOURCE:
Australian Cafe English

CATEGORY:
Cafe

TAGS:
coffee-shop

---

TYPE:
PATTERN

CONTENT:
Can I have + noun + please?

MEANING:
我可以要……吗？

EXAMPLES:
Can I have a small flat white, please?
Can I have a glass of water, please?
Can I have a receipt, please?
Can I have one more minute, please?

SOURCE:
Australian Cafe English

CATEGORY:
Sentence Pattern

TAGS:
pattern, cafe

---

TYPE:
DIALOGUE

CONTENT:
Ordering coffee at a cafe

MEANING:
在咖啡店点咖啡

MINI_DIALOGUE:
A: Hi, what can I get for you?
B: Can I have a small flat white, please?
A: Sure. Is that for here or take away?
B: Take away, please.
A: No worries. Anything else?
B: That's all, thanks.

SOURCE:
Australian Cafe English

CATEGORY:
Mini Dialogue

TAGS:
dialogue, cafe`

function uid() { return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}` }
function load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } }
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn('Local save failed. The app will keep running without crashing.', err)
    return false
  }
}
const PREPARE_BATCH_SIZE = 1
const PREPARE_CLIPS_PER_RUN = 4
const VOICE_TIMEOUT_MS = 45000
const SILENT_AUDIO_UNLOCK = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQIAAAAAAA=='
const AUDIO_DB_NAME = 'kam_stable_audio_db_v172_dialogue'
const AUDIO_DB_VERSION = 2
const AUDIO_STORE_NAME = 'clips'
const AUDIO_META_STORE_NAME = 'clipMeta'
const AUDIO_CACHE_SOFT_LIMIT_BYTES = 80 * 1024 * 1024
const AUDIO_CACHE_TARGET_BYTES = 60 * 1024 * 1024
const IMPORT_FIELD_NAMES = ['SOURCE_TITLE','SOURCE','CATEGORY','TAGS','TYPE','CONTENT','MEANING','EXAMPLES','PATTERN','DIALOGUE','MINI_DIALOGUE','MINI DIALOGUE']
function escapeRegExp(str) { return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
function parseTags(text) {
  return String(text || '')
    .split(/[,，\n]/)
    .map(x => cleanLineText(x))
    .filter(Boolean)
}
function getField(block, name) {
  const names = IMPORT_FIELD_NAMES.map(x => x.toUpperCase())
  const target = String(name || '').toUpperCase()
  const lines = String(block || '').replace(/\r\n/g, '\n').split('\n')
  let collecting = false
  const out = []
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z_]+)\s*:\s*(.*)$/i)
    if (m && names.includes(m[1].toUpperCase())) {
      if (collecting) break
      if (m[1].toUpperCase() === target) {
        collecting = true
        if (m[2]) out.push(m[2])
      }
      continue
    }
    if (collecting) out.push(line)
  }
  return out.join('\n').trim()
}
function cleanLineText(line) {
  return String(line || '')
    .replace(/^[-•*]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .trim()
}
function splitEnglishChinese(line) {
  const clean = cleanLineText(line)
  const parts = clean.split(/\s+=\s+|\s+＝\s+/)
  return { en: (parts[0] || clean).trim(), cn: (parts[1] || '').trim() }
}
function parseLinesField(text) {
  return (text || '').split('\n').map(cleanLineText).filter(Boolean)
}
function normalizeType(rawType, fallback = 'CHUNK') {
  const upper = String(rawType || fallback || 'CHUNK').trim().toUpperCase()
  if (upper === 'AUTO') return 'AUTO'
  if (upper === 'MINI_DIALOGUE' || upper === 'MINI DIALOGUE') return 'DIALOGUE'
  return ['WORD','CHUNK','SENTENCE','PATTERN','DIALOGUE'].includes(upper) ? upper : fallback
}
function detectImportMeta(text, fallback = {}) {
  const normalized = (text || '').replace(/\r\n/g, '\n')
  const source = getField(normalized, 'SOURCE_TITLE') || getField(normalized, 'SOURCE') || fallback.source || 'Uncategorized'
  const category = getField(normalized, 'CATEGORY') || fallback.category || 'General'
  const type = normalizeType(getField(normalized, 'TYPE') || fallback.type || 'AUTO', 'AUTO')
  const tagsRaw = getField(normalized, 'TAGS') || (Array.isArray(fallback.tags) ? fallback.tags.join(',') : fallback.tagsText) || ''
  const tags = parseTags(tagsRaw)
  return { source, category, type, tags, tagsText: tags.join(', ') }
}
function normalizeExample(ex) {
  if (typeof ex === 'string') return { id: uid(), text: ex, audio: '' }
  return { id: ex.id || uid(), text: ex.text || '', audio: ex.audio || ex.audioDataUrl || '' }
}
function normalizeCard(card) {
  const normalized = {
    ...card,
    id: card.id || uid(),
    type: (card.type || 'CHUNK').toUpperCase(),
    content: card.content || '',
    meaning: card.meaning || '',
    pattern: card.pattern || '',
    dialogue: Array.isArray(card.dialogue) ? card.dialogue.map(x => ({ id: x.id || uid(), text: cleanLineText(x.text || x) })).filter(x => x.text) : [],
    source: card.source || 'Uncategorized',
    category: card.category || 'General',
    tags: card.tags || [],
    examples: (card.examples || []).map(normalizeExample),
    dialogueAudios: Array.isArray(card.dialogueAudios) ? card.dialogueAudios : [],
    contentAudio: card.contentAudio || card.contentAudioDataUrl || card.audioDataUrl || '',
    lastReviewAt: card.lastReviewAt || null,
    nextReviewAt: card.nextReviewAt || null,
    status: card.status || 'New',
    goodCount: card.goodCount || 0,
    reviewLevel: Number(card.reviewLevel ?? card.goodCount ?? 0),
    wrongCount: card.wrongCount || 0,
    reviewCount: card.reviewCount || 0
  }
  if (isAutoGeneratedDialogue(normalized)) {
    normalized.dialogue = []
    normalized.dialogueAudios = []
  }
  return normalized
}
function makeCard({ type, content, meaning, examples, source, category, tags, pattern = '', dialogue = [] }) {
  return normalizeCard({
    id: uid(), type, content, meaning, pattern,
    dialogue: dialogue.map(text => ({ id: uid(), text: cleanLineText(text), audio: '' })).filter(x => x.text),
    examples: examples.map(text => ({ id: uid(), text: splitEnglishChinese(text).en, audio: '' })).filter(x => x.text),
    source: source || 'Uncategorized', category: category || 'General', tags,
    contentAudio: '', status: 'New', goodCount: 0, wrongCount: 0, reviewCount: 0,
    lastReviewAt: null, nextReviewAt: null, createdAt: Date.now(), updatedAt: Date.now()
  })
}
function smartParseLoose(text, defaults) {
  const lines = text.split('\n').map(x => x.trim()).filter(Boolean)
  const cards = []
  for (let i = 0; i < lines.length; i += 3) {
    const content = lines[i]
    if (!content) continue
    const meaning = lines[i + 1] || ''
    const example = lines[i + 2] || ''
    const type = defaults.type !== 'AUTO' ? defaults.type : (content.split(' ').length >= 5 ? 'SENTENCE' : 'CHUNK')
    cards.push(makeCard({ type, content, meaning, examples: example ? [example] : [], source: defaults.source, category: defaults.category, tags: defaults.tags }))
  }
  return cards
}
function splitImportBlocks(text) {
  const normalized = String(text || '').replace(/\r\n/g, '\n').trim()
  if (!normalized) return []
  const dividerBlocks = normalized.split(/\n\s*---+\s*\n/g).map(x => x.trim()).filter(Boolean)
  const blocks = []
  for (const part of dividerBlocks) {
    const typeMatches = [...part.matchAll(/(^|\n)\s*TYPE\s*:/gi)]
    if (typeMatches.length <= 1) {
      blocks.push(part)
      continue
    }
    for (let i = 0; i < typeMatches.length; i++) {
      const start = typeMatches[i].index + typeMatches[i][1].length
      const end = i + 1 < typeMatches.length ? typeMatches[i + 1].index : part.length
      const block = part.slice(start, end).trim()
      if (block) blocks.push(block)
    }
  }
  return blocks
}
function parseImportText(text, defaults) {
  const detected = detectImportMeta(text, defaults)
  const finalDefaults = { ...defaults, source: detected.source, category: detected.category, type: detected.type, tags: detected.tags }
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []
  if (!/TYPE:/i.test(normalized) && !/CONTENT:/i.test(normalized)) return smartParseLoose(normalized, finalDefaults)
  return splitImportBlocks(normalized)
    .filter(x => x && /CONTENT\s*:/i.test(x))
    .map(block => {
      const rawType = normalizeType(getField(block, 'TYPE') || finalDefaults.type || 'CHUNK', 'CHUNK')
      const content = getField(block, 'CONTENT')
      const type = rawType === 'AUTO' ? (content.split(/\s+/).filter(Boolean).length >= 5 ? 'SENTENCE' : 'CHUNK') : rawType
      const examples = parseLinesField(getField(block, 'EXAMPLES')).map(x => splitEnglishChinese(x).en).filter(Boolean)
      const dialogueText = getField(block, 'DIALOGUE') || getField(block, 'MINI_DIALOGUE') || getField(block, 'MINI DIALOGUE')
      const dialogue = parseLinesField(dialogueText).map(x => splitEnglishChinese(x).en).filter(Boolean)
      return makeCard({
        type, content, meaning: getField(block, 'MEANING'), examples, dialogue,
        pattern: getField(block, 'PATTERN'),
        source: getField(block, 'SOURCE_TITLE') || getField(block, 'SOURCE') || finalDefaults.source,
        category: getField(block, 'CATEGORY') || finalDefaults.category,
        tags: parseTags(getField(block, 'TAGS') || finalDefaults.tags.join(','))
      })
    }).filter(c => c.content)
}
function importKey(c) {
  return `${(c.source || '').toLowerCase().trim()}::${(c.content || '').toLowerCase().trim()}`
}
function dueCards(cards) {
  const now = Date.now()
  return cards
    .filter(c => c.lastReviewAt && c.nextReviewAt && c.nextReviewAt <= now)
    .sort((a, b) => {
      const aWeak = a.status === 'Weak' ? -1 : 0
      const bWeak = b.status === 'Weak' ? -1 : 0
      if (aWeak !== bWeak) return aWeak - bWeak
      return (a.nextReviewAt || 0) - (b.nextReviewAt || 0)
    })
}
function startOfTomorrow(now = Date.now()) {
  const d = new Date(now)
  d.setHours(24, 0, 0, 0)
  return d.getTime()
}
function addDays(now, days) { return now + days * 24 * 60 * 60 * 1000 }
function reviewIntervalDays(level) {
  if (level <= 1) return 1
  if (level === 2) return 3
  if (level === 3) return 7
  if (level === 4) return 14
  if (level === 5) return 30
  return 60
}
function formatReviewDate(ts) {
  if (!ts) return 'Not scheduled'
  const d = new Date(ts)
  const today = new Date(); today.setHours(0,0,0,0)
  const target = new Date(ts); target.setHours(0,0,0,0)
  const diff = Math.round((target - today) / (24*60*60*1000))
  if (diff < 0) return 'Overdue'
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}
function countAudio(card) {
  if (['SENTENCE', 'DIALOGUE'].includes((card.type || '').toUpperCase())) {
    const lines = makeDialogue(card)
    const audios = Array.isArray(card.dialogueAudios) ? card.dialogueAudios : []
    const total = 1 + lines.length
    const ready = (card.contentAudio ? 1 : 0) + lines.filter((_, i) => audios[i]).length
    return { ready, total }
  }
  const total = 1 + (card.examples || []).length
  const ready = (card.contentAudio ? 1 : 0) + (card.examples || []).filter(x => x.audio).length
  return { ready, total }
}
function isReady(card) { const c = countAudio(card); return c.ready === c.total && c.total > 0 }
async function hasPlayableAudio(card) {
  const normalized = normalizeCard(card)
  if (!(await audioExists(normalized.contentAudio))) return false
  if (['SENTENCE', 'DIALOGUE'].includes((normalized.type || '').toUpperCase())) {
    const lines = makeDialogue(normalized)
    const dialogueAudios = Array.isArray(normalized.dialogueAudios) ? normalized.dialogueAudios : []
    for (let i = 0; i < lines.length; i++) {
      if (!(await audioExists(dialogueAudios[i]))) return false
    }
    return true
  }
  for (const ex of normalized.examples || []) {
    if (!(await audioExists(ex.audio))) return false
  }
  return true
}
function isInlineAudio(value) {
  return typeof value === 'string' && value.startsWith('data:audio')
}
function isAudioBlob(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob
}
function isAudioRef(value) {
  return typeof value === 'string' && value.startsWith('idb:')
}
function audioRef(cardId, kind, index = 'main') {
  return `idb:${cardId}:${kind}:${index}`
}
let audioTrimTimer = null
function openAudioDb() {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('Audio storage is unavailable.'))
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(AUDIO_DB_NAME, AUDIO_DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) db.createObjectStore(AUDIO_STORE_NAME)
      if (!db.objectStoreNames.contains(AUDIO_META_STORE_NAME)) db.createObjectStore(AUDIO_META_STORE_NAME, { keyPath: 'key' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Audio storage failed.'))
  })
}
function audioStorageKey(ref) {
  return String(ref || '').replace(/^idb:/, '')
}
function estimateAudioBytes(audioData) {
  if (isAudioBlob(audioData)) return audioData.size || 0
  if (typeof audioData === 'string') return Math.ceil(audioData.length * 0.75)
  return 0
}
async function putStoredAudio(ref, audioData) {
  const db = await openAudioDb()
  return new Promise((resolve, reject) => {
    const stores = db.objectStoreNames.contains(AUDIO_META_STORE_NAME)
      ? [AUDIO_STORE_NAME, AUDIO_META_STORE_NAME]
      : [AUDIO_STORE_NAME]
    const tx = db.transaction(stores, 'readwrite')
    const key = audioStorageKey(ref)
    tx.objectStore(AUDIO_STORE_NAME).put(audioData, key)
    if (stores.includes(AUDIO_META_STORE_NAME)) {
      tx.objectStore(AUDIO_META_STORE_NAME).put({
        key,
        bytes: estimateAudioBytes(audioData),
        updatedAt: Date.now(),
        lastUsedAt: Date.now()
      })
    }
    tx.oncomplete = () => resolve(ref)
    tx.onerror = () => reject(tx.error || new Error('Audio save failed.'))
  })
}
async function touchStoredAudio(ref) {
  const db = await openAudioDb()
  if (!db.objectStoreNames.contains(AUDIO_META_STORE_NAME)) return
  const key = audioStorageKey(ref)
  return new Promise(resolve => {
    const tx = db.transaction(AUDIO_META_STORE_NAME, 'readwrite')
    const store = tx.objectStore(AUDIO_META_STORE_NAME)
    const request = store.get(key)
    request.onsuccess = () => {
      if (request.result) store.put({ ...request.result, lastUsedAt: Date.now() })
    }
    tx.oncomplete = resolve
    tx.onerror = resolve
  })
}
async function getStoredAudio(ref) {
  if (!isAudioRef(ref)) return ref || ''
  const db = await openAudioDb()
  return new Promise((resolve, reject) => {
    const request = db.transaction(AUDIO_STORE_NAME, 'readonly')
      .objectStore(AUDIO_STORE_NAME)
      .get(audioStorageKey(ref))
    request.onsuccess = () => {
      if (request.result) touchStoredAudio(ref).catch(() => {})
      resolve(request.result || '')
    }
    request.onerror = () => reject(request.error || new Error('Audio read failed.'))
  })
}
async function trimAudioCacheIfNeeded() {
  const db = await openAudioDb()
  if (!db.objectStoreNames.contains(AUDIO_META_STORE_NAME)) return
  const metas = await new Promise(resolve => {
    const request = db.transaction(AUDIO_META_STORE_NAME, 'readonly').objectStore(AUDIO_META_STORE_NAME).getAll()
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : [])
    request.onerror = () => resolve([])
  })
  let total = metas.reduce((sum, item) => sum + Number(item.bytes || 0), 0)
  if (total <= AUDIO_CACHE_SOFT_LIMIT_BYTES) return
  const remove = []
  for (const item of [...metas].sort((a, b) => Number(a.lastUsedAt || a.updatedAt || 0) - Number(b.lastUsedAt || b.updatedAt || 0))) {
    if (total <= AUDIO_CACHE_TARGET_BYTES) break
    remove.push(item.key)
    total -= Number(item.bytes || 0)
  }
  if (!remove.length) return
  await new Promise(resolve => {
    const tx = db.transaction([AUDIO_STORE_NAME, AUDIO_META_STORE_NAME], 'readwrite')
    const clips = tx.objectStore(AUDIO_STORE_NAME)
    const meta = tx.objectStore(AUDIO_META_STORE_NAME)
    remove.forEach(key => {
      clips.delete(key)
      meta.delete(key)
    })
    tx.oncomplete = resolve
    tx.onerror = resolve
  })
}
function scheduleAudioCacheTrim() {
  if (typeof window === 'undefined') return
  if (audioTrimTimer) window.clearTimeout(audioTrimTimer)
  audioTrimTimer = window.setTimeout(() => {
    trimAudioCacheIfNeeded().catch(err => console.warn('Audio cache trim failed.', err))
  }, 1000)
}
async function storeAudioClip(cardId, kind, index, audioData) {
  if (!audioData) return ''
  if (!isInlineAudio(audioData) && !isAudioBlob(audioData)) return audioData
  const ref = audioRef(cardId, kind, index)
  try {
    await putStoredAudio(ref, audioData)
    scheduleAudioCacheTrim()
    return ref
  } catch (err) {
    console.warn('IndexedDB audio save failed; falling back to inline audio.', err)
    return isAudioBlob(audioData) ? '' : audioData
  }
}
function playableAudioUrl(audioData) {
  if (!audioData) return ''
  if (isAudioBlob(audioData)) return URL.createObjectURL(audioData)
  return audioData
}
function releasePlayableAudio(audioUrl) {
  if (typeof audioUrl === 'string' && audioUrl.startsWith('blob:')) {
    try { URL.revokeObjectURL(audioUrl) } catch {}
  }
}
async function audioExists(value) {
  const audio = await resolveAudioClip(value)
  if (!audio) return false
  releasePlayableAudio(audio)
  return true
}
async function resolveAudioClip(value) {
  if (!value) return ''
  try {
    return playableAudioUrl(await getStoredAudio(value))
  } catch (err) {
    console.warn('IndexedDB audio read failed.', err)
    return ''
  }
}
async function migrateCardAudioToIndexedDb(card) {
  let changed = false
  const updated = normalizeCard(card)
  if (isInlineAudio(updated.contentAudio)) {
    const ref = await storeAudioClip(updated.id, 'content', 'main', updated.contentAudio)
    if (ref && ref !== updated.contentAudio) {
      updated.contentAudio = ref
      changed = true
    }
  }
  if (Array.isArray(updated.dialogueAudios)) {
    const dialogueAudios = [...updated.dialogueAudios]
    for (let i = 0; i < dialogueAudios.length; i++) {
      if (!isInlineAudio(dialogueAudios[i])) continue
      const ref = await storeAudioClip(updated.id, 'dialogue', i, dialogueAudios[i])
      if (ref && ref !== dialogueAudios[i]) {
        dialogueAudios[i] = ref
        changed = true
      }
    }
    updated.dialogueAudios = dialogueAudios
  }
  if (Array.isArray(updated.examples)) {
    const examples = []
    for (let i = 0; i < updated.examples.length; i++) {
      const ex = updated.examples[i]
      if (isInlineAudio(ex.audio)) {
        const ref = await storeAudioClip(updated.id, 'example', i, ex.audio)
        examples.push(ref && ref !== ex.audio ? { ...ex, audio: ref } : ex)
        if (ref && ref !== ex.audio) changed = true
      } else {
        examples.push(ex)
      }
    }
    updated.examples = examples
  }
  return { card: updated, changed }
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function updateSchedule(card, rating) {
  const now = Date.now()
  let reviewLevel = Number(card.reviewLevel || card.goodCount || 0)
  let goodCount = Number(card.goodCount || 0)
  let wrongCount = Number(card.wrongCount || 0)
  let status = card.status || 'New'
  let nextReviewAt = null

  if (rating === 'Again') {
    wrongCount += 1
    reviewLevel = Math.max(0, reviewLevel - 1)
    status = 'Weak'
    nextReviewAt = startOfTomorrow(now)
  } else {
    goodCount += 1
    reviewLevel = Math.min(6, reviewLevel + 1)
    status = reviewLevel >= 5 ? 'Mastered' : 'Learning'
    nextReviewAt = addDays(now, reviewIntervalDays(reviewLevel))
  }

  return {
    ...card,
    reviewLevel,
    goodCount,
    wrongCount,
    status,
    reviewCount: (card.reviewCount || 0) + 1,
    lastReviewAt: now,
    nextReviewAt,
    updatedAt: now
  }
}
function groupSources(cards) {
  const map = new Map()
  for (const card of cards) {
    const key = card.source || 'Uncategorized'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(card)
  }
  return [...map.entries()].map(([source, items]) => {
    const chunkCount = items.filter(x => matchesLearnType(x, 'CHUNKS')).length
    const sentenceCount = items.filter(x => cardType(x) === 'SENTENCE').length
    const patternCount = items.filter(x => cardType(x) === 'PATTERN').length
    const dialogueCount = items.filter(x => cardType(x) === 'DIALOGUE').length
    const ready = items.filter(isReady).length
    const categories = [...new Set(items.map(x => x.category || 'General'))]
    return { source, items, chunkCount, sentenceCount, patternCount, dialogueCount, ready, categories }
  }).sort((a, b) => a.source.localeCompare(b.source))
}
function makeDialogue(card) {
  const imported = Array.isArray(card.dialogue) ? card.dialogue.filter(x => (x.text || '').trim()) : []
  if (imported.length) return imported.map((line, idx) => ({ id: line.id || `${card.id}-d${idx}`, text: cleanLineText(line.text || line) }))
  return []
}
function parseDialogueLine(line) {
  const raw = cleanLineText(typeof line === 'string' ? line : line?.text || '')
  const match = raw.match(/^\s*([A-Za-z][A-Za-z .'-]{0,30}|[A-Z])\s*[:：]\s*(.+)$/)
  if (!match) return { speaker: '', text: raw }
  return { speaker: cleanLineText(match[1]), text: cleanLineText(match[2]) }
}
function dialogueAudioText(line) {
  return parseDialogueLine(line).text
}
function dialogueSpeaker(line) {
  return parseDialogueLine(line).speaker
}
function dialogueRoles(card) {
  const roles = makeDialogue(card).map(line => dialogueSpeaker(line.text || line)).filter(Boolean)
  return [...new Set(roles)].slice(0, 6)
}
function isAutoGeneratedDialogue(card) {
  if (!['SENTENCE', 'DIALOGUE'].includes((card.type || '').toUpperCase())) return false
  const lines = Array.isArray(card.dialogue) ? card.dialogue.map(x => cleanLineText(x.text || x)) : []
  if (!lines.length) return false
  const content = cleanLineText(card.content || '')
  if (/^When do you use this sentence\?$/i.test(lines[0]) || /^Can you answer this question\?$/i.test(lines[0])) return true
  if (lines.length !== 3) return false
  return (
    /^When do you use this sentence\?$/i.test(lines[0]) ||
    /^Can you answer this question\?$/i.test(lines[0])
  ) && cleanLineText(lines[1]) === content && /^I can say:/i.test(lines[2])
}
function sameDialogueLines(a = [], b = []) {
  const left = a.map(x => cleanLineText(x.text || x)).filter(Boolean)
  const right = b.map(x => cleanLineText(x.text || x)).filter(Boolean)
  if (left.length !== right.length) return false
  return left.every((line, index) => line === right[index])
}
function cardType(cardOrType) {
  return String(typeof cardOrType === 'string' ? cardOrType : cardOrType?.type || 'CHUNK').toUpperCase()
}
function chunkLabel(type) {
  const t = cardType(type)
  if (t === 'SENTENCE') return 'Sentence'
  if (t === 'PATTERN') return 'Pattern'
  if (t === 'DIALOGUE') return 'Mini Dialogue'
  return 'Chunk'
}
function matchesLearnType(card, learnType) {
  const t = cardType(card)
  if (learnType === 'CHUNKS') return t === 'CHUNK' || t === 'WORD'
  if (learnType === 'SENTENCES') return t === 'SENTENCE'
  if (learnType === 'PATTERNS') return t === 'PATTERN'
  if (learnType === 'DIALOGUES') return t === 'DIALOGUE'
  return true
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { crashed: false, message: '' }
  }
  static getDerivedStateFromError(error) {
    return { crashed: true, message: String(error?.message || error || 'Unknown error') }
  }
  componentDidCatch(error) {
    console.error('App crashed but recovered with fallback screen.', error)
  }
  reloadApp = () => window.location.reload()
  resetAudioCache = async () => {
    try {
      if (typeof indexedDB !== 'undefined') indexedDB.deleteDatabase(AUDIO_DB_NAME)
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map(key => caches.delete(key)))
      }
    } catch {}
    window.location.reload()
  }
  render() {
    if (!this.state.crashed) return this.props.children
    return <div className="screen fatalScreen">
      <section className="fatalPanel">
        <h1>App needs a refresh</h1>
        <p>Audio cache or browser memory caused a temporary crash. Your learning text is kept.</p>
        <small>{this.state.message}</small>
        <div className="fatalActions">
          <button className="primary" onClick={this.reloadApp}>Reload</button>
          <button className="secondary" onClick={this.resetAudioCache}>Clear Audio Cache</button>
        </div>
      </section>
    </div>
  }
}

function App() {
  const [tab, setTab] = useState('learn')
  const [cards, setCards] = useState(() => load(CARD_KEY, []).map(normalizeCard))
  const [settings, setSettings] = useState(() => ({ ...defaultSettings, ...load(SETTINGS_KEY, {}) }))
  const [queue, setQueue] = useState(() => load(QUEUE_KEY, []))
  const [importText, setImportText] = useState(sampleText)
  const [importMeta, setImportMeta] = useState({ source: 'English File Unit 3', category: 'Daily Life', type: 'AUTO', tagsText: 'daily-life' })
  const [importMsg, setImportMsg] = useState('')
  const [query, setQuery] = useState('')
  const [libraryCategory, setLibraryCategory] = useState('ALL')
  const [learnType, setLearnType] = useState('CHUNKS')
  const [learnMode, setLearnMode] = useState('NEW')
  const [learnSource, setLearnSource] = useState('ALL')
  const [learnScope, setLearnScope] = useState('CURRENT')
  const [selected, setSelected] = useState(null)
  const [sourceView, setSourceView] = useState(null)
  const [editing, setEditing] = useState(null)
  const [audioBusy, setAudioBusy] = useState(false)
  const [audioMsg, setAudioMsg] = useState('')
  const [playingId, setPlayingId] = useState(null)
  const [lastAudioClip, setLastAudioClip] = useState(null)
  const [showChinese, setShowChinese] = useState(true)
  const [recallShown, setRecallShown] = useState(false)
  const [isListPlaying, setIsListPlaying] = useState(false)
  const [rolePlayRole, setRolePlayRole] = useState('')
  const [isRolePlaying, setIsRolePlaying] = useState(false)
  const [sectionPlaying, setSectionPlaying] = useState('')
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('')
  const currentAudioRef = useRef(null)
  const audioContextRef = useRef(null)
  const currentBufferSourceRef = useRef(null)
  const runRef = useRef(0)

  useEffect(() => { save(CARD_KEY, cards) }, [cards])
  useEffect(() => { save(SETTINGS_KEY, settings) }, [settings])
  useEffect(() => { save(QUEUE_KEY, queue) }, [queue])
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').then(reg => {
      reg.update?.()
    }).catch(() => {})
  }, [])
  useEffect(() => {
    setRecallShown(false)
  }, [selected?.id, settings.studyMode])
  useEffect(() => {
    let cancelled = false
    async function migrateAudio() {
      const next = []
      let changed = false
      for (const card of cards) {
        const result = await migrateCardAudioToIndexedDb(card)
        if (cancelled) return
        next.push(result.card)
        if (result.changed) {
          changed = true
          await sleep(30)
        }
      }
      if (changed && !cancelled) {
        setCards(next)
        setAudioMsg('Audio storage optimized for iPhone ✅')
      }
    }
    migrateAudio().catch(err => console.warn('Audio migration skipped.', err))
    return () => { cancelled = true }
  }, [])

  const due = useMemo(() => dueCards(cards), [cards])
  const parsedImportCards = useMemo(() => parseImportText(importText, {
    source: importMeta.source,
    category: importMeta.category,
    type: importMeta.type,
    tags: parseTags(importMeta.tagsText)
  }), [importText, importMeta])
  const importPreview = useMemo(() => {
    const existing = new Set(cards.map(importKey))
    const seen = new Set()
    let fresh = 0
    let updated = 0
    let repeated = 0
    let chunks = 0
    let sentences = 0
    let patterns = 0
    let dialogues = 0
    const sources = new Set()
    const categories = new Set()
    for (const card of parsedImportCards) {
      const key = importKey(card)
      if (seen.has(key)) {
        repeated += 1
        continue
      }
      seen.add(key)
      if (existing.has(key)) updated += 1
      else fresh += 1
      if (cardType(card) === 'SENTENCE') sentences += 1
      else if (cardType(card) === 'PATTERN') patterns += 1
      else if (cardType(card) === 'DIALOGUE') dialogues += 1
      else chunks += 1
      if (card.source) sources.add(card.source)
      if (card.category) categories.add(card.category)
    }
    return {
      total: parsedImportCards.length,
      fresh,
      updated,
      repeated,
      chunks,
      sentences,
      patterns,
      dialogues,
      sources: [...sources],
      categories: [...categories],
      samples: parsedImportCards.slice(0, 3)
    }
  }, [cards, parsedImportCards])
  const displayMode = settings.subtitleMode || 'BOTH'
  const sources = useMemo(() => groupSources(cards), [cards])
  const libraryCategories = useMemo(() => ['ALL', ...new Set(sources.flatMap(s => s.categories).filter(Boolean))], [sources])
  const queueCards = useMemo(() => queue.map(id => cards.find(c => c.id === id)).filter(Boolean), [queue, cards])
  const currentSourceName = useMemo(() => {
    if (learnSource && learnSource !== 'ALL' && sources.some(s => s.source === learnSource)) return learnSource
    return sources[0]?.source || ''
  }, [learnSource, sources])
  useEffect(() => {
    if (sources.length && (!learnSource || learnSource === 'ALL' || !sources.some(s => s.source === learnSource))) {
      setLearnSource(sources[0].source)
    }
  }, [sources, learnSource])
  const learnBaseCards = useMemo(() => {
    if (learnMode === 'REVIEW') return due
    if (learnScope === 'QUEUE') return queueCards
    return cards.filter(c => c.source === currentSourceName)
  }, [cards, currentSourceName, due, learnMode, learnScope, queueCards])
  const learnTypeCounts = useMemo(() => ({
    CHUNKS: learnBaseCards.filter(c => matchesLearnType(c, 'CHUNKS')).length,
    SENTENCES: learnBaseCards.filter(c => matchesLearnType(c, 'SENTENCES')).length,
    PATTERNS: learnBaseCards.filter(c => matchesLearnType(c, 'PATTERNS')).length,
    DIALOGUES: learnBaseCards.filter(c => matchesLearnType(c, 'DIALOGUES')).length
  }), [learnBaseCards])
  const visibleLearnCards = useMemo(() => {
    const q = query.trim().toLowerCase()
    return learnBaseCards.filter(c => {
      const typeOk = matchesLearnType(c, learnType)
      const qOk = !q || c.content.toLowerCase().includes(q) || (c.meaning || '').includes(query) || (c.source || '').toLowerCase().includes(q)
      return typeOk && qOk
    })
  }, [learnBaseCards, learnType, query])

  function saveAllSettings() {
    save(SETTINGS_KEY, settings)
    setSettingsSavedMsg('Settings saved ✅')
    setTimeout(() => setSettingsSavedMsg(''), 1800)
  }

  function stopAllAudio() {
    runRef.current += 1
    try {
      const source = currentBufferSourceRef.current
      if (source) {
        source.onended = null
        source.stop?.()
        source.disconnect?.()
      }
      currentBufferSourceRef.current = null
    } catch {}
    try {
      const audio = currentAudioRef.current
      if (audio) {
        audio.pause?.()
        audio.removeAttribute?.('src')
        audio.load?.()
      }
    } catch {}
    try { window.speechSynthesis?.cancel?.() } catch {}
    setPlayingId(null)
    setIsListPlaying(false)
    setIsRolePlaying(false)
    setSectionPlaying('')
  }

  function getAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    if (!audioContextRef.current) audioContextRef.current = new AudioCtx()
    return audioContextRef.current
  }

  function getAudioElement() {
    let audio = currentAudioRef.current
    if (!audio || typeof audio.play !== 'function') {
      audio = new Audio()
      audio.preload = 'auto'
      audio.playsInline = true
      audio.setAttribute('playsinline', 'true')
      currentAudioRef.current = audio
    }
    return audio
  }

  async function unlockAudioForUserGesture() {
    const audio = getAudioElement()
    try {
      audio.pause?.()
      audio.muted = true
      audio.src = SILENT_AUDIO_UNLOCK
      await audio.play()
      audio.pause()
      audio.removeAttribute('src')
      audio.load?.()
    } catch (err) {
      console.warn('Audio unlock skipped.', err)
    } finally {
      audio.muted = false
    }
  }

  async function prepareContinuousPlayback() {
    try {
      const ctx = getAudioContext()
      if (ctx && ctx.state === 'suspended') await ctx.resume()
    } catch (err) {
      console.warn('Audio context resume skipped.', err)
    }
    getAudioElement()
  }

  async function openAiVoiceBlob(text, voiceOverride) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), VOICE_TIMEOUT_MS)
    const res = await fetch('/api/openai-voice', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ apiKey: settings.apiKey || '', voice: voiceOverride || settings.voice, text })
    }).finally(() => clearTimeout(timer))
    if (!res.ok) {
      let msg = 'OpenAI voice failed.'
      try { msg = (await res.json()).error || msg } catch { msg = await res.text() }
      throw new Error(msg)
    }
    return await res.blob()
  }

  async function testOpenAI() {
    try {
      setAudioBusy(true); setAudioMsg('Testing OpenAI Voice...')
      const audioBlob = await openAiVoiceBlob('Hello. This is a test.', settings.exampleVoice || settings.voice)
      const audio = playableAudioUrl(audioBlob)
      await playClipNow(audio, 'Hello. This is a test.', 'test')
      setSettings(s => ({ ...s, openaiStatus: 'Connected ✅', lastError: '' }))
      setAudioMsg('OpenAI Voice works ✅')
    } catch (err) {
      setSettings(s => ({ ...s, openaiStatus: 'Failed ❌', lastError: String(err.message || err) }))
      setAudioMsg('OpenAI Voice failed ❌')
      alert(String(err.message || err))
    } finally { setAudioBusy(false) }
  }

  async function ensureAudioOnly(card, kind, index = null) {
    const stateCard = cards.find(c => c.id === card.id)
    const fresh = normalizeCard(Number(card?.updatedAt || 0) > Number(stateCard?.updatedAt || 0) ? card : (stateCard || card))
    if (kind === 'content') {
      if (fresh.contentAudio) {
        const cachedAudio = await resolveAudioClip(fresh.contentAudio)
        if (cachedAudio) return { audio: cachedAudio, text: fresh.content, generated: false, card: fresh }
      }
      try {
        setAudioBusy(true)
        setAudioMsg(`Generating online audio... ${fresh.content}`)
        const audioBlob = await openAiVoiceBlob(fresh.content, settings.contentVoice || settings.voice)
        const audio = playableAudioUrl(audioBlob)
        const contentAudio = await storeAudioClip(fresh.id, 'content', 'main', audioBlob)
        const updated = { ...fresh, contentAudio, updatedAt: Date.now() }
        setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
        setAudioMsg('Audio ready. Playing... ✅')
        return { audio, text: updated.content, generated: true, card: updated }
      } finally {
        setAudioBusy(false)
      }
    }
    if (kind === 'dialogue') {
      const line = makeDialogue(fresh)[index]
      if (!line) return { audio: '', text: '', generated: false, card: fresh }
      const spokenText = dialogueAudioText(line.text)
      const dialogueAudios = Array.isArray(fresh.dialogueAudios) ? [...fresh.dialogueAudios] : []
      if (dialogueAudios[index]) {
        const cachedAudio = await resolveAudioClip(dialogueAudios[index])
        if (cachedAudio) return { audio: cachedAudio, text: spokenText, generated: false, card: fresh }
      }
      try {
        setAudioBusy(true)
        setAudioMsg(`Generating mini dialogue audio... ${spokenText}`)
        const audioBlob = await openAiVoiceBlob(spokenText, settings.exampleVoice || settings.voice)
        const audio = playableAudioUrl(audioBlob)
        dialogueAudios[index] = await storeAudioClip(fresh.id, 'dialogue', index, audioBlob)
        const updated = { ...fresh, dialogueAudios, updatedAt: Date.now() }
        setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
        setAudioMsg('Mini dialogue audio ready. Playing... ✅')
        return { audio, text: spokenText, generated: true, card: updated }
      } finally {
        setAudioBusy(false)
      }
    }
    const ex = fresh.examples?.[index]
    if (!ex) return { audio: '', text: '', generated: false, card: fresh }
    if (ex.audio) {
      const cachedAudio = await resolveAudioClip(ex.audio)
      if (cachedAudio) return { audio: cachedAudio, text: ex.text, generated: false, card: fresh }
    }
    try {
      setAudioBusy(true)
      setAudioMsg(`Generating example audio... ${ex.text}`)
      const audioBlob = await openAiVoiceBlob(ex.text, settings.exampleVoice || settings.voice)
      const audio = playableAudioUrl(audioBlob)
      const storedAudio = await storeAudioClip(fresh.id, 'example', index, audioBlob)
      const examples = fresh.examples.map((item, i) => i === index ? { ...item, audio: storedAudio } : item)
      const updated = { ...fresh, examples, updatedAt: Date.now() }
      setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
      setAudioMsg('Example audio ready. Playing... ✅')
      return { audio, text: ex.text, generated: true, card: updated }
    } finally {
      setAudioBusy(false)
    }
  }

  function playAudioUrl(audio, text, runId) {
    if (audio) {
      return new Promise((resolve, reject) => {
        const a = getAudioElement()
        let done = false
        const cleanup = () => {
          clearTimeout(timer)
          a.onended = null
          a.onerror = null
        }
        const resolveOnce = () => {
          if (done) return
          done = true
          cleanup()
          resolve()
        }
        const rejectOnce = (err) => {
          if (done) return
          done = true
          cleanup()
          reject(err instanceof Error ? err : new Error(String(err || 'Audio playback failed.')))
        }
        const timer = setTimeout(() => {
          try { a.pause(); a.removeAttribute('src'); a.load() } catch {}
          rejectOnce(new Error('Audio took too long. Please try again.'))
        }, VOICE_TIMEOUT_MS)
        currentAudioRef.current = a
        try {
          a.pause()
          a.removeAttribute('src')
          a.load?.()
        } catch {}
        a.src = audio
        a.onended = resolveOnce
        a.onerror = () => rejectOnce(new Error('Audio playback failed.'))
        a.play().catch(rejectOnce)
      })
    }
    throw new Error('Audio is not ready yet.')
  }

  async function playAudioBufferUrl(audio, text, runId) {
    if (!audio) throw new Error('Audio is not ready yet.')
    const ctx = getAudioContext()
    if (!ctx) return playAudioUrl(audio, text, runId)
    try {
      if (ctx.state === 'suspended') await ctx.resume()
      const res = await fetch(audio)
      if (!res.ok) throw new Error('Audio file could not load.')
      const raw = await res.arrayBuffer()
      if (runRef.current !== runId) return
      const buffer = await ctx.decodeAudioData(raw.slice(0))
      if (runRef.current !== runId) return
      await new Promise((resolve, reject) => {
        const source = ctx.createBufferSource()
        let done = false
        const cleanup = () => {
          clearTimeout(timer)
          source.onended = null
          if (currentBufferSourceRef.current === source) currentBufferSourceRef.current = null
          try { source.disconnect() } catch {}
        }
        const resolveOnce = () => {
          if (done) return
          done = true
          cleanup()
          resolve()
        }
        const rejectOnce = (err) => {
          if (done) return
          done = true
          cleanup()
          reject(err instanceof Error ? err : new Error(String(err || 'Audio playback failed.')))
        }
        const timer = setTimeout(() => {
          try { source.stop() } catch {}
          rejectOnce(new Error('Audio took too long. Please try again.'))
        }, VOICE_TIMEOUT_MS)
        source.buffer = buffer
        source.connect(ctx.destination)
        source.onended = resolveOnce
        currentBufferSourceRef.current = source
        try { source.start(0) } catch (err) { rejectOnce(err) }
      })
    } catch (err) {
      if (runRef.current !== runId) return
      console.warn('Buffer playback fallback.', err)
      await playAudioUrl(audio, text, runId)
    }
  }

  async function playClipNow(audio, text, id) {
    stopAllAudio()
    const runId = ++runRef.current
    setPlayingId(id)
    if (!String(audio || '').startsWith('blob:')) setLastAudioClip({ audio, text, id })
    const repeat = Math.max(1, Number(settings.audioRepeat || 1))
    try {
      for (let i = 0; i < repeat; i++) {
        if (runRef.current !== runId) return
        await playAudioUrl(audio, text, runId)
        if (i < repeat - 1) await sleep(350)
      }
    } catch (err) {
      setAudioMsg(String(err.message || err))
    } finally {
      releasePlayableAudio(audio)
      if (runRef.current === runId) setPlayingId(null)
    }
  }

  async function handlePlayContent(card, e) {
    e?.stopPropagation?.()
    try {
      stopAllAudio()
      const clip = await ensureAudioOnly(card, 'content')
      await playClipNow(clip.audio, clip.text, `${card.id}:content`)
    } catch (err) {
      setAudioBusy(false); setAudioMsg(`Audio failed: ${String(err.message || err)}`)
    }
  }
  async function handlePlayExample(card, idx, e) {
    e?.stopPropagation?.()
    try {
      stopAllAudio()
      const clip = await ensureAudioOnly(card, 'example', idx)
      await playClipNow(clip.audio, clip.text, `${card.id}:ex:${idx}`)
    } catch (err) {
      setAudioBusy(false); setAudioMsg(`Audio failed: ${String(err.message || err)}`)
    }
  }
  async function handlePlayDialogue(card, idx, e) {
    e?.stopPropagation?.()
    try {
      stopAllAudio()
      const clip = await ensureAudioOnly(card, 'dialogue', idx)
      await playClipNow(clip.audio, clip.text, `${card.id}:dialogue:${idx}`)
    } catch (err) {
      setAudioBusy(false); setAudioMsg(`Audio failed: ${String(err.message || err)}`)
    }
  }

  async function playCardSection(card, section) {
    const fresh = normalizeCard(cards.find(c => c.id === card.id) || card)
    const isExamples = section === 'examples'
    const rows = isExamples
      ? (fresh.examples || []).map((ex, idx) => ({ kind: 'example', index: idx, id: `${fresh.id}:ex:${idx}`, text: ex.text }))
      : makeDialogue(fresh).map((line, idx) => ({ kind: 'dialogue', index: idx, id: `${fresh.id}:dialogue:${idx}`, text: dialogueAudioText(line.text) }))
    const playableRows = rows.filter(row => String(row.text || '').trim())
    if (!playableRows.length) {
      setAudioMsg(isExamples ? 'No examples to play.' : 'No mini dialogue to play.')
      return
    }
    stopAllAudio()
    const runId = ++runRef.current
    let activeCard = fresh
    const label = isExamples ? 'Examples' : 'Mini dialogue'
    const pauseMs = Math.max(1200, Number(settings.pauseSeconds || 1.5) * 1000)
    setSectionPlaying(section)
    setAudioMsg(`Playing ${label.toLowerCase()}...`)
    try {
      await prepareContinuousPlayback()
      for (let i = 0; i < playableRows.length; i++) {
        if (runRef.current !== runId) return
        const row = playableRows[i]
        const clip = await ensureAudioOnly(activeCard, row.kind, row.index)
        activeCard = clip.card || activeCard
        if (runRef.current !== runId) return
        setPlayingId(row.id)
        await playAudioBufferUrl(clip.audio, clip.text, runId)
        releasePlayableAudio(clip.audio)
        if (runRef.current !== runId) return
        if (i < playableRows.length - 1) {
          setAudioMsg(`${label} ${i + 1}/${playableRows.length}. Pause...`)
          await sleep(pauseMs)
        }
      }
      if (runRef.current === runId) setAudioMsg(`${label} finished ✅`)
    } catch (err) {
      if (runRef.current === runId) setAudioMsg(`${label} stopped: ${String(err.message || err)}`)
    } finally {
      if (runRef.current === runId) {
        setPlayingId(null)
        setSectionPlaying('')
        setAudioBusy(false)
      }
    }
  }

  async function playRolePlay(card) {
    const lines = makeDialogue(card)
    const roles = dialogueRoles(card)
    const selectedRole = rolePlayRole || roles[1] || roles[0] || ''
    if (!lines.length || !selectedRole) return
    stopAllAudio()
    const runId = ++runRef.current
    const pauseMs = Math.max(2000, Number(settings.rolePlayPauseSeconds || 4) * 1000)
    setIsRolePlaying(true)
    setAudioMsg(`Role-play: you are ${selectedRole}.`)
    try {
      await prepareContinuousPlayback()
      for (let i = 0; i < lines.length; i++) {
        if (runRef.current !== runId) return
        const speaker = dialogueSpeaker(lines[i].text)
        const text = dialogueAudioText(lines[i].text)
        if (!text) continue
        if (speaker && speaker.toLowerCase() === selectedRole.toLowerCase()) {
          setPlayingId(`${card.id}:role:${i}`)
          setAudioMsg(`Your turn (${settings.rolePlayPauseSeconds || 4}s): ${text}`)
          await sleep(pauseMs)
          continue
        }
        const clip = await ensureAudioOnly(card, 'dialogue', i)
        if (runRef.current !== runId) return
        setPlayingId(`${card.id}:dialogue:${i}`)
        await playAudioBufferUrl(clip.audio, clip.text, runId)
        releasePlayableAudio(clip.audio)
        await sleep(350)
      }
      if (runRef.current === runId) setAudioMsg('Role-play finished ✅')
    } catch (err) {
      if (runRef.current === runId) setAudioMsg(`Role-play stopped: ${String(err.message || err)}`)
    } finally {
      if (runRef.current === runId) {
        setPlayingId(null)
        setIsRolePlaying(false)
        setAudioBusy(false)
      }
    }
  }

  function replayLast() {
    if (!lastAudioClip) return
    playClipNow(lastAudioClip.audio, lastAudioClip.text, lastAudioClip.id)
  }

  async function playList(list) {
    if (!list.length) {
      setAudioMsg('No items to play.')
      return
    }
    stopAllAudio()
    const runId = ++runRef.current
    setIsListPlaying(true)
    try {
      await prepareContinuousPlayback()
      if (runRef.current !== runId) return
      for (let i = 0; i < list.length; i++) {
        if (runRef.current !== runId) return
        const card = list[i]
        const fresh = normalizeCard(cards.find(c => c.id === card.id) || card)
        setAudioMsg(`Playlist ${i + 1}/${list.length}: ${fresh.content}`)
        let clip
        try {
          clip = await ensureAudioOnly(fresh, 'content')
        } catch (err) {
          setAudioMsg(`Skipped one audio: ${String(err.message || err)}`)
          await sleep(700)
          continue
        }
        if (runRef.current !== runId) return
        setPlayingId(`${fresh.id}:content`)
        try {
          await playAudioBufferUrl(clip.audio, clip.text, runId)
        } catch (err) {
          const message = String(err.message || err)
          if (/not allowed|permission|user agent|interrupted/i.test(message)) {
            setAudioMsg('Playlist stopped: phone browser blocked continuous playback. Tap Play List again, or prepare audio first.')
            break
          }
          setAudioMsg(`Skipped one playback: ${message}`)
          await sleep(700)
          continue
        } finally {
          releasePlayableAudio(clip.audio)
        }
        if (runRef.current !== runId) return
        await sleep(Math.max(400, Number(settings.pauseSeconds || 1.5) * 1000))
      }
      if (runRef.current === runId) setAudioMsg('Playlist finished ✅')
    } catch (err) {
      if (runRef.current === runId) setAudioMsg(`Playlist stopped: ${String(err.message || err)}`)
    } finally {
      if (runRef.current === runId) {
        setPlayingId(null)
        setIsListPlaying(false)
        setAudioBusy(false)
      }
    }
  }

  function canPrepareMore(budget) {
    return !budget || Number(budget.remaining || 0) > 0
  }

  function markPreparedClip(budget) {
    if (!budget) return
    budget.remaining = Math.max(0, Number(budget.remaining || 0) - 1)
    budget.done = Number(budget.done || 0) + 1
  }

  async function prepareCard(card, budget = null) {
    let updated = normalizeCard(card)
    if (!canPrepareMore(budget)) return updated
    if (!updated.contentAudio || !(await audioExists(updated.contentAudio))) {
      if (!canPrepareMore(budget)) return updated
      const audioBlob = await openAiVoiceBlob(updated.content, settings.contentVoice || settings.voice)
      updated.contentAudio = await storeAudioClip(updated.id, 'content', 'main', audioBlob)
      markPreparedClip(budget)
      await sleep(180)
    } else if (isInlineAudio(updated.contentAudio)) {
      updated.contentAudio = await storeAudioClip(updated.id, 'content', 'main', updated.contentAudio)
    }
    if (['SENTENCE', 'DIALOGUE'].includes(cardType(updated))) {
      const dialogueAudios = Array.isArray(updated.dialogueAudios) ? [...updated.dialogueAudios] : []
      const lines = makeDialogue(updated)
      for (let i = 0; i < lines.length; i++) {
        if (!canPrepareMore(budget)) break
        if (!dialogueAudios[i] || !(await audioExists(dialogueAudios[i]))) {
          const audioBlob = await openAiVoiceBlob(dialogueAudioText(lines[i].text), settings.exampleVoice || settings.voice)
          dialogueAudios[i] = await storeAudioClip(updated.id, 'dialogue', i, audioBlob)
          markPreparedClip(budget)
          await sleep(180)
        } else if (isInlineAudio(dialogueAudios[i])) {
          dialogueAudios[i] = await storeAudioClip(updated.id, 'dialogue', i, dialogueAudios[i])
        }
      }
      updated.dialogueAudios = dialogueAudios
    } else {
      const examples = []
      for (let i = 0; i < (updated.examples || []).length; i++) {
        const ex = updated.examples[i]
        if (!canPrepareMore(budget)) {
          examples.push(ex)
          continue
        }
        if (!ex.audio || !(await audioExists(ex.audio))) {
          const audioBlob = await openAiVoiceBlob(ex.text, settings.exampleVoice || settings.voice)
          examples.push({ ...ex, audio: await storeAudioClip(updated.id, 'example', i, audioBlob) })
          markPreparedClip(budget)
          await sleep(180)
        } else if (isInlineAudio(ex.audio)) {
          examples.push({ ...ex, audio: await storeAudioClip(updated.id, 'example', i, ex.audio) })
        } else {
          examples.push(ex)
        }
      }
      updated.examples = examples
    }
    updated.updatedAt = Date.now()
    return updated
  }
  async function prepareCards(list) {
    try {
      setAudioBusy(true)
      setAudioMsg('Checking audio cache...')
      const missing = []
      for (const card of list) {
        if (!(await hasPlayableAudio(card))) missing.push(card)
        if (missing.length >= PREPARE_BATCH_SIZE) break
        await sleep(20)
      }
      if (!missing.length) { setAudioMsg('All audio ready ✅'); return }
      const batch = missing.slice(0, PREPARE_BATCH_SIZE)
      const budget = { remaining: PREPARE_CLIPS_PER_RUN, done: 0 }
      let latest = [...cards]
      let failed = 0
      for (let i = 0; i < batch.length; i++) {
        setAudioMsg(`Preparing audio ${i + 1}/${batch.length} (${missing.length} waiting): ${batch[i].content}`)
        let prepared = null
        try {
          prepared = await prepareCard(batch[i], budget)
        } catch (err) {
          failed += 1
          console.warn('Prepare audio failed for one card', err)
          continue
        }
        latest = latest.map(c => c.id === prepared.id ? prepared : c)
        setCards(latest)
        await sleep(250)
      }
      const preparedCount = batch.length - failed
      setAudioMsg(budget.remaining <= 0 || list.length > batch.length
        ? `Prepared ${budget.done || preparedCount} audio clip(s). Tap Prepare Source Audio again to continue. ✅`
        : failed ? `Audio prepared with ${failed} failed item(s). ✅` : 'Audio Ready ✅')
    } catch (err) {
      setSettings(s => ({ ...s, lastError: String(err.message || err), openaiStatus: 'Failed ❌' }))
      setAudioMsg(`Audio failed: ${String(err.message || err)}`)
    } finally { setAudioBusy(false) }
  }

  function addToLearn(list) {
    const ids = list.map(x => x.id)
    setQueue(prev => [...new Set([...ids, ...prev])])
    setLearnScope('QUEUE')
    setLearnMode('NEW')
    setTab('learn')
    setSourceView(null)
    setSelected(null)
    setAudioMsg('Added to Queue. Open Queue in Learn. ✅')
  }

  function importCards(parsed) {
    if (!parsed.length) { alert('没有识别到可导入内容。'); return }
    const existingByKey = new Map(cards.map(c => [importKey(c), c]))
    const seenIncoming = new Set()
    const fresh = []
    const updated = []
    let skipped = 0

    const nextCards = [...cards]
    for (const incoming of parsed) {
      const key = importKey(incoming)
      if (seenIncoming.has(key)) {
        skipped += 1
        continue
      }
      seenIncoming.add(key)
      const old = existingByKey.get(key)
      if (old) {
        const keepOldDialogue = old.dialogue && old.dialogue.length && !isAutoGeneratedDialogue(old)
        const incomingHasDialogue = incoming.dialogue && incoming.dialogue.length
        const dialogueUnchanged = incomingHasDialogue && sameDialogueLines(old.dialogue || [], incoming.dialogue || [])
        const merged = normalizeCard({
          ...old,
          type: incoming.type || old.type,
          content: incoming.content || old.content,
          meaning: incoming.meaning || old.meaning,
          pattern: incoming.pattern || old.pattern,
          dialogue: incomingHasDialogue ? incoming.dialogue : (keepOldDialogue ? old.dialogue : []),
          dialogueAudios: incomingHasDialogue ? (dialogueUnchanged ? old.dialogueAudios : []) : (keepOldDialogue ? old.dialogueAudios : []),
          examples: (incoming.examples && incoming.examples.length) ? incoming.examples : old.examples,
          source: incoming.source || old.source,
          category: incoming.category || old.category,
          tags: (incoming.tags && incoming.tags.length) ? incoming.tags : old.tags,
          updatedAt: Date.now()
        })
        const idx = nextCards.findIndex(c => c.id === old.id)
        if (idx >= 0) nextCards[idx] = { ...merged, id: old.id, contentAudio: old.contentAudio || merged.contentAudio }
        updated.push(nextCards[idx >= 0 ? idx : 0])
      } else {
        fresh.push(incoming)
        nextCards.unshift(incoming)
        existingByKey.set(key, incoming)
      }
    }

    setCards(nextCards)
    const queueIds = [...fresh.map(c => c.id), ...updated.map(c => c.id).filter(Boolean)]
    setQueue(prev => [...new Set([...queueIds, ...prev])])
    const first = fresh[0] || updated[0] || parsed[0]
    if (first?.source) setLearnSource(first.source)
    setLearnScope('CURRENT')
    setImportMsg(`Import ready: ${fresh.length} new, ${updated.length} updated${skipped ? `, ${skipped} repeated skipped` : ''}. Added to Learn.`)
    setAudioMsg(`Import ready: ${fresh.length} new, ${updated.length} updated${skipped ? `, ${skipped} repeated skipped` : ''}. ✅`)
    setLearnMode('NEW')
    setTab('learn')
  }
  async function importFile(file) {
    if (!file) return
    const text = await file.text()
    updateImportText(text)
    const meta = detectImportMeta(text, { source: importMeta.source, category: importMeta.category, type: importMeta.type, tagsText: importMeta.tagsText })
    setImportMeta(prev => ({ ...prev, source: meta.source || prev.source, category: meta.category || prev.category, type: meta.type || prev.type, tagsText: meta.tagsText || prev.tagsText }))
    setImportMsg(`File loaded. Preview found ${parseImportText(text, { source: meta.source, category: meta.category, type: meta.type, tags: meta.tags }).length} items.`)
  }
  function saveEdit(draft) {
    const examples = draft.examplesText.split('\n').map((text, i) => {
      const old = draft.examples[i]
      return { id: old?.id || uid(), text: text.trim(), audio: old?.audio || '' }
    }).filter(x => x.text)
    const oldDialogue = Array.isArray(draft.dialogue) ? draft.dialogue : []
    const dialogue = String(draft.dialogueText || '').split('\n').map((text, i) => ({
      id: oldDialogue[i]?.id || uid(),
      text: cleanLineText(text)
    })).filter(x => x.text)
    const dialogueAudios = sameDialogueLines(oldDialogue, dialogue) ? draft.dialogueAudios : []
    const updated = normalizeCard({
      ...draft,
      examples,
      dialogue,
      dialogueAudios,
      tags: draft.tagsText.split(',').map(x => x.trim()).filter(Boolean),
      updatedAt: Date.now()
    })
    setCards(cards.map(c => c.id === updated.id ? updated : c))
    setEditing(null)
  }

  const sourceCards = sourceView ? cards.filter(c => c.source === sourceView) : []
  const selectedFresh = selected ? normalizeCard(cards.find(c => c.id === selected.id) || selected) : null
  const selectedIndex = selectedFresh ? visibleLearnCards.findIndex(c => c.id === selectedFresh.id) : -1
  const selectedDialogueRoles = selectedFresh ? dialogueRoles(selectedFresh) : []
  const activeRolePlayRole = rolePlayRole && selectedDialogueRoles.includes(rolePlayRole)
    ? rolePlayRole
    : (selectedDialogueRoles[1] || selectedDialogueRoles[0] || '')
  useEffect(() => {
    if (selectedFresh) {
      setIsRolePlaying(false)
      const roles = dialogueRoles(selectedFresh)
      if (roles.length && !roles.includes(rolePlayRole)) setRolePlayRole(roles[1] || roles[0])
    }
  }, [selectedFresh?.id])
  const reviewCount = due.length
  function visiblePrimary(card, idx = null) {
    if (displayMode === 'CN') return card.meaning || card.content
    if (displayMode === 'HIDDEN') return 'Listen & Recall'
    return card.content
  }
  function visibleSecondary(card) {
    if (displayMode === 'BOTH') return card.meaning
    return ''
  }
  function setStudyMode(mode) {
    stopAllAudio()
    setRecallShown(false)
    setSettings(prev => ({ ...prev, studyMode: mode }))
  }
  function goToOffset(offset) {
    if (selectedIndex < 0) return
    const next = visibleLearnCards[selectedIndex + offset]
    if (!next) return
    stopAllAudio()
    setSelected(next)
  }
  function rateSelected(rating, moveNext = false) {
    if (!selectedFresh) return
    const updated = updateSchedule(selectedFresh, rating)
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
    const nextText = formatReviewDate(updated.nextReviewAt)
    setAudioMsg(rating === 'Again' ? `Again saved. Review ${nextText}.` : `Good saved. Review ${nextText}. ✅`)
    if (moveNext) {
      const next = visibleLearnCards[selectedIndex + 1]
      stopAllAudio()
      if (next) setSelected(next)
      else {
        setSelected(null)
        setAudioMsg('Done for now. Review schedule updated. ✅')
      }
    }
  }
  function updateImportText(text) {
    setImportText(text)
    const meta = detectImportMeta(text, { source: importMeta.source, category: importMeta.category, type: importMeta.type, tagsText: importMeta.tagsText })
    setImportMeta(prev => ({ ...prev, source: meta.source || prev.source, category: meta.category || prev.category, type: meta.type || prev.type, tagsText: meta.tagsText || prev.tagsText }))
    setImportMsg('')
  }
  async function copyFormatPrompt() {
    try {
      await navigator.clipboard.writeText(chatGptFormatPrompt)
      setImportMsg('格式要求已复制。可以直接粘贴给 ChatGPT。')
    } catch {
      setImportText(chatGptFormatPrompt)
      setImportMsg('浏览器不允许自动复制。我已放到输入框里，可以手动复制。')
    }
  }
  function renameSource(oldName) {
    const name = prompt('New source name:', oldName)
    if (!name || name.trim() === oldName) return
    const nextName = name.trim()
    setCards(prev => prev.map(c => c.source === oldName ? { ...c, source: nextName, updatedAt: Date.now() } : c))
    if (learnSource === oldName) setLearnSource(nextName)
    setSourceView(nextName)
  }
  function deleteSource(name) {
    if (!confirm(`Delete source "${name}" and all its items?`)) return
    const ids = new Set(cards.filter(c => c.source === name).map(c => c.id))
    setCards(prev => prev.filter(c => c.source !== name))
    setQueue(prev => prev.filter(id => !ids.has(id)))
    if (learnSource === name) setLearnSource('ALL')
    setSourceView(null)
    setAudioMsg('Source deleted.')
  }

  return <div className={`app font-${settings.fontSize}`}>
    <main className="screen">
      {tab === 'learn' && !selectedFresh && <section className="page">
        <div className="eyebrow">Audio Feed</div>
        <h1>Learn</h1>
        <div className="modeSwitch">
          <button className={learnMode === 'REVIEW' ? 'active' : ''} onClick={() => { stopAllAudio(); setLearnMode('REVIEW') }}>Today Review <span>{reviewCount}</span></button>
          <button className={learnMode === 'NEW' ? 'active' : ''} onClick={() => { stopAllAudio(); setLearnMode('NEW') }}>New Learning</button>
        </div>
        <div className="learnControlPanel simpleLearnHeader">
          {learnMode === 'NEW' && learnScope === 'CURRENT'
            ? <label className="currentSourceButton sourcePicker">
                <span>Current Source</span>
                <select
                  className="sourceSelect"
                  value={currentSourceName}
                  disabled={!sources.length}
                  onChange={e => {
                    stopAllAudio()
                    setLearnMode('NEW')
                    setLearnScope('CURRENT')
                    setLearnSource(e.target.value)
                    setQuery('')
                  }}
                >
                  {sources.length
                    ? sources.map(source => <option key={source.source} value={source.source}>{source.source}</option>)
                    : <option value="">Choose from Library</option>}
                </select>
              </label>
            : <div className="currentSourceButton sourceReadout">
                <span>{learnMode === 'REVIEW' ? 'Today Review' : learnScope === 'QUEUE' ? 'Learning Queue' : 'Current Source'}</span>
                <strong>{learnMode === 'REVIEW' ? `${reviewCount} due items` : learnScope === 'QUEUE' ? `${queueCards.length} items` : (currentSourceName || 'Choose from Library')}</strong>
              </div>}
          <select value={displayMode} onChange={e => setSettings({ ...settings, subtitleMode: e.target.value })}>
            <option value="BOTH">EN+CN</option>
            <option value="EN">EN</option>
            <option value="CN">CN</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>
        {displayMode === 'HIDDEN' && <p className="modeHint">Hidden Mode · listen first, then recall.</p>}
        <div className="learnTypeGrid">
          <button className={learnType === 'CHUNKS' ? 'active' : ''} onClick={() => setLearnType('CHUNKS')}><strong>Chunks</strong><span>{learnTypeCounts.CHUNKS}</span></button>
          <button className={learnType === 'SENTENCES' ? 'active' : ''} onClick={() => setLearnType('SENTENCES')}><strong>Sentences</strong><span>{learnTypeCounts.SENTENCES}</span></button>
          <button className={learnType === 'PATTERNS' ? 'active' : ''} onClick={() => setLearnType('PATTERNS')}><strong>Patterns</strong><span>{learnTypeCounts.PATTERNS}</span></button>
          <button className={learnType === 'DIALOGUES' ? 'active' : ''} onClick={() => setLearnType('DIALOGUES')}><strong>Mini Dialogues</strong><span>{learnTypeCounts.DIALOGUES}</span></button>
        </div>
        <input className="search" placeholder={learnMode === 'REVIEW' ? 'Search review...' : 'Search Learn...'} value={query} onChange={e => setQuery(e.target.value)} />
        <div className="feedActions slimActions">
          <button className="secondary compactButton" onClick={() => playList(visibleLearnCards)}>{isListPlaying ? 'Playing...' : 'Play List'}</button>
          <button className="secondary compactButton" onClick={stopAllAudio}>Stop</button>
        </div>
        {audioMsg && <p className="audioMsg">{audioMsg}</p>}
        <div className="feedList">
          {visibleLearnCards.length === 0 && <div className="emptyState">{learnMode === 'REVIEW' ? 'No review due today. Continue New Learning.' : learnScope === 'QUEUE' ? 'Queue is empty. Add sources from Library.' : 'No items found. Choose a source from Library.'}</div>}
          {visibleLearnCards.map((card, idx) => <div key={card.id} className={`feedRow ${playingId === `${card.id}:content` ? 'playing' : ''}`}>
            <div className="playHitArea" onClick={(e) => handlePlayContent(card, e)}><button className="cleanPlay" aria-label="Play"><span /></button></div>
            <div className="feedText" onClick={() => setSelected(card)}><strong>{visiblePrimary(card, idx)}</strong>{visibleSecondary(card) && <p>{visibleSecondary(card)}</p>}{learnMode === 'REVIEW' && <small className="reviewMini">{card.status || 'Learning'} · due {formatReviewDate(card.nextReviewAt)}</small>}</div>
          </div>)}
        </div>
      </section>}

      {tab === 'learn' && selectedFresh && <section className="page">
        <div className="topbar"><button className="smallButton" onClick={() => { stopAllAudio(); setSelected(null) }}>Back</button><span>{selectedFresh.source}</span></div>
        <div className="deepCard">
          <div className="tag">{chunkLabel(selectedFresh.type)} · {selectedFresh.category}{selectedFresh.lastReviewAt && <> · Next review: {formatReviewDate(selectedFresh.nextReviewAt)}</>}</div>
          <div className="studyModeSwitch">
            <button className={(settings.studyMode || 'LISTEN') === 'LISTEN' ? 'active' : ''} onClick={() => setStudyMode('LISTEN')}>Listen</button>
            <button className={(settings.studyMode || 'LISTEN') === 'RECALL' ? 'active' : ''} onClick={() => setStudyMode('RECALL')}>Recall</button>
          </div>
          {(settings.studyMode || 'LISTEN') === 'RECALL' && <div className="recallPromptCard">
            <div className="recallLabel">Chinese Prompt</div>
            <div className="recallChinese">{selectedFresh.meaning || 'No Chinese meaning yet.'}</div>
            <div className="recallCue">Look at Chinese. Say the English by yourself first.</div>
            {!recallShown && <button className="primary recallReveal" onClick={() => setRecallShown(true)}>Show English</button>}
            {recallShown && <div className="recallActions">
              <button className="secondary compactButton" onClick={() => rateSelected('Again', false)}>Again</button>
              <button className="primary compactButton" onClick={() => rateSelected('Good', true)}>Good</button>
            </div>}
          </div>}
          {((settings.studyMode || 'LISTEN') === 'LISTEN' || recallShown) && <>
            <div className={`deepMain ${playingId === `${selectedFresh.id}:content` ? 'playing' : ''}`}>
              <button className="mainPlay" onClick={(e) => handlePlayContent(selectedFresh, e)}><span /></button>
              <div><h2>{visiblePrimary(selectedFresh)}</h2>{visibleSecondary(selectedFresh) && <p>{visibleSecondary(selectedFresh)}</p>}</div>
            </div>
            {selectedFresh.examples.length > 0 && <>
            <div className="sectionTitleRow">
              <div className="miniTitle">Examples</div>
              <button className={`sectionPlayButton ${sectionPlaying === 'examples' ? 'active' : ''}`} onClick={() => sectionPlaying === 'examples' ? stopAllAudio() : playCardSection(selectedFresh, 'examples')}>
                {sectionPlaying === 'examples' ? 'Stop' : 'Play All'}
              </button>
            </div>
            <div className="deepRows">{selectedFresh.examples.map((ex, idx) => <div key={ex.id} className={`deepRow ${playingId === `${selectedFresh.id}:ex:${idx}` ? 'playing' : ''}`}>
              <button className="tinyPlay" onClick={(e) => handlePlayExample(selectedFresh, idx, e)}><span /></button><p>{ex.text}</p>
            </div>)}</div>
            </>}
            {selectedFresh.pattern && <div className="patternBox"><strong>Pattern</strong><p>{selectedFresh.pattern}</p></div>}
            {['SENTENCE', 'DIALOGUE'].includes(cardType(selectedFresh)) && <>
            {makeDialogue(selectedFresh).length > 0 && <>
              <div className="sectionTitleRow">
                <div className="miniTitle">Mini Dialogue</div>
                <button className={`sectionPlayButton ${sectionPlaying === 'dialogue' ? 'active' : ''}`} onClick={() => sectionPlaying === 'dialogue' ? stopAllAudio() : playCardSection(selectedFresh, 'dialogue')}>
                  {sectionPlaying === 'dialogue' ? 'Stop' : 'Listen All'}
                </button>
              </div>
              {selectedDialogueRoles.length > 0 && <div className="rolePlayPanel">
                <div className="rolePlayHead">
                  <strong>Role-play</strong>
                  <select value={activeRolePlayRole} onChange={e => setRolePlayRole(e.target.value)}>
                    {selectedDialogueRoles.map(role => <option key={role} value={role}>I am {role}</option>)}
                  </select>
                </div>
                <div className="rolePlayActions">
                  <button className="secondary compactButton" onClick={() => isRolePlaying ? stopAllAudio() : playRolePlay(selectedFresh)}>{isRolePlaying ? 'Stop Role-play' : 'Start Role-play'}</button>
                  <select value={settings.rolePlayPauseSeconds || 4} onChange={e => setSettings({ ...settings, rolePlayPauseSeconds: Number(e.target.value) })}>
                    <option value={2}>2s pause</option>
                    <option value={4}>4s pause</option>
                    <option value={6}>6s pause</option>
                    <option value={10}>10s pause</option>
                  </select>
                </div>
              </div>}
              <div className="deepRows">{makeDialogue(selectedFresh).map((line, idx) => {
                const dialogueLine = parseDialogueLine(line.text)
                return <div key={line.id} className={`deepRow ${playingId === `${selectedFresh.id}:dialogue:${idx}` ? 'playing' : ''} ${playingId === `${selectedFresh.id}:role:${idx}` ? 'roleTurn' : ''}`}>
                  <button className="tinyPlay" onClick={(e) => handlePlayDialogue(selectedFresh, idx, e)}><span /></button>
                  <p>{dialogueLine.speaker && <span className="speakerPill">{dialogueLine.speaker}</span>}{dialogueLine.text}</p>
                </div>
              })}</div>
            </>}
            </>}
          </>}
          <div className="navActions">
            <button className="secondary compactButton" onClick={() => goToOffset(-1)} disabled={selectedIndex <= 0}>← Previous</button>
            <button className="secondary compactButton" onClick={() => goToOffset(1)} disabled={selectedIndex < 0 || selectedIndex >= visibleLearnCards.length - 1}>Next →</button>
          </div>
          <div className="feedActions"><button className="secondary compactButton" onClick={() => rateSelected('Again', false)}>Again</button><button className="secondary compactButton" onClick={() => rateSelected('Good', true)} disabled={(settings.studyMode || 'LISTEN') === 'RECALL' && !recallShown}>Good & Next</button></div>
        </div>
      </section>}

      {tab === 'import' && <section className="page">
        <h1>Import</h1>
        <button className="secondary compactButton copyFormatButton" onClick={copyFormatPrompt}>Copy ChatGPT Format</button>
        <div className="formatGuide">
          <h2>Format Guide</h2>
          <p>Use one of these four TYPE blocks. SOURCE, CATEGORY and TAGS can be repeated in each block, so the app can auto-detect them.</p>
          <div className="formatGuideGrid">
            <div><strong>CHUNK</strong><span>High-frequency phrase</span><code>CONTENT: in my free time</code></div>
            <div><strong>SENTENCE</strong><span>One useful sentence</span><code>CONTENT: Can I have a coffee?</code></div>
            <div><strong>PATTERN</strong><span>1 pattern + 4 examples</span><code>CONTENT: Can I have + noun?</code></div>
            <div><strong>DIALOGUE</strong><span>1 topic + 6-10 lines</span><code>CONTENT: Ordering coffee</code></div>
          </div>
          <details>
            <summary>Short Example</summary>
            <pre>{`TYPE:
PATTERN

CONTENT:
Can I have + noun + please?

MEANING:
我可以要……吗？

EXAMPLES:
Can I have a coffee, please?
Can I have a receipt, please?
Can I have some water, please?
Can I have one more minute, please?

SOURCE:
Australian Cafe English

CATEGORY:
Cafe

TAGS:
pattern, cafe`}</pre>
          </details>
        </div>
        <div className="metaGrid">
          <label>Source Title<input value={importMeta.source} onChange={e => setImportMeta({...importMeta, source:e.target.value})} /></label>
          <label>Category<input value={importMeta.category} onChange={e => setImportMeta({...importMeta, category:e.target.value})} /></label>
          <label>Type<select value={importMeta.type} onChange={e => setImportMeta({...importMeta, type:e.target.value})}><option>AUTO</option><option>WORD</option><option>CHUNK</option><option>SENTENCE</option><option>PATTERN</option><option>DIALOGUE</option></select></label>
          <label>Tags<input value={importMeta.tagsText} onChange={e => setImportMeta({...importMeta, tagsText:e.target.value})} /></label>
        </div>
        <textarea value={importText} onChange={e => updateImportText(e.target.value)} />
        <div className="importPreview">
          <div className="previewStats">
            <span><strong>{importPreview.total}</strong> detected</span>
            <span><strong>{importPreview.fresh}</strong> new</span>
            <span><strong>{importPreview.updated}</strong> update</span>
            <span><strong>{importPreview.repeated}</strong> repeat</span>
          </div>
          <p>{importPreview.chunks} chunks · {importPreview.sentences} sentences · {importPreview.patterns} patterns · {importPreview.dialogues} dialogues</p>
          {importPreview.sources.length > 0 && <small>Source: {importPreview.sources.slice(0, 2).join(' · ')}{importPreview.sources.length > 2 ? ' +' + (importPreview.sources.length - 2) : ''}</small>}
          {importPreview.samples.length > 0 && <div className="sampleImportList">{importPreview.samples.map(card => <div key={card.id}><b>{card.content}</b><em>{chunkLabel(card.type)} · {card.category}</em></div>)}</div>}
          {importPreview.total === 0 && <small>No item detected yet. Paste TYPE / CONTENT blocks or simple 3-line items.</small>}
        </div>
        {importMsg && <p className="audioMsg">{importMsg}</p>}
        <button className="primary" disabled={importPreview.total === 0} onClick={() => importCards(parsedImportCards)}>Import to Learn</button>
        <label className="fileButton">Import File<input type="file" accept=".txt,.md,.csv" onChange={e => importFile(e.target.files?.[0])} /></label>
      </section>}

      {tab === 'library' && !sourceView && <section className="page">
        <h1>Library</h1>
        <input className="search" placeholder="Search source..." value={query} onChange={e => setQuery(e.target.value)} />
        <div className="categoryChips">
          {libraryCategories.map(cat => <button key={cat} className={libraryCategory === cat ? 'active' : ''} onClick={() => setLibraryCategory(cat)}>{cat === 'ALL' ? 'All' : cat}</button>)}
        </div>
        <div className="sourceList">{sources.filter(s => {
          const q = query.trim().toLowerCase()
          const matchQuery = !q || s.source.toLowerCase().includes(q) || s.items.some(i => i.content.toLowerCase().includes(q) || (i.meaning || '').includes(query))
          const matchCategory = libraryCategory === 'ALL' || s.categories.includes(libraryCategory)
          return matchQuery && matchCategory
        }).map(s => <div className="sourceCard simpleSource" key={s.source}>
          <div onClick={() => setSourceView(s.source)}><h2>{s.source}</h2><p>{s.categories.join(' · ')}</p><div className="sourceStats"><span>{s.chunkCount} chunks</span><span>{s.sentenceCount} sentences</span>{s.patternCount > 0 && <span>{s.patternCount} patterns</span>}{s.dialogueCount > 0 && <span>{s.dialogueCount} dialogues</span>}<span>{s.ready}/{s.items.length} ready</span></div></div>
          <div className="sourceActions threeActions"><button onClick={() => { setLearnSource(s.source); setLearnScope('CURRENT'); setLearnMode('NEW'); setTab('learn') }}>Start Learning</button><button onClick={() => setSourceView(s.source)}>View Source</button><button onClick={() => addToLearn(s.items)}>Add to Queue</button></div>
        </div>)}</div>
      </section>}

      {tab === 'library' && sourceView && !editing && <section className="page">
        <div className="topbar"><button className="smallButton" onClick={() => setSourceView(null)}>Back</button><span>{sourceView}</span></div>
        <h1>{sourceView}</h1>
        <div className="sourceSummary"><span>{sourceCards.filter(x => matchesLearnType(x, 'CHUNKS')).length} chunks</span><span>{sourceCards.filter(x => cardType(x) === 'SENTENCE').length} sentences</span><span>{sourceCards.filter(x => cardType(x) === 'PATTERN').length} patterns</span><span>{sourceCards.filter(x => cardType(x) === 'DIALOGUE').length} dialogues</span><span>{sourceCards.filter(isReady).length}/{sourceCards.length} ready</span></div>
        <button className="primary" onClick={() => { setLearnSource(sourceView); setLearnScope('CURRENT'); setLearnMode('NEW'); setTab('learn'); setSourceView(null) }}>Start Learning</button>
        <button className="secondary" onClick={() => addToLearn(sourceCards)}>Add to Queue</button>
        <button className="secondary" onClick={() => prepareCards(sourceCards)} disabled={audioBusy}>{audioBusy ? 'Preparing...' : 'Prepare Source Audio'}</button>
        <div className="sourceTools"><button onClick={() => renameSource(sourceView)}>Rename Source</button><button className="dangerLite" onClick={() => deleteSource(sourceView)}>Delete Source</button></div>
        <p className="libraryHint">Tap any item below to edit, move, or delete it.</p>
        {audioMsg && <p className="audioMsg">{audioMsg}</p>}
        <div className="previewList">{sourceCards.map(card => <div className="previewItem" key={card.id} onClick={() => setEditing(card)}>
          <strong>{card.content}</strong><p>{card.meaning}</p><small>{chunkLabel(card.type)} · Audio {countAudio(card).ready}/{countAudio(card).total}</small>
        </div>)}</div>
      </section>}

      {tab === 'library' && editing && <EditCard card={editing} onBack={() => setEditing(null)} onSave={saveEdit} onDelete={(id) => { if(confirm('确定删除吗？')) { setCards(cards.filter(c => c.id !== id)); setEditing(null) }}} />}

      {tab === 'settings' && <section className="page">
        <h1>Settings</h1>
        <div className="settingBox"><label>OpenAI API Key（可选）</label><input className="search" type="password" placeholder="Cloudflare 已配置密钥可留空；或填写 sk-..." value={settings.apiKey} onChange={e => setSettings({ ...settings, apiKey: e.target.value, openaiStatus: 'Not tested' })} /><button className="secondary" onClick={() => { save(SETTINGS_KEY, settings); alert('API Key 已保存。') }}>Save API Key</button><button className="primary" onClick={testOpenAI} disabled={audioBusy}>{audioBusy ? 'Testing...' : 'Test OpenAI Voice'}</button><div className="debug"><p>OpenAI: {settings.openaiStatus}</p><p>Last Error: {settings.lastError || 'none'}</p></div></div>
        <div className="settingBox"><label>Chunk / Word Voice</label><select value={settings.contentVoice || settings.voice} onChange={e => setSettings({ ...settings, contentVoice: e.target.value })}>{['alloy','ash','ballad','coral','echo','fable','nova','onyx','sage','shimmer'].map(v => <option key={v}>{v}</option>)}</select><label>Example Voice</label><select value={settings.exampleVoice || settings.voice} onChange={e => setSettings({ ...settings, exampleVoice: e.target.value })}>{['alloy','ash','ballad','coral','echo','fable','nova','onyx','sage','shimmer'].map(v => <option key={v}>{v}</option>)}</select><label>Pause Between Audio</label><select value={settings.pauseSeconds} onChange={e => setSettings({ ...settings, pauseSeconds: Number(e.target.value) })}><option value={2}>2 seconds</option><option value={4}>4 seconds</option><option value={6}>6 seconds</option><option value={10}>10 seconds</option></select><label>Role-play Pause</label><select value={settings.rolePlayPauseSeconds || 4} onChange={e => setSettings({ ...settings, rolePlayPauseSeconds: Number(e.target.value) })}><option value={2}>2 seconds</option><option value={4}>4 seconds</option><option value={6}>6 seconds</option><option value={10}>10 seconds</option></select><label>Auto Repeat for Single Audio</label><select value={settings.audioRepeat || 1} onChange={e => setSettings({ ...settings, audioRepeat: Number(e.target.value) })}><option value={1}>Off</option><option value={2}>2x</option><option value={3}>3x</option></select><label>Font Size</label><select value={settings.fontSize} onChange={e => setSettings({ ...settings, fontSize: e.target.value })}><option value="normal">Normal</option><option value="large">Large</option><option value="xlarge">Extra Large</option></select><button className="primary" onClick={saveAllSettings}>Save Settings</button>{settingsSavedMsg && <p className="audioMsg">{settingsSavedMsg}</p>}</div>
        <button className="danger" onClick={() => confirm('确定清空所有数据吗？') && setCards([])}>Clear All Data</button>
      </section>}
    </main>
    <nav className="tabs">
      <button className={tab === 'learn' ? 'active' : ''} onClick={() => { stopAllAudio(); setTab('learn'); setSourceView(null); setEditing(null) }}>Learn</button>
      <button className={tab === 'import' ? 'active' : ''} onClick={() => { stopAllAudio(); setTab('import'); setSourceView(null); setEditing(null); setSelected(null) }}>Import</button>
      <button className={tab === 'library' ? 'active' : ''} onClick={() => { stopAllAudio(); setTab('library'); setSelected(null) }}>Library</button>
      <button className={tab === 'settings' ? 'active' : ''} onClick={() => { stopAllAudio(); setTab('settings'); setSourceView(null); setEditing(null); setSelected(null) }}>Settings</button>
    </nav>
  </div>
}

function EditCard({ card, onBack, onSave, onDelete }) {
  const [draft, setDraft] = useState(() => {
    const normalized = normalizeCard(card)
    return {
      ...normalized,
      examplesText: (normalized.examples || []).map(x => x.text || x).join('\n'),
      dialogueText: (normalized.dialogue || []).map(x => x.text || x).join('\n'),
      tagsText: (normalized.tags || []).join(',')
    }
  })
  return <section className="page">
    <div className="topbar"><button className="smallButton" onClick={onBack}>Back</button><span>{draft.type}</span></div>
    <label>Type</label><select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}><option>WORD</option><option>CHUNK</option><option>SENTENCE</option><option>PATTERN</option><option>DIALOGUE</option></select>
    <label>Content</label><input className="search" value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} />
    <label>Meaning</label><input className="search" value={draft.meaning} onChange={e => setDraft({ ...draft, meaning: e.target.value })} />
    <label>Pattern</label><input className="search" value={draft.pattern || ''} onChange={e => setDraft({ ...draft, pattern: e.target.value })} />
    <label>Examples</label><textarea className="smallTextarea" value={draft.examplesText} onChange={e => setDraft({ ...draft, examplesText: e.target.value })} />
    <label>Mini Dialogue</label><textarea className="smallTextarea" value={draft.dialogueText} onChange={e => setDraft({ ...draft, dialogueText: e.target.value })} />
    <label>Source</label><input className="search" value={draft.source || ''} onChange={e => setDraft({ ...draft, source: e.target.value })} />
    <label>Category</label><input className="search" value={draft.category || ''} onChange={e => setDraft({ ...draft, category: e.target.value })} />
    <label>Tags</label><input className="search" value={draft.tagsText || ''} onChange={e => setDraft({ ...draft, tagsText: e.target.value })} />
    <button className="primary" onClick={() => onSave(draft)}>Save</button><button className="danger" onClick={() => onDelete(card.id)}>Delete</button>
  </section>
}

createRoot(document.getElementById('root')).render(<AppErrorBoundary><App /></AppErrorBoundary>)
