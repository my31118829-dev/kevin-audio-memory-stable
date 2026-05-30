import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const STORE_KEY = 'kam_stable_store_v394'
const SETTINGS_KEY = 'kam_stable_settings_v394'
const APP_VERSION = '3.9.4'
const LOCAL_AUDIO_DB = 'kam_stable_original_audio_v1'
const LOCAL_AUDIO_STORE = 'originalAudio'
const ACTIVE_USER_KEY = 'kam_stable_active_user_v1'
const USER_PROFILES_KEY = 'kam_stable_user_profiles_v1'

const DEFAULT_USER_PROFILES = [
  { id: 'kevin', name: 'Kevin', password: '' },
  { id: 'mandy', name: 'Mandy', password: '' }
]

const VOICE_OPTIONS = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer']

const SOURCE_TYPES = {
  textbookCourse: 'Textbook Course',
  realLifeExpansion: 'Expansion Pack',
  generalTopicPack: 'General Topic Pack'
}

const AUDIO_MODES = {
  original: 'Original Audio',
  generated: 'Generated Audio'
}

const NAV_ITEMS = [
  { id: 'today', hideOnMobile: false },
  { id: 'library', hideOnMobile: true },
  { id: 'learn', hideOnMobile: false },
  { id: 'practice', hideOnMobile: false },
  { id: 'output', hideOnMobile: false },
  { id: 'review', hideOnMobile: false }
]

const UI_TEXT = {
  en: {
    'nav.today': 'Today',
    'nav.library': 'Library',
    'nav.learn': 'Learn',
    'nav.practice': 'Practice',
    'nav.output': 'Output',
    'nav.review': 'Review',
    'navHint.today': 'Daily',
    'navHint.library': 'Content',
    'navHint.learn': 'Input',
    'navHint.practice': 'Practice',
    'navHint.output': 'Output',
    'navHint.review': 'Review',
    'title.today': 'Today',
    'title.library': 'Library',
    'title.learn': 'Learn Input',
    'title.practice': 'Practice Internalization',
    'title.output': 'Output Speaking',
    'title.review': 'Review Memory',
    'settings': 'Settings',
    'account': 'Account',
    'currentCourse': 'Current Course',
    'continueLearning': 'Continue Learning',
    'resumeStage': 'Resume {stage}',
    'lastStudied': 'Last studied {stage} · {date}',
    'notStartedYet': 'Not started yet',
    'stage.learn': 'Learn',
    'stage.practice': 'Practice',
    'stage.output': 'Output',
    'stage.review': 'Review',
    'chooseCourse': 'Choose a course',
    'firstCourseHint': 'Open Library and import your first course.',
    'startLearn': 'Start Learn',
    'openLibrary': 'Open Library',
    'courses': 'Courses',
    'dueReview': 'Due Review',
    'lines': 'Lines',
    'todayPractice': 'Today Practice',
    'quickResponse': 'Quick Response',
    'practiceSuggested': '{count} suggested practice items from the current course.',
    'noPracticeQueued': 'No practice queued yet.',
    'startPractice': 'Start Practice',
    'todayReview': 'Today Review',
    'reviewMemory': 'Review Memory',
    'reviewReady': '{count} chunks, useful sentences, and weak items are ready today.',
    'startReview': 'Start Review',
    'libraryImport': 'Library / Import',
    'manageContent': 'Manage course content',
    'manageContentHint': 'Courses, packs, and import tools.',
    'macbook': 'MacBook',
    'macbookUse': 'Import, organize, type, edit',
    'macbookHint': 'Best for import, editing, and typing.',
    'iphone': 'iPhone 17 Pro',
    'iphoneUse': 'Listen, shadow, react, review',
    'iphoneHint': 'Best for listening, quick response, output, and review.',
    'courseLibrary': 'Course Library',
    'courseLibraryHint': 'Textbook courses, expansion packs, and topic packs.',
    'addContent': 'Add Content',
    'import': 'Import',
    'audioImport': 'Audio Import',
    'audioImportHint': 'For textbook original audio. Keep Original Audio Mode.',
    'textPackImport': 'Text Pack Import',
    'textPackImportHint': 'For ChatGPT topic packs and expansion packs. Use Generated Audio Mode.',
    'back': 'Back',
    'textbookAudioMode': 'Textbook Audio · Original Audio Mode',
    'audioImportNoticeTitle': 'Original textbook audio only.',
    'audioImportNoticeBody': 'Keeps original audio and builds subtitles plus training content.',
    'courseTitle': 'Course Title',
    'category': 'Category',
    'level': 'Level',
    'uploadTextbookAudio': 'Upload textbook audio',
    'smartProcess': 'Smart Process',
    'previewTranscript': 'Preview Transcript',
    'transcriptLines': 'Transcript / subtitle lines',
    'saveAudioCourse': 'Save Audio Course',
    'textPackDemoImport': 'Text Pack / Demo Pack Import',
    'textPackPlaceholder': 'Paste @@COURSE_START@@ text pack or Demo Content Pack markdown here...',
    'importDemoPack': 'Import Demo Pack',
    'importTextPack': 'Import Text Pack',
    'listen': 'Listen',
    'background': 'Background',
    'languagePreview': 'Language Preview',
    'play': 'Play',
    'playShort': 'Play',
    'listenAll': 'Listen All',
    'subtitleLines': 'subtitle lines',
    'languageItems': 'language items',
    'practiceTasks': 'practice tasks',
    'regenerateTraining': 'Regenerate Training',
    'addPractice': 'Add Practice',
    'addReview': 'Add Review',
    'saveReview': 'Save Review',
    'saveShort': 'Save',
    'starShort': '☆',
    'toolShort': 'Tools',
    'understand': 'Understand',
    'meaningUnits': 'Meaning Units',
    'currentLine': 'Current Line',
    'repeatCount': 'Repeat',
    'pauseControl': 'Pause',
    'manualPause': 'Manual',
    'cnOnly': 'CN only',
    'resetOriginal': 'Reset to Original',
    'resetOriginalUnavailable': 'Original baseline is not saved for this line yet.',
    'delete': 'Delete',
    'lineMore': 'Line Tools',
    'clickToPlay': 'Click any sentence or language item to play.',
    'examples': 'Examples',
    'automationExamples': 'Automation Examples',
    'originalLine': 'Original',
    'dailyLine': 'Daily',
    'savedReview': 'Saved to Review.',
    'editLine': 'Edit Line',
    'editShort': 'Edit',
    'lineEditor': 'Line Edit',
    'lineLabel': 'Line {number}',
    'timing': 'Timing',
    'structure': 'Structure',
    'text': 'Text',
    'playLine': 'Play Line',
    'prevLine': 'Prev',
    'nextLine': 'Next',
    'saveTiming': 'Save Timing',
    'timingSaved': 'Timing saved.',
    'splitHere': 'Split Here',
    'splitHint': 'Split after a word',
    'typing': 'Typing',
    'replacement': 'Replacement',
    'guidedSpeaking': 'Guided Speaking',
    'rolePlay': 'Role-play',
    'retell': 'Retell',
    'chunks': 'Chunks',
    'usefulSentences': 'Useful Sentences',
    'weakStuck': 'Weak / Stuck',
    'showAnswer': 'Show Answer',
    'again': 'Again',
    'good': 'Good',
    'check': 'Check',
    'next': 'Next',
    'open': 'Open',
    'continue': 'Continue',
    'progress': 'progress',
    'linkedTo': 'Linked to: {title}',
    'unaligned': 'unaligned',
    'unalignedWarning': '{count} unaligned subtitle lines need timestamp check',
    'noLanguageItems': 'No language items yet. Import a richer Text Pack or process textbook audio later.',
    'noPracticeItems': 'No practice items yet.',
    'noOutputTasks': 'No output tasks yet.',
    'noReviewToday': 'No review due today. New content will appear later, not immediately after import.',
    'noReviewSection': 'No cards in this review section yet.',
    'source.textbookCourse': 'Textbook Course',
    'source.realLifeExpansion': 'Expansion Pack',
    'source.generalTopicPack': 'General Topic Pack',
    'audio.original': 'Original Audio',
    'audio.generated': 'Generated Audio',
    'listen.textbook': 'Textbook Audio',
    'listen.generated': 'Generated Dialogue',
    'bg.Topic': 'Topic',
    'bg.Scene': 'Scene',
    'bg.Speakers': 'Speakers',
    'bg.Main Idea': 'Main Idea',
    'bg.Purpose': 'Purpose',
    'bg.Real-life Use': 'Real-life Use',
    'bg.Learning Goal': 'Learning Goal',
    'bg.Simple Chinese Explanation': 'Simple Chinese Explanation',
    'settingsTitle': 'Settings',
    'settingsNote': 'Version {version}',
    'studyStreak': 'Study Streak',
    'days': 'days',
    'todayDone': 'Today Done',
    'practiceDone': 'Practice',
    'outputDone': 'Output',
    'reviewDone': 'Review',
    'close': 'Close',
    'uiLanguage': 'Interface Language',
    'uiEnglish': 'English',
    'uiChinese': 'Chinese',
    'openaiKey': 'OpenAI API Key',
    'ttsVoice': 'TTS Voice',
    'defaultVoice': 'Default Voice',
    'speakerVoices': 'Speaker Voices',
    'speakerVoicesHint': 'Choose voices for generated dialogue speakers. Original audio courses still play the original audio.',
    'voiceFor': 'Voice for {speaker}',
    'languageDisplay': 'Learning Text Display',
    'pauseSeconds': 'Pause Seconds',
    'displayScale': 'Display Scale',
    'normal': 'Normal',
    'comfortable': 'Comfortable',
    'large': 'Large',
    'nextStep': 'Next Step',
    'practiceQuick': 'Practice quick response',
    'tryOutput': 'Try output speaking',
    'continueLearn': 'Continue Learn',
    'go': 'Go',
    'systemRule': 'System Rule',
    'systemRuleBody': 'Audio Import keeps original audio. Text Pack Import uses generated audio.',
    'deviceUse': 'Device Use',
    'deviceUseBody': 'MacBook for setup. iPhone for daily training.',
    'selectedAudio': 'Selected: {name}. Audio will be saved in IndexedDB, not localStorage.',
    'previewReady': 'Preview ready: {count} subtitle lines. Saving will generate training content automatically.',
    'lineEditorTitle': 'Transcript Line Editor',
    'lineEditorHint': 'Check textbook audio timestamps.',
    'addLine': 'Add Line',
    'mergeNext': 'Merge Next',
    'deleteLine': 'Delete Line',
    'nudgeStart': 'Start',
    'nudgeEnd': 'End',
    'speaker': 'Speaker',
    'start': 'Start',
    'end': 'End',
    'english': 'English',
    'chinese': 'Chinese',
    'copyVoicePrompt': 'Copy ChatGPT Voice Prompt',
    'missingFields': 'Missing Fields',
    'warnings': 'Warnings',
    'typeEnglishAnswer': 'Type the English answer...',
    'retellPlaceholder': 'Write or speak your retell here...',
    'answerPlaceholder': 'Type your answer here...',
    'accountSettings': 'Accounts',
    'accountName': 'Name',
    'accountPassword': 'Password',
    'passwordPlaceholder': 'Optional local password',
    'passwordPrompt': 'Password for {name}',
    'passwordWrong': 'Password is incorrect.',
    'passwordSavedHint': 'Local only. Leave blank for no password.',
    'dataBackup': 'Data Backup',
    'exportData': 'Export Current Account',
    'importData': 'Import to Current Account',
    'backupHint': 'Courses, review queue, progress, and activity for this account only.',
    'exportReady': 'Current account data exported.',
    'importDone': 'Current account data imported.',
    'importFailed': 'Import failed. Please choose a valid backup file.',
    'markWeak': 'Mark Weak',
    'markStuck': 'Mark Stuck',
    'addedWeak': 'Added to Weak / Stuck review.',
    'addedStuck': 'Output prompt added to Weak / Stuck review.',
    'typingWrongAdded': 'Answer checked. Wrong typing was added to Weak / Stuck review.',
    'typingCorrect': 'Correct.',
    'weakPriority': '{count} weak or stuck items need attention.'
  },
  zh: {
    'nav.today': '今日',
    'nav.library': '内容库',
    'nav.learn': '输入',
    'nav.practice': '内化',
    'nav.output': '输出',
    'nav.review': '复习',
    'navHint.today': '学习首页',
    'navHint.library': '课程管理',
    'navHint.learn': '听懂预习',
    'navHint.practice': '练成反应',
    'navHint.output': '说出使用',
    'navHint.review': '长期记住',
    'title.today': '今日',
    'title.library': '内容库',
    'title.learn': '输入理解',
    'title.practice': '内化训练',
    'title.output': '输出使用',
    'title.review': '长期复习',
    'settings': '设置',
    'account': '账户',
    'currentCourse': '当前课程',
    'continueLearning': '继续学习',
    'resumeStage': '继续{stage}',
    'lastStudied': '上次学习：{stage} · {date}',
    'notStartedYet': '还未开始',
    'stage.learn': '输入',
    'stage.practice': '内化',
    'stage.output': '输出',
    'stage.review': '复习',
    'chooseCourse': '选择课程',
    'firstCourseHint': '打开内容库并导入第一套课程。',
    'startLearn': '开始输入',
    'openLibrary': '打开内容库',
    'courses': '课程',
    'dueReview': '今日复习',
    'lines': '句',
    'todayPractice': '今日练习',
    'quickResponse': '快反',
    'practiceSuggested': '当前课程建议练习 {count} 项。',
    'noPracticeQueued': '暂无练习任务。',
    'startPractice': '开始练习',
    'todayReview': '今日复习',
    'reviewMemory': '复习记忆',
    'reviewReady': '今天有 {count} 个语块、实用句和易错内容需要复习。',
    'startReview': '开始复习',
    'libraryImport': '内容库 / 导入',
    'manageContent': '管理课程内容',
    'manageContentHint': '课程、训练包和导入工具。',
    'macbook': 'MacBook',
    'macbookUse': '导入、整理、打字、编辑',
    'macbookHint': '适合导入、编辑和打字。',
    'iphone': 'iPhone 17 Pro',
    'iphoneUse': '听、跟读、快反、复习',
    'iphoneHint': '适合听、快反、输出和复习。',
    'courseLibrary': '课程内容库',
    'courseLibraryHint': '教材课程、拓展训练包、自由主题包。',
    'addContent': '添加内容',
    'import': '导入',
    'audioImport': '音频导入',
    'audioImportHint': '只用于教材原音频，保持原音频模式。',
    'textPackImport': '文字稿导入',
    'textPackImportHint': '用于 ChatGPT 主题包和拓展训练包，使用生成音频模式。',
    'back': '返回',
    'textbookAudioMode': '教材音频 · 原音频模式',
    'audioImportNoticeTitle': '只用于教材原音频。',
    'audioImportNoticeBody': '保留原音频，并生成字幕与训练内容。',
    'courseTitle': '课程标题',
    'category': '分类',
    'level': '等级',
    'uploadTextbookAudio': '上传教材音频',
    'smartProcess': '智能处理',
    'previewTranscript': '预览字幕',
    'transcriptLines': '转录 / 字幕句子',
    'saveAudioCourse': '保存音频课程',
    'textPackDemoImport': '文字稿 / 演示包导入',
    'textPackPlaceholder': '在这里粘贴 @@COURSE_START@@ 文字包或 Demo Content Pack markdown...',
    'importDemoPack': '导入演示包',
    'importTextPack': '导入文字包',
    'listen': '听与跟读',
    'background': '背景理解',
    'languagePreview': '语言预习',
    'play': '播放',
    'playShort': '播',
    'listenAll': '全部听',
    'subtitleLines': '字幕句',
    'languageItems': '语言点',
    'practiceTasks': '练习任务',
    'regenerateTraining': '重新生成训练',
    'addPractice': '加入练习',
    'addReview': '加入复习',
    'saveReview': '收藏复习',
    'saveShort': '收',
    'starShort': '☆',
    'toolShort': '工具',
    'understand': '助解',
    'meaningUnits': '意义块',
    'currentLine': '当前句',
    'repeatCount': '重复',
    'pauseControl': '停顿',
    'manualPause': '手动',
    'cnOnly': '仅中文',
    'resetOriginal': '恢复原始',
    'resetOriginalUnavailable': '这句暂时没有可恢复的原始版本。',
    'delete': '删除',
    'lineMore': '句子工具',
    'clickToPlay': '点击句子或语言内容即可播放。',
    'examples': '例句',
    'automationExamples': '自动化例句',
    'originalLine': '原文',
    'dailyLine': '日常',
    'savedReview': '已加入复习。',
    'editLine': '微调句子',
    'editShort': '调',
    'lineEditor': '句子微调',
    'lineLabel': '第 {number} 句',
    'timing': '时间轴',
    'structure': '结构',
    'text': '文本',
    'playLine': '播放本句',
    'prevLine': '上一句',
    'nextLine': '下一句',
    'saveTiming': '保存时间',
    'timingSaved': '时间已保存。',
    'splitHere': '拆分句子',
    'splitHint': '点击单词后拆分',
    'typing': '拼写打字',
    'replacement': '替换练习',
    'guidedSpeaking': '半控制表达',
    'rolePlay': '角色扮演',
    'retell': '复述',
    'chunks': '语块',
    'usefulSentences': '实用句子',
    'weakStuck': '易错 / 卡壳',
    'showAnswer': '显示答案',
    'again': '再来',
    'good': '记住了',
    'check': '检查',
    'next': '下一个',
    'open': '打开',
    'continue': '继续',
    'progress': '进度',
    'linkedTo': '关联课程：{title}',
    'unaligned': '未对齐',
    'unalignedWarning': '{count} 条字幕需要检查时间轴',
    'noLanguageItems': '暂无语言点。可以导入更完整的文字包，或稍后处理教材音频。',
    'noPracticeItems': '暂无练习内容。',
    'noOutputTasks': '暂无输出任务。',
    'noReviewToday': '今天暂无到期复习。新内容会在之后进入复习队列。',
    'noReviewSection': '这个复习模块暂无卡片。',
    'source.textbookCourse': '教材课程',
    'source.realLifeExpansion': '拓展训练包',
    'source.generalTopicPack': '自由主题包',
    'audio.original': '原音频',
    'audio.generated': '生成音频',
    'listen.textbook': '教材原音频',
    'listen.generated': '生成对话音频',
    'bg.Topic': '主题',
    'bg.Scene': '场景',
    'bg.Speakers': '说话人',
    'bg.Main Idea': '主要内容',
    'bg.Purpose': '用途',
    'bg.Real-life Use': '现实生活用途',
    'bg.Learning Goal': '学习目标',
    'bg.Simple Chinese Explanation': '中文解释',
    'settingsTitle': '设置',
    'settingsNote': '版本 {version}',
    'studyStreak': '连续学习',
    'days': '天',
    'todayDone': '今日完成',
    'practiceDone': '练习',
    'outputDone': '输出',
    'reviewDone': '复习',
    'close': '关闭',
    'uiLanguage': '界面语言',
    'uiEnglish': '英文',
    'uiChinese': '中文',
    'openaiKey': 'OpenAI API Key',
    'ttsVoice': 'TTS 声音',
    'defaultVoice': '默认声音',
    'speakerVoices': '角色声音',
    'speakerVoicesHint': '为生成对话的不同说话人选择声音。教材原音频仍播放原音频。',
    'voiceFor': '{speaker} 的声音',
    'languageDisplay': '学习文本显示',
    'pauseSeconds': '停顿秒数',
    'displayScale': '显示大小',
    'normal': '普通',
    'comfortable': '舒适',
    'large': '大字',
    'nextStep': '下一步',
    'practiceQuick': '练快反',
    'tryOutput': '尝试输出',
    'continueLearn': '继续输入',
    'go': '前往',
    'systemRule': '系统规则',
    'systemRuleBody': '音频导入保留原音频；文字稿导入使用生成音频。',
    'deviceUse': '设备使用',
    'deviceUseBody': 'MacBook 做设置；iPhone 做每日训练。',
    'selectedAudio': '已选择：{name}。音频会保存到 IndexedDB，不存入 localStorage。',
    'previewReady': '预览已就绪：检测到 {count} 条字幕句。保存后会自动生成训练内容。',
    'lineEditorTitle': '字幕句编辑器',
    'lineEditorHint': '检查教材音频时间轴。',
    'addLine': '添加句子',
    'mergeNext': '合并下一句',
    'deleteLine': '删除句子',
    'nudgeStart': '开始',
    'nudgeEnd': '结束',
    'speaker': '说话人',
    'start': '开始',
    'end': '结束',
    'english': '英文',
    'chinese': '中文',
    'copyVoicePrompt': '复制 ChatGPT Voice 提示',
    'missingFields': '缺少字段',
    'warnings': '提醒',
    'typeEnglishAnswer': '输入英文答案...',
    'retellPlaceholder': '在这里写或说出你的复述...',
    'answerPlaceholder': '在这里输入你的回答...',
    'accountSettings': '账户',
    'accountName': '名字',
    'accountPassword': '密码',
    'passwordPlaceholder': '可选本地密码',
    'passwordPrompt': '{name} 的密码',
    'passwordWrong': '密码不正确。',
    'passwordSavedHint': '仅保存在本机。留空则无密码。',
    'dataBackup': '数据备份',
    'exportData': '导出当前账户',
    'importData': '导入到当前账户',
    'backupHint': '只包含当前账户的课程、复习队列、进度和使用记录。',
    'exportReady': '当前账户数据已导出。',
    'importDone': '当前账户数据已导入。',
    'importFailed': '导入失败，请选择有效的备份文件。',
    'markWeak': '标记易错',
    'markStuck': '标记卡壳',
    'addedWeak': '已加入易错 / 卡壳复习。',
    'addedStuck': '输出卡壳已加入复习。',
    'typingWrongAdded': '已检查。错误答案已加入易错 / 卡壳复习。',
    'typingCorrect': '答对了。',
    'weakPriority': '{count} 个易错 / 卡壳内容需要优先处理。'
  }
}

function makeExamples(examples = []) {
  return examples.map(example => typeof example === 'string' ? { en: example, cn: '' } : example)
}

function compactExamples(examples = []) {
  const seen = new Set()
  return makeExamples(examples)
    .map(example => ({
      en: String(example?.en || '').trim(),
      cn: String(example?.cn || '').trim(),
      origin: example?.origin || ''
    }))
    .filter(example => {
      if (!example.en) return false
      const key = example.en.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

function dailyExampleTemplates(text, type) {
  // Stable v3.9.4 baseline keeps original/example-driven content only.
  return []
}

function enrichLanguageItem(item, transcriptLines = []) {
  const sourceLine = String(item.sourceSentence || '').trim()
    || transcriptLines.find(line => item.en && String(line.en || '').toLowerCase().includes(String(item.en).toLowerCase()))?.en
    || ''
  if (item.type === 'keyword' || item.type === 'chunk') {
    const examples = compactExamples([
      sourceLine ? { en: sourceLine, cn: item.cn || '', origin: 'original' } : null,
      ...(item.examples || []).map(example => ({ ...example, origin: example.origin || 'daily' }))
    ].filter(Boolean)).slice(0, 3)
    return { ...item, sourceSentence: sourceLine, examples, autoSentences: item.autoSentences || [] }
  }
  if (item.type === 'pattern') {
    const autoSentences = compactExamples([
      sourceLine ? { en: sourceLine, cn: item.cn || '', origin: 'original' } : null,
      ...(item.autoSentences || item.examples || []).map(example => ({ ...example, origin: example.origin || 'daily' }))
    ].filter(Boolean)).slice(0, 3)
    return { ...item, sourceSentence: sourceLine, examples: item.examples || [], autoSentences }
  }
  return { ...item, examples: item.examples || [], autoSentences: item.autoSentences || [] }
}

function enrichLanguageItems(items = [], transcriptLines = []) {
  return items.map(item => enrichLanguageItem(item, transcriptLines))
}

function makeLanguageItems({ keywords = [], chunks = [], patterns = [], usefulSentences = [] }) {
  return enrichLanguageItems([
    ...keywords.map((item, index) => ({
      id: item.id || `demo_kw_${index}`,
      type: 'keyword',
      en: item.en,
      cn: item.cn,
      note: 'Keyword from the demo course.',
      sourceSentence: item.sourceSentence || '',
      examples: makeExamples(item.examples),
      autoSentences: [],
      reviewEnabled: false
    })),
    ...chunks.map((item, index) => ({
      id: item.id || `demo_chunk_${index}`,
      type: 'chunk',
      en: item.en,
      cn: item.cn,
      note: 'Chunk for automatic speaking practice.',
      sourceSentence: item.sourceSentence || '',
      examples: makeExamples(item.examples),
      autoSentences: [],
      reviewEnabled: true
    })),
    ...patterns.map((item, index) => ({
      id: item.id || `demo_pattern_${index}`,
      type: 'pattern',
      en: item.pattern || item.en,
      cn: item.cn,
      note: 'Pattern for replacement practice.',
      sourceSentence: item.sourceSentence || '',
      examples: [],
      autoSentences: makeExamples(item.automationSentences || []),
      reviewEnabled: true
    })),
    ...usefulSentences.map((item, index) => ({
      id: item.id || `demo_useful_${index}`,
      type: 'usefulSentence',
      en: item.en,
      cn: item.cn,
      note: 'Useful sentence for review and output.',
      sourceSentence: item.en,
      examples: [],
      autoSentences: [],
      reviewEnabled: true
    }))
  ])
}

function makePracticeItems({ quickResponse = [], typing = [], replacement = [] }) {
  return [
    ...quickResponse.map((item, index) => ({ id: item.id || `demo_q_${index}`, type: 'quickResponse', promptCn: item.promptCn, hint: item.hint || 'Demo practice', answerEn: item.answerEn })),
    ...typing.map((item, index) => ({ id: item.id || `demo_type_${index}`, type: 'typing', mode: item.mode || 'completion', promptCn: item.prompt || item.promptCn, answerEn: item.answer || item.answerEn })),
    ...replacement.flatMap((item, index) => (item.options || []).map((option, optionIndex) => ({
      id: item.id || `demo_rep_${index}_${optionIndex}`,
      type: 'replacement',
      base: item.baseSentence,
      replacement: option,
      answerEn: item.baseSentence.replace(item.replace, option)
    })))
  ]
}

function roleLines(lines = []) {
  return lines.map(line => {
    if (typeof line !== 'string') return line
    const match = line.match(/^([^:：]+)\s*[:：]\s*(.+)$/)
    return match ? { speaker: match[1].trim(), en: match[2].trim(), cn: '' } : { speaker: '', en: line, cn: '' }
  })
}

function makeOutputTasks({ guidedSpeaking = [], rolePlay = [], retell = [] }) {
  return [
    ...guidedSpeaking.map((item, index) => ({
      id: item.id || `demo_guided_${index}`,
      type: 'guidedSpeaking',
      prompt: item.question,
      hints: item.supportChunks || [],
      sentenceStarter: item.sentenceStarter || '',
      sample: item.sampleAnswer || ''
    })),
    ...rolePlay.map((item, index) => ({
      id: item.id || `demo_role_${index}`,
      type: 'rolePlay',
      scenario: item.scenario,
      userRole: item.roleB || 'Kevin',
      aiRole: item.roleA || 'Partner',
      lines: roleLines(item.lines)
    })),
    ...retell.map((item, index) => ({
      id: item.id || `demo_retell_${index}`,
      type: 'retell',
      prompt: item.prompt,
      keywords: item.keywords || [],
      frame: item.simpleFrame || '',
      sample: item.sample || ''
    }))
  ]
}

function makeReviewItems(courseId, items = []) {
  return items.map((item, index) => ({
    id: item.id || `${courseId}_review_${index}`,
    courseId,
    type: item.type,
    promptCn: item.promptCn,
    answerEn: item.answerEn,
    source: item.source || '',
    nextReviewAt: Date.now(),
    level: 0,
    status: item.status || 'new'
  }))
}

function createDemoCourse(config) {
  const now = new Date().toISOString()
  const transcriptLines = (config.transcriptLines || []).map((line, index) => ({ ...line, order: index + 1, aligned: line.aligned ?? config.audioMode !== 'original' }))
  const languageItems = enrichLanguageItems(makeLanguageItems(config.languagePreview || {}), transcriptLines)
  const practiceItems = makePracticeItems(config.practiceItems || {})
  const outputTasks = makeOutputTasks(config.outputTasks || {})
  const reviewItems = makeReviewItems(config.id, config.reviewItems || [])
  return {
    id: config.id,
    packType: config.packType,
    title: config.title,
    sourceType: config.sourceType,
    audioMode: config.audioMode,
    importMethod: config.importMethod,
    provider: config.provider || '',
    unit: config.unit || '',
    track: config.track || '',
    category: config.category || SOURCE_TYPES[config.sourceType],
    level: config.level,
    linkedCourseId: config.parentCourseId || '',
    linkedCourseTitle: config.linkedCourseTitle || '',
    status: config.audioMode === 'original' ? 'Audio Required' : 'Ready',
    progress: 0,
    goal: config.goal,
    scenario: config.scenario || '',
    tags: config.tags || [],
    background: {
      ...config.background,
      en: config.background?.mainIdea || config.background?.scene || config.goal,
      cn: config.background?.simpleCnExplanation || ''
    },
    uploadedAudioUrl: '',
    generatedTtsAudioUrl: null,
    transcriptLines,
    languageItems,
    practiceItems,
    outputTasks,
    reviewItems,
    stage6Prompt: '',
    createdAt: now,
    updatedAt: now
  }
}

const builtInDemoCourses = [
  createDemoCourse({
    id: 'EF_3A_GREAT_BRITAIN',
    packType: 'TEXTBOOK_COURSE',
    title: 'English File 3A — Great Britain',
    level: 'A2',
    sourceType: 'textbookCourse',
    audioMode: 'original',
    importMethod: 'audioImport',
    provider: 'English File',
    unit: '3A',
    track: '3.4',
    category: 'Textbook Courses',
    goal: 'I can understand people talking about what they like about Britain.',
    transcriptLines: [
      { id: '3A_34_01', speaker: 'Person 1', en: 'I like the multiculturalism.', cn: '我喜欢多元文化。', startTime: 0, endTime: 3, aligned: true },
      { id: '3A_34_02', speaker: 'Person 1', en: 'People from all over the world live in the UK, and they live together happily, usually.', cn: '来自世界各地的人住在英国，而且通常他们相处得很融洽。', startTime: 3, endTime: 10, aligned: true },
      { id: '3A_34_03', speaker: 'Person 2', en: 'For me, it’s the language.', cn: '对我来说，是语言。', startTime: 10, endTime: 13, aligned: true },
      { id: '3A_34_04', speaker: 'Person 2', en: 'English is international.', cn: '英语是国际语言。', startTime: 13, endTime: 16, aligned: true },
      { id: '3A_34_05', speaker: 'Person 2', en: 'I speak English. You speak English. I’m lucky — I don’t have communication problems.', cn: '我说英语，你也说英语。我很幸运，我没有沟通问题。', startTime: 16, endTime: 24, aligned: true },
      { id: '3A_34_06', speaker: 'Person 3', en: 'I like the gardens.', cn: '我喜欢花园。', startTime: 24, endTime: 27, aligned: true },
      { id: '3A_34_07', speaker: 'Person 3', en: 'I have a small one, but I have flowers and vegetables in it.', cn: '我有一个小花园，但里面有花和蔬菜。', startTime: 27, endTime: 34, aligned: true },
      { id: '3A_34_08', speaker: 'Person 3', en: 'When the sun’s out, I sit there and I feel really happy.', cn: '太阳出来的时候，我坐在那里，感觉很开心。', startTime: 34, endTime: 41, aligned: true },
      { id: '3A_34_09', speaker: 'Person 4', en: 'I love the freedom.', cn: '我喜欢自由。', startTime: 41, endTime: 44, aligned: true },
      { id: '3A_34_10', speaker: 'Person 4', en: 'I wear what I want. I say what I want. I do what I want.', cn: '我想穿什么就穿什么，想说什么就说什么，想做什么就做什么。', startTime: 44, endTime: 52, aligned: true }
    ],
    background: {
      topic: 'What people like about Britain',
      scene: 'Different people talk about what they like about living in Britain.',
      mainIdea: 'People like different things about Britain, such as multiculturalism, language, gardens, freedom, the BBC, pubs, weather, and Indian food.',
      realLifeUse: 'This lesson helps the learner talk about what they like about a country, a city, or a place where they live.',
      learningGoal: 'The learner can use simple present sentences to talk about likes, places, people, food, weather, and daily life.',
      simpleCnExplanation: '这段听力主要练习如何表达“我喜欢某个地方的什么”。这些表达可以迁移到澳洲生活中，例如谈论墨尔本的多元文化、天气、食物、社区和生活方式。'
    },
    languagePreview: {
      keywords: [
        { en: 'multiculturalism', cn: '多元文化', sourceSentence: 'I like the multiculturalism.', examples: ['Melbourne has a lot of multiculturalism.', 'Multiculturalism is important in Australia.'] },
        { en: 'language', cn: '语言', sourceSentence: 'For me, it’s the language.', examples: ['English is an important language in Australia.', 'For me, the language is difficult but useful.'] },
        { en: 'freedom', cn: '自由', sourceSentence: 'I love the freedom.', examples: ['I like the freedom in Australia.', 'Freedom is important to me.'] }
      ],
      chunks: [
        { en: 'people from all over the world', cn: '来自世界各地的人', sourceSentence: 'People from all over the world live in the UK.', examples: ['People from all over the world live in Melbourne.', 'Students from all over the world study here.'] },
        { en: 'for me', cn: '对我来说', sourceSentence: 'For me, it’s the language.', examples: ['For me, English is important.', 'For me, Melbourne is a good place to live.'] },
        { en: 'one thing I really like', cn: '我真的很喜欢的一点', sourceSentence: 'One thing I really like is the BBC.', examples: ['One thing I really like is the public transport.', 'One thing I really like is the multicultural food.'] }
      ],
      patterns: [
        { pattern: 'I like ...', cn: '我喜欢……', sourceSentence: 'I like the multiculturalism.', automationSentences: ['I like the weather.', 'I like the food.', 'I like the people.', 'I like the lifestyle.'] },
        { pattern: 'For me, it’s ...', cn: '对我来说，是……', sourceSentence: 'For me, it’s the language.', automationSentences: ['For me, it’s the weather.', 'For me, it’s the transport.', 'For me, it’s the people.', 'For me, it’s the food.'] },
        { pattern: 'One thing I really like is ...', cn: '我真的很喜欢的一点是……', sourceSentence: 'One thing I really like is the BBC.', automationSentences: ['One thing I really like is the multiculturalism.', 'One thing I really like is the public transport.', 'One thing I really like is the local library.', 'One thing I really like is the food.'] }
      ],
      usefulSentences: [
        { en: 'I like the multiculturalism.', cn: '我喜欢多元文化。' },
        { en: 'People from all over the world live in the UK.', cn: '来自世界各地的人住在英国。' },
        { en: 'For me, it’s the language.', cn: '对我来说，是语言。' },
        { en: 'English is international.', cn: '英语是国际语言。' },
        { en: 'I love the freedom.', cn: '我喜欢自由。' }
      ]
    },
    practiceItems: {
      quickResponse: [
        { promptCn: '对我来说，是语言。', answerEn: 'For me, it’s the language.' },
        { promptCn: '来自世界各地的人。', answerEn: 'People from all over the world.' },
        { promptCn: '我喜欢多元文化。', answerEn: 'I like the multiculturalism.' }
      ],
      typing: [
        { mode: 'completion', prompt: 'People from ______ live in the UK.', answer: 'all over the world' },
        { mode: 'completion', prompt: 'For me, it’s ______.', answer: 'the language' }
      ],
      replacement: [
        { baseSentence: 'I like the multiculturalism.', replace: 'multiculturalism', options: ['weather', 'food', 'people', 'lifestyle'] },
        { baseSentence: 'For me, it’s the language.', replace: 'the language', options: ['the weather', 'the transport', 'the people', 'the food'] }
      ]
    },
    outputTasks: {
      guidedSpeaking: [{ question: 'What do you like about living in Melbourne?', supportChunks: ['multiculturalism', 'people from all over the world', 'for me'], sentenceStarter: 'I like ...', sampleAnswer: 'I like the multiculturalism in Melbourne. People from all over the world live here.' }],
      rolePlay: [{ scenario: 'Talking with a neighbour about living in Melbourne', roleA: 'Neighbour', roleB: 'Kevin', lines: ['A: What do you like about living in Melbourne?', 'B: I like the multiculturalism.', 'A: Why do you like it?', 'B: Because people from all over the world live here.', 'A: What is difficult for you?', 'B: For me, it’s the language.'] }],
      retell: [{ prompt: 'Retell what people like about Britain in simple English.', keywords: ['multiculturalism', 'language', 'freedom', 'weather', 'Indian food'], simpleFrame: 'Some people like ... Other people like ... For me, ...', sample: 'Some people like the multiculturalism in Britain. Some people like the language. Other people like the weather and the food.' }]
    },
    reviewItems: [
      { type: 'chunk', promptCn: '来自世界各地的人', answerEn: 'people from all over the world', source: 'Textbook Course 3A' },
      { type: 'pattern', promptCn: '对我来说，是……', answerEn: 'For me, it’s ...', source: 'Textbook Course 3A' },
      { type: 'useful_sentence', promptCn: '我喜欢多元文化。', answerEn: 'I like the multiculturalism.', source: 'Textbook Course 3A' },
      { type: 'weak_sentence', promptCn: '会下雨，但不是每天都下。', answerEn: 'It rains, but it doesn’t rain every day.', source: 'Textbook Course 3A', status: 'weak' }
    ]
  }),
  createDemoCourse({
    id: 'EXP_3A_MELBOURNE_LIFE',
    packType: 'EXPANSION_PACK',
    title: 'Melbourne Life Expansion — What Kevin Likes About Melbourne',
    level: 'A2',
    sourceType: 'realLifeExpansion',
    audioMode: 'generated',
    importMethod: 'textPackImport',
    parentCourseId: 'EF_3A_GREAT_BRITAIN',
    linkedCourseTitle: 'English File 3A — Great Britain',
    category: 'Expansion Packs',
    goal: 'I can talk about what I like about living in Melbourne.',
    scenario: 'Kevin talks with a neighbour about life in Melbourne.',
    tags: ['Melbourne', 'daily life', 'opinion', 'multiculturalism'],
    transcriptLines: [
      { id: 'EXP_3A_01', speaker: 'Neighbour', en: 'Hi Kevin. Do you like living in Melbourne?', cn: 'Kevin，你喜欢住在墨尔本吗？' },
      { id: 'EXP_3A_02', speaker: 'Kevin', en: 'Yes, I do. I like the multiculturalism.', cn: '是的，我喜欢。我喜欢这里的多元文化。' },
      { id: 'EXP_3A_03', speaker: 'Neighbour', en: 'Why do you like it?', cn: '你为什么喜欢它？' },
      { id: 'EXP_3A_04', speaker: 'Kevin', en: 'People from all over the world live here.', cn: '来自世界各地的人都住在这里。' },
      { id: 'EXP_3A_05', speaker: 'Neighbour', en: 'What else do you like?', cn: '你还喜欢什么？' },
      { id: 'EXP_3A_06', speaker: 'Kevin', en: 'One thing I really like is the food.', cn: '我真的很喜欢的一点是这里的食物。' },
      { id: 'EXP_3A_07', speaker: 'Neighbour', en: 'What is difficult for you?', cn: '对你来说什么比较困难？' },
      { id: 'EXP_3A_08', speaker: 'Kevin', en: 'For me, it’s the language. English is important, but sometimes it is difficult.', cn: '对我来说，是语言。英语很重要，但有时候也很难。' }
    ],
    background: {
      topic: 'What Kevin likes about living in Melbourne',
      scene: 'Kevin meets a neighbour and talks about life in Melbourne.',
      speakers: 'Kevin and his neighbour',
      purpose: 'Practise talking about what you like about a city or country.',
      realLifeUse: 'This can be used when talking with neighbours, classmates, parents at school, or local friends.',
      learningGoal: 'The learner can use I like..., For me..., and One thing I really like is... to give simple opinions.',
      simpleCnExplanation: '这个拓展包把 3A 课文中“英国人喜欢英国什么”的主题，改成 Kevin 在墨尔本生活中可以使用的表达。'
    },
    languagePreview: {
      chunks: [
        { en: 'living in Melbourne', cn: '住在墨尔本', examples: ['I like living in Melbourne.', 'Living in Melbourne is good for my family.'] },
        { en: 'people from all over the world', cn: '来自世界各地的人', examples: ['People from all over the world live here.', 'People from all over the world work in Melbourne.'] }
      ],
      patterns: [
        { pattern: 'Do you like living in ...?', cn: '你喜欢住在……吗？', automationSentences: ['Do you like living in Melbourne?', 'Do you like living in Australia?', 'Do you like living in this area?'] },
        { pattern: 'What else do you like?', cn: '你还喜欢什么？', automationSentences: ['What else do you like about Melbourne?', 'What else do you like about Australia?', 'What else do you like about this suburb?'] }
      ],
      usefulSentences: [
        { en: 'I like living in Melbourne.', cn: '我喜欢住在墨尔本。' },
        { en: 'People from all over the world live here.', cn: '来自世界各地的人都住在这里。' },
        { en: 'One thing I really like is the food.', cn: '我真的很喜欢的一点是这里的食物。' },
        { en: 'For me, it’s the language.', cn: '对我来说，是语言。' }
      ]
    },
    practiceItems: {
      quickResponse: [
        { promptCn: '你喜欢住在墨尔本吗？', answerEn: 'Do you like living in Melbourne?' },
        { promptCn: '我喜欢这里的多元文化。', answerEn: 'I like the multiculturalism here.' },
        { promptCn: '来自世界各地的人住在这里。', answerEn: 'People from all over the world live here.' }
      ],
      replacement: [
        { baseSentence: 'I like the multiculturalism.', replace: 'multiculturalism', options: ['food', 'people', 'weather', 'lifestyle'] },
        { baseSentence: 'One thing I really like is the food.', replace: 'food', options: ['public transport', 'library', 'parks', 'community'] }
      ]
    },
    outputTasks: {
      guidedSpeaking: [{ question: 'What do you like about living in Melbourne?', supportChunks: ['multiculturalism', 'people from all over the world', 'food', 'public transport'], sentenceStarter: 'I like ...', sampleAnswer: 'I like the multiculturalism. People from all over the world live here.' }],
      rolePlay: [{ scenario: 'Talking with a neighbour', roleA: 'Neighbour', roleB: 'Kevin', lines: ['A: Do you like living in Melbourne?', 'B: Yes, I do. I like the multiculturalism.', 'A: What else do you like?', 'B: One thing I really like is the food.', 'A: What is difficult for you?', 'B: For me, it’s the language.'] }],
      retell: [{ prompt: 'Retell what Kevin likes about Melbourne.', keywords: ['Melbourne', 'multiculturalism', 'food', 'language'], simpleFrame: 'Kevin likes ... He also likes ... For him, ... is difficult.', sample: 'Kevin likes living in Melbourne. He likes the multiculturalism and the food. People from all over the world live there. For him, the language is sometimes difficult.' }]
    },
    reviewItems: [
      { type: 'chunk', promptCn: '住在墨尔本', answerEn: 'living in Melbourne', source: 'Expansion Pack 3A' },
      { type: 'useful_sentence', promptCn: '我喜欢住在墨尔本。', answerEn: 'I like living in Melbourne.', source: 'Expansion Pack 3A' },
      { type: 'pattern', promptCn: '你喜欢住在……吗？', answerEn: 'Do you like living in ...?', source: 'Expansion Pack 3A' }
    ]
  }),
  createDemoCourse({
    id: 'GEN_DOCTOR_APPOINTMENT_A2',
    packType: 'GENERAL_TOPIC_PACK',
    title: 'Doctor Appointment — Talking About Symptoms',
    level: 'A2',
    sourceType: 'generalTopicPack',
    audioMode: 'generated',
    importMethod: 'textPackImport',
    category: 'General Topic Packs',
    goal: 'I can talk about simple symptoms and make a doctor appointment.',
    scenario: 'Kevin calls a medical clinic to book an appointment.',
    tags: ['doctor', 'health', 'appointment', 'phone call'],
    transcriptLines: [
      { id: 'GEN_DOC_01', speaker: 'Receptionist', en: 'Good morning. Green Street Medical Clinic. How can I help you?', cn: '早上好，这里是 Green Street 诊所。有什么可以帮您？' },
      { id: 'GEN_DOC_02', speaker: 'Kevin', en: 'Hi. I’d like to make an appointment, please.', cn: '你好。我想预约看医生。' },
      { id: 'GEN_DOC_03', speaker: 'Receptionist', en: 'What is the problem?', cn: '请问是什么问题？' },
      { id: 'GEN_DOC_04', speaker: 'Kevin', en: 'I have a sore throat and a headache.', cn: '我嗓子疼，还有头痛。' },
      { id: 'GEN_DOC_05', speaker: 'Receptionist', en: 'Do you have a fever?', cn: '你发烧吗？' },
      { id: 'GEN_DOC_06', speaker: 'Kevin', en: 'No, I don’t think so.', cn: '没有，我觉得没有。' }
    ],
    background: {
      topic: 'Making a doctor appointment',
      scene: 'Kevin calls a clinic and talks to the receptionist.',
      speakers: 'Kevin and receptionist',
      purpose: 'Practise booking a medical appointment and describing simple symptoms.',
      realLifeUse: 'This is useful when calling a GP clinic in Australia.',
      learningGoal: 'The learner can say simple symptoms and ask for an appointment.',
      simpleCnExplanation: '这个主题包帮助 Kevin 练习在澳洲打电话预约医生，并用简单英语说明身体不舒服的情况。'
    },
    languagePreview: {
      keywords: [
        { en: 'appointment', cn: '预约', examples: ['I’d like to make an appointment.', 'I have a doctor appointment today.'] },
        { en: 'sore throat', cn: '嗓子疼', examples: ['I have a sore throat.', 'My daughter has a sore throat.'] }
      ],
      chunks: [
        { en: 'make an appointment', cn: '预约', examples: ['I’d like to make an appointment.', 'Can I make an appointment for tomorrow?'] },
        { en: 'I have a ...', cn: '我有……', examples: ['I have a headache.', 'I have a sore throat.'] }
      ],
      patterns: [
        { pattern: 'I’d like to ...', cn: '我想……', automationSentences: ['I’d like to make an appointment.', 'I’d like to see a doctor.', 'I’d like to change my appointment.'] }
      ],
      usefulSentences: [
        { en: 'I’d like to make an appointment, please.', cn: '我想预约一下。' },
        { en: 'I have a sore throat and a headache.', cn: '我嗓子疼，还有头痛。' },
        { en: 'Do you have a fever?', cn: '你发烧吗？' }
      ]
    },
    practiceItems: {
      quickResponse: [
        { promptCn: '我想预约看医生。', answerEn: 'I’d like to make an appointment, please.' },
        { promptCn: '我嗓子疼。', answerEn: 'I have a sore throat.' },
        { promptCn: '我头痛。', answerEn: 'I have a headache.' }
      ],
      typing: [
        { mode: 'completion', prompt: 'I’d like to make an ______, please.', answer: 'appointment' },
        { mode: 'completion', prompt: 'I have a sore ______.', answer: 'throat' }
      ],
      replacement: [
        { baseSentence: 'I have a headache.', replace: 'headache', options: ['sore throat', 'cough', 'fever', 'stomach ache'] }
      ]
    },
    outputTasks: {
      guidedSpeaking: [{ question: 'Why do you want to see a doctor?', supportChunks: ['sore throat', 'headache', 'make an appointment'], sentenceStarter: 'I have ...', sampleAnswer: 'I have a sore throat and a headache. I’d like to see a doctor.' }],
      rolePlay: [{ scenario: 'Calling a medical clinic', roleA: 'Receptionist', roleB: 'Kevin', lines: ['A: Good morning. How can I help you?', 'B: I’d like to make an appointment, please.', 'A: What is the problem?', 'B: I have a sore throat and a headache.', 'A: Do you have a fever?', 'B: No, I don’t think so.'] }],
      retell: [{ prompt: 'Retell the phone call in simple English.', keywords: ['appointment', 'doctor', 'sore throat', 'headache'], simpleFrame: 'Kevin calls ... He wants ... He has ...', sample: 'Kevin calls the medical clinic. He wants to make an appointment. He has a sore throat and a headache.' }]
    },
    reviewItems: [
      { type: 'chunk', promptCn: '预约', answerEn: 'make an appointment', source: 'General Topic Pack Doctor Appointment' },
      { type: 'useful_sentence', promptCn: '我想预约一下。', answerEn: 'I’d like to make an appointment, please.', source: 'General Topic Pack Doctor Appointment' },
      { type: 'useful_sentence', promptCn: '我嗓子疼，还有头痛。', answerEn: 'I have a sore throat and a headache.', source: 'General Topic Pack Doctor Appointment' }
    ]
  })
]

const builtInDemoCourseIds = new Set(builtInDemoCourses.map(course => course.id))
const builtInDemoReviewQueue = builtInDemoCourses.flatMap(course => course.reviewItems || [])
const defaultActivity = {
  streakDays: 0,
  lastStudyDate: '',
  totals: { practice: 0, output: 0, review: 0, weak: 0 },
  days: {}
}

const defaultStore = {
  version: 5,
  activeCourseId: builtInDemoCourses[0].id,
  courses: builtInDemoCourses,
  reviewQueue: builtInDemoReviewQueue,
  activity: defaultActivity
}

const defaultSettings = {
  apiKey: '',
  voice: 'alloy',
  speakerVoices: {
    Kevin: 'alloy',
    Mandy: 'coral',
    Neighbour: 'echo',
    Receptionist: 'nova',
    'Person 1': 'alloy',
    'Person 2': 'echo',
    'Person 3': 'fable'
  },
  displayMode: 'both',
  pauseSeconds: 2,
  lineRepeatCount: 1,
  fontScale: 'comfortable',
  uiLanguage: 'en'
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function userStoreKey(userId) {
  return `${STORE_KEY}_${userId || DEFAULT_USER_PROFILES[0].id}`
}

function formatUiText(template, values = {}) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '')
}

function normalizeUserProfiles(rawProfiles) {
  const incoming = Array.isArray(rawProfiles) ? rawProfiles : []
  return DEFAULT_USER_PROFILES.map(defaultProfile => {
    const existing = incoming.find(profile => profile?.id === defaultProfile.id) || {}
    return {
      ...defaultProfile,
      name: String(existing.name || defaultProfile.name).trim() || defaultProfile.name,
      password: String(existing.password || '')
    }
  })
}

function normalizeSettings(rawSettings) {
  const saved = rawSettings && typeof rawSettings === 'object' ? rawSettings : {}
  const pauseSeconds = saved.pauseSeconds === 'manual' ? 'manual' : ([1, 2, 3, 5].includes(Number(saved.pauseSeconds)) ? Number(saved.pauseSeconds) : defaultSettings.pauseSeconds)
  const lineRepeatCount = [1, 3, 5].includes(Number(saved.lineRepeatCount)) ? Number(saved.lineRepeatCount) : defaultSettings.lineRepeatCount
  return {
    ...defaultSettings,
    ...saved,
    pauseSeconds,
    lineRepeatCount,
    speakerVoices: {
      ...defaultSettings.speakerVoices,
      ...(saved.speakerVoices && typeof saved.speakerVoices === 'object' ? saved.speakerVoices : {})
    }
  }
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Local save failed. Large audio is stored outside localStorage.', error)
  }
}

function loadUserStore(userId) {
  const scoped = load(userStoreKey(userId), null)
  if (scoped) return scoped
  if (userId === DEFAULT_USER_PROFILES[0].id) return load(STORE_KEY, defaultStore)
  return defaultStore
}

function normalizeStore(store) {
  const incoming = store && typeof store === 'object' ? store : defaultStore
  const rawCourses = Array.isArray(incoming.courses) ? incoming.courses : []
  const sanitizedCourses = rawCourses.map(course => {
    const withLanguageExamples = {
      ...course,
      languageItems: enrichLanguageItems(course.languageItems || [], course.transcriptLines || [])
    }
    if (typeof course.uploadedAudioUrl === 'string' && course.uploadedAudioUrl.startsWith('data:audio')) {
      return { ...withLanguageExamples, uploadedAudioUrl: '', status: 'Audio needs re-upload' }
    }
    return withLanguageExamples
  })
  const incomingById = new Map(sanitizedCourses.map(course => [course.id, course]))
  const demoCourses = builtInDemoCourses.map(demo => {
    const existing = incomingById.get(demo.id)
    if (!existing) return demo
    const demoReviewIds = new Set((demo.reviewItems || []).map(item => item.id))
    const reviewItems = [
      ...(demo.reviewItems || []),
      ...(existing.reviewItems || []).filter(item => !demoReviewIds.has(item.id))
    ]
    return {
      ...demo,
      ...existing,
      progress: existing.progress ?? demo.progress,
      uploadedAudioUrl: existing.uploadedAudioUrl || demo.uploadedAudioUrl,
      status: existing.uploadedAudioUrl ? (existing.status === 'Audio Required' ? 'Ready' : existing.status) : demo.status,
      updatedAt: existing.updatedAt || demo.updatedAt,
      reviewItems
    }
  })
  const userCourses = sanitizedCourses.filter(course => !builtInDemoCourseIds.has(course.id))
  const courses = [...demoCourses, ...userCourses]
  const incomingQueue = Array.isArray(incoming.reviewQueue) ? incoming.reviewQueue : []
  const courseIds = new Set(courses.map(course => course.id))
  const reviewQueueById = new Map()
  courses.flatMap(course => course.reviewItems || []).forEach(item => reviewQueueById.set(item.id, item))
  incomingQueue.filter(item => !courseIds.has(item.courseId)).forEach(item => reviewQueueById.set(item.id, item))
  const reviewQueue = Array.from(reviewQueueById.values())
  const activeCourseId = courses.some(course => course.id === incoming.activeCourseId)
    ? incoming.activeCourseId
    : builtInDemoCourses[0].id
  return {
    ...defaultStore,
    ...incoming,
    activeCourseId,
    courses,
    reviewQueue,
    activity: normalizeActivity(incoming.activity)
  }
}

function openLocalAudioDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser.'))
      return
    }
    const request = indexedDB.open(LOCAL_AUDIO_DB, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(LOCAL_AUDIO_STORE)) db.createObjectStore(LOCAL_AUDIO_STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Audio storage failed.'))
  })
}

async function putOriginalAudioBlob(key, blob) {
  const db = await openLocalAudioDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_AUDIO_STORE, 'readwrite')
    tx.objectStore(LOCAL_AUDIO_STORE).put(blob, key)
    tx.oncomplete = () => resolve(`idb-audio:${key}`)
    tx.onerror = () => reject(tx.error || new Error('Audio save failed.'))
  })
}

async function getOriginalAudioBlob(ref) {
  const key = String(ref || '').replace(/^idb-audio:/, '')
  const db = await openLocalAudioDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_AUDIO_STORE, 'readonly')
    const request = tx.objectStore(LOCAL_AUDIO_STORE).get(key)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error || new Error('Audio load failed.'))
  })
}

function cleanLine(line) {
  return String(line || '').replace(/^[-•*]\s*/, '').replace(/^\d+[.)]\s*/, '').trim()
}

function splitBilingual(text) {
  const clean = cleanLine(text)
  const parts = clean.split(/\s+=\s+|\s+＝\s+|\s+--\s+/)
  return { en: (parts[0] || '').trim(), cn: (parts[1] || '').trim() }
}

function splitSpeakerLine(line) {
  let clean = cleanLine(line)
  let startTime = null
  let endTime = null
  const timeMatch = clean.match(/^\[?\s*([0-9:.]+)\s*(?:-|-->|to)\s*([0-9:.]+)\s*\]?\s*(.+)$/i)
  if (timeMatch) {
    startTime = parseTimecode(timeMatch[1])
    endTime = parseTimecode(timeMatch[2])
    clean = timeMatch[3].trim()
  }
  const match = clean.match(/^([^:：]{1,36})\s*[:：]\s*(.+)$/)
  if (!match) {
    const pair = splitBilingual(clean)
    return { speaker: '', en: pair.en, cn: pair.cn, startTime, endTime }
  }
  const pair = splitBilingual(match[2])
  return { speaker: match[1].trim(), en: pair.en, cn: pair.cn, startTime, endTime }
}

function parseTimecode(value) {
  const parts = String(value || '').trim().split(':').map(Number)
  if (parts.some(Number.isNaN)) return null
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return parts[0] * 3600 + parts[1] * 60 + parts[2]
}

function sectionMap(text) {
  const map = {}
  let current = 'ROOT'
  String(text || '').replace(/\r\n/g, '\n').split('\n').forEach(raw => {
    const marker = raw.match(/^\s*@@([A-Z0-9_ ]+)@@\s*$/)
    if (marker) {
      current = marker[1].trim().replace(/\s+/g, '_')
      map[current] = map[current] || []
    } else {
      map[current] = map[current] || []
      map[current].push(raw)
    }
  })
  return map
}

function keyValues(lines = []) {
  const out = {}
  let activeKey = ''
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const m = line.match(/^([A-Za-z0-9_ ]{2,40})\s*[:：]\s*(.*)$/)
    if (m && !/^(A|B|Kevin|Mandy|Staff|Teacher|Student|Doctor|Receptionist)$/i.test(m[1].trim())) {
      activeKey = m[1].trim().replace(/\s+/g, '_').toUpperCase()
      out[activeKey] = m[2].trim()
    } else if (activeKey) {
      out[activeKey] = `${out[activeKey] ? `${out[activeKey]}\n` : ''}${line}`
    }
  }
  return out
}

function getMetaValue(text, names, fallback = '') {
  for (const name of names) {
    const re = new RegExp(`^\\\\s*${name}\\\\s*[:：]\\\\s*(.+)$`, 'im')
    const m = String(text || '').match(re)
    if (m) return m[1].trim()
  }
  return fallback
}

function parseExpressionLines(lines, type, marker) {
  const items = []
  let current = null
  let mode = ''
  const commit = () => {
    if (current && current.en) items.push({ ...current, id: current.id || uid('lang') })
  }
  for (const raw of lines || []) {
    const line = raw.trim()
    if (!line) continue
    const head = line.match(new RegExp(`^(${marker}|WORD|CHUNK|PATTERN|SENTENCE)\\s*[:：]\\s*(.+)$`, 'i'))
    if (head) {
      commit()
      current = { type, en: head[2].trim(), cn: '', note: '', sourceSentence: '', examples: [], autoSentences: [], reviewEnabled: true }
      mode = ''
      continue
    }
    if (!current && line) {
      const pair = splitBilingual(line)
      current = { type, en: pair.en, cn: pair.cn, note: '', sourceSentence: '', examples: [], autoSentences: [], reviewEnabled: true }
      continue
    }
    if (!current) continue
    const field = line.match(/^([A-Z_ ]{2,32})\s*[:：]\s*(.*)$/)
    if (field) {
      const key = field[1].trim().replace(/\s+/g, '_').toUpperCase()
      const value = field[2].trim()
      if (['MEANING', 'CN', 'CHINESE'].includes(key)) current.cn = value
      else if (['NOTE', 'EXPLANATION'].includes(key)) current.note = value
      else if (['SOURCE_SENTENCE', 'SOURCE'].includes(key)) current.sourceSentence = value
      else if (['EXAMPLES', 'EXAMPLE'].includes(key)) mode = 'examples'
      else if (['AUTO_SENTENCES', 'REPLACEMENT', 'REPLACEMENTS'].includes(key)) mode = 'autoSentences'
      continue
    }
    const pair = splitBilingual(line)
    if (mode === 'autoSentences') current.autoSentences.push(pair)
    else current.examples.push(pair)
  }
  commit()
  return items
}

function parseTextPack(rawText) {
  const raw = String(rawText || '').trim()
  if (!raw) return null
  const sections = sectionMap(raw)
  const meta = keyValues(sections.COURSE_START || sections.ROOT || [])
  const id = uid('course')
  const sourceTypeRaw = meta.SOURCE_TYPE || meta.CONTENT_TYPE || getMetaValue(raw, ['SOURCE_TYPE', 'CONTENT_TYPE'], 'General Topic Pack')
  const sourceType = /textbook/i.test(sourceTypeRaw)
    ? 'textbookCourse'
    : /expansion|real/i.test(sourceTypeRaw)
      ? 'realLifeExpansion'
      : 'generalTopicPack'
  const title = meta.TITLE || meta.TOPIC_NAME || meta.LESSON || getMetaValue(raw, ['TITLE', 'TOPIC', 'COURSE_TITLE'], 'Imported Topic Pack')
  const level = meta.LEVEL || getMetaValue(raw, ['LEVEL'], 'A2')
  const category = meta.CATEGORY || getMetaValue(raw, ['CATEGORY'], sourceType === 'realLifeExpansion' ? 'Expansion Pack' : 'General')
  const goal = meta.GOAL || getMetaValue(raw, ['GOAL'], '')
  const backgroundKv = keyValues(sections.BACKGROUND || [])
  const background = {
    en: backgroundKv.EN || backgroundKv.BACKGROUND_EN || backgroundKv.SCENARIO_EN || '',
    cn: backgroundKv.CN || backgroundKv.BACKGROUND_CN || backgroundKv.SCENARIO_CN || ''
  }
  const dialogueLines = (sections.DIALOGUE || sections.STAGE_1_DIALOGUE || [])
    .map(splitSpeakerLine)
    .filter(line => line.en)
    .map((line, index) => ({ id: uid('line'), ...line, startTime: null, endTime: null, aligned: sourceType !== 'textbookCourse', order: index + 1 }))
  const words = parseExpressionLines(sections.VOCAB || sections.WORDS || sections.STAGE_2_VOCAB_CHUNKS || [], 'keyword', 'WORD')
  const chunks = parseExpressionLines(sections.CHUNKS || [], 'chunk', 'CHUNK')
  const patterns = parseExpressionLines(sections.PATTERNS || sections.STAGE_3_PATTERNS || [], 'pattern', 'PATTERN')
  const useful = parseExpressionLines(sections.USEFUL_SENTENCES || sections.STAGE_4_USEFUL_SENTENCES || [], 'usefulSentence', 'SENTENCE')
  const quick = []
  let currentQuick = null
  for (const rawLine of sections.QUICK_REACTION || sections.QUICK_RESPONSE || []) {
    const line = rawLine.trim()
    const field = line.match(/^([A-Z_]+)\s*[:：]\s*(.+)$/)
    if (!field) continue
    const key = field[1].toUpperCase()
    const value = field[2].trim()
    if (key === 'PROMPT') {
      if (currentQuick) quick.push(currentQuick)
      currentQuick = { id: uid('q'), type: 'quickResponse', promptCn: value, hint: '', answerEn: '' }
    } else if (currentQuick && key === 'HINT') currentQuick.hint = value
    else if (currentQuick && key === 'ANSWER') currentQuick.answerEn = value
  }
  if (currentQuick) quick.push(currentQuick)
  const outputKv = keyValues(sections.SEMI_CONTROLLED_TALK || sections.OUTPUT || sections.STAGE_5_GUIDED_CONVERSATION || [])
  const outputTasks = []
  if (outputKv.SCENARIO_CN || outputKv.PROMPT || outputKv.SAMPLE) {
    outputTasks.push({
      id: uid('out'),
      type: 'guidedSpeaking',
      prompt: outputKv.SCENARIO_CN || outputKv.PROMPT || 'Use this lesson to answer in English.',
      hints: String(outputKv.HELPFUL_EXPRESSIONS || outputKv.HINTS || '').split('\n').map(cleanLine).filter(Boolean),
      sample: outputKv.SAMPLE || outputKv.SAMPLE_ANSWER || ''
    })
  }
  if (dialogueLines.length) {
    outputTasks.push({
      id: uid('role'),
      type: 'rolePlay',
      scenario: title,
      userRole: /mandy/i.test(raw) ? 'Mandy' : 'Kevin',
      aiRole: dialogueLines.find(line => !/kevin|mandy/i.test(line.speaker))?.speaker || 'Partner',
      lines: dialogueLines.map(({ speaker, en, cn }) => ({ speaker, en, cn }))
    })
  }
  const languageItems = enrichLanguageItems([...words, ...chunks, ...patterns, ...useful], dialogueLines)
  const enrichedPatterns = languageItems.filter(item => item.type === 'pattern')
  const practiceItems = [
    ...quick,
    ...languageItems.filter(item => item.cn && item.en).slice(0, 12).map(item => ({ id: uid('type'), type: 'typing', promptCn: item.cn, answerEn: item.en })),
    ...enrichedPatterns.flatMap(item => (item.autoSentences || []).slice(0, 4).map(sentence => ({ id: uid('rep'), type: 'replacement', base: item.en, replacement: sentence.cn || sentence.en, answerEn: sentence.en })))
  ]
  const reviewItems = languageItems
    .filter(item => item.reviewEnabled && ['chunk', 'usefulSentence'].includes(item.type))
    .slice(0, 20)
    .map(item => ({ id: uid('review'), courseId: id, type: item.type, promptCn: item.cn, answerEn: item.en, nextReviewAt: Date.now() + 24 * 60 * 60 * 1000, level: 0, status: 'new' }))
  return {
    id,
    title,
    sourceType,
    audioMode: sourceType === 'textbookCourse' ? 'original' : 'generated',
    importMethod: sourceType === 'textbookCourse' ? 'audioImport' : 'textPackImport',
    category,
    level,
    linkedCourseId: meta.LINKED_COURSE_ID || '',
    status: sourceType === 'textbookCourse' ? 'Audio Required' : 'Ready',
    progress: 0,
    goal,
    background,
    uploadedAudioUrl: '',
    generatedTtsAudioUrl: null,
    transcriptLines: dialogueLines,
    languageItems,
    practiceItems,
    outputTasks,
    reviewItems,
    stage6Prompt: (sections.STAGE_6_PROMPT || sections.STAGE_6_CHATGPT_VOICE_PROMPT || []).join('\n').trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

function codeBlockAfter(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = String(text || '').match(new RegExp(`${escaped}[\\s\\S]*?\`\`\`(?:text)?\\n([\\s\\S]*?)\\n\`\`\``, 'i'))
  return match ? match[1].trim() : ''
}

function parseSimpleKvBlock(block) {
  const out = {}
  String(block || '').split('\n').forEach(raw => {
    const match = raw.match(/^\s*([A-Z0-9_ ]{2,40})\s*[:：]\s*(.+?)\s*$/)
    if (match) out[match[1].trim().replace(/\s+/g, '_').toUpperCase()] = match[2].trim()
  })
  return out
}

function parseRecordBlock(block, startKeys = []) {
  const records = []
  let current = null
  let listKey = ''
  const commit = () => {
    if (current && Object.keys(current).length) records.push(current)
  }
  String(block || '').split('\n').forEach(raw => {
    const line = raw.trim()
    if (!line) {
      commit()
      current = null
      listKey = ''
      return
    }
    const numbered = line.match(/^\d+[.)]\s*(.+)$/)
    if (numbered && current && listKey) {
      current[listKey] = [...(current[listKey] || []), numbered[1].trim()]
      return
    }
    const field = line.match(/^([A-Z0-9_ ]{2,40})\s*[:：]\s*(.*)$/)
    if (!field && current && listKey) {
      current[listKey] = [...(current[listKey] || []), line]
      return
    }
    if (!field) return
    const key = field[1].trim().replace(/\s+/g, '_').toUpperCase()
    const value = field[2].trim()
    if (startKeys.includes(key)) {
      commit()
      current = { [key]: value }
      listKey = ''
      return
    }
    if (!current) current = {}
    if (['EXAMPLES', 'AUTOMATION_SENTENCES', 'OPTIONS', 'LINES', 'KEYWORDS', 'SUPPORT_CHUNKS'].includes(key)) {
      listKey = key
      current[key] = value ? value.split(',').map(item => item.trim()).filter(Boolean) : []
    } else {
      current[key] = value
      listKey = ''
    }
  })
  commit()
  return records
}

function splitDemoSections(raw) {
  const matches = [...String(raw || '').matchAll(/^#\s+\d+\.\s+(Textbook Course|Expansion Pack|General Topic Pack) Demo\s*$/gim)]
  return matches.map((match, index) => {
    const start = match.index
    const end = matches[index + 1]?.index ?? raw.length
    return { type: match[1], text: raw.slice(start, end) }
  })
}

function normalizeSourceType(value = '') {
  if (/textbook/i.test(value)) return 'textbookCourse'
  if (/expansion|real/i.test(value)) return 'realLifeExpansion'
  return 'generalTopicPack'
}

function normalizeAudioMode(value = '', sourceType = '') {
  if (/original/i.test(value) || sourceType === 'textbookCourse') return 'original'
  return 'generated'
}

function secondsFromDemoTime(value) {
  return parseTimecode(String(value || '').replace(/^00:/, '0:'))
}

function parseDemoLines(block, sourceType) {
  return parseRecordBlock(block, ['LINE_ID']).map((record, index) => ({
    id: record.LINE_ID || uid('line'),
    speaker: record.SPEAKER || '',
    en: record.EN || '',
    cn: record.CN || '',
    startTime: record.START_TIME ? secondsFromDemoTime(record.START_TIME) : null,
    endTime: record.END_TIME ? secondsFromDemoTime(record.END_TIME) : null,
    aligned: String(record.ALIGNED || '').toLowerCase() === 'true' || sourceType !== 'textbookCourse',
    order: index + 1
  })).filter(line => line.en)
}

function parseUsefulSentences(block) {
  const lines = String(block || '').split('\n')
  const items = []
  let current = null
  lines.forEach(raw => {
    const line = raw.trim()
    const sentence = line.match(/^\d+[.)]\s*(.+)$/)
    if (sentence) {
      if (current?.en) items.push(current)
      current = { id: uid('lang'), type: 'usefulSentence', en: sentence[1].trim(), cn: '', note: 'Useful sentence from imported pack.', sourceSentence: sentence[1].trim(), examples: [], autoSentences: [], reviewEnabled: true }
      return
    }
    const cn = line.match(/^CN\s*[:：]\s*(.+)$/)
    if (cn && current) current.cn = cn[1].trim()
  })
  if (current?.en) items.push(current)
  return items
}

function parseDemoLanguage(sectionText) {
  const keywords = parseRecordBlock(codeBlockAfter(sectionText, '### KEYWORDS'), ['KEYWORD']).map(record => ({
    id: uid('lang'),
    type: 'keyword',
    en: record.KEYWORD,
    cn: record.CN || '',
    note: 'Keyword from imported pack.',
    sourceSentence: record.SOURCE_SENTENCE || '',
    examples: (record.EXAMPLES || []).map(en => ({ en, cn: '' })),
    autoSentences: [],
    reviewEnabled: false
  })).filter(item => item.en)
  const chunks = parseRecordBlock(codeBlockAfter(sectionText, '### CHUNKS'), ['CHUNK']).map(record => ({
    id: uid('lang'),
    type: 'chunk',
    en: record.CHUNK,
    cn: record.CN || '',
    note: 'Chunk from imported pack.',
    sourceSentence: record.SOURCE_SENTENCE || '',
    examples: (record.EXAMPLES || []).map(en => ({ en, cn: '' })),
    autoSentences: [],
    reviewEnabled: true
  })).filter(item => item.en)
  const patterns = parseRecordBlock(codeBlockAfter(sectionText, '### PATTERNS'), ['PATTERN']).map(record => ({
    id: uid('lang'),
    type: 'pattern',
    en: record.PATTERN,
    cn: record.CN || '',
    note: 'Pattern from imported pack.',
    sourceSentence: record.SOURCE_SENTENCE || '',
    examples: [],
    autoSentences: (record.AUTOMATION_SENTENCES || []).map(en => ({ en, cn: '' })),
    reviewEnabled: true
  })).filter(item => item.en)
  return [...keywords, ...chunks, ...patterns, ...parseUsefulSentences(codeBlockAfter(sectionText, '### USEFUL_SENTENCES'))]
}

function parseDemoPractice(sectionText) {
  const quick = parseRecordBlock(codeBlockAfter(sectionText, '### QUICK_RESPONSE'), ['PROMPT_CN']).map(record => ({
    id: uid('quick'),
    type: 'quickResponse',
    promptCn: record.PROMPT_CN || '',
    hint: 'Imported practice',
    answerEn: record.ANSWER_EN || ''
  })).filter(item => item.promptCn && item.answerEn)
  const typing = parseRecordBlock(codeBlockAfter(sectionText, '### TYPING'), ['MODE']).map(record => ({
    id: uid('type'),
    type: 'typing',
    mode: record.MODE || 'typing',
    promptCn: record.PROMPT || 'Listen and type.',
    answerEn: record.ANSWER || ''
  })).filter(item => item.answerEn)
  const replacement = parseRecordBlock(codeBlockAfter(sectionText, '### REPLACEMENT'), ['BASE_SENTENCE']).flatMap(record => {
    const options = record.OPTIONS || []
    return options.map(option => ({
      id: uid('rep'),
      type: 'replacement',
      base: record.BASE_SENTENCE || '',
      replacement: option,
      answerEn: String(record.BASE_SENTENCE || '').replace(record.REPLACE || option, option)
    }))
  }).filter(item => item.base && item.answerEn)
  return [...quick, ...typing, ...replacement]
}

function parseDemoRoleLines(lines = []) {
  return lines.map(raw => {
    const match = String(raw).match(/^([^:：]+)\s*[:：]\s*(.+)$/)
    return match ? { speaker: match[1].trim(), en: match[2].trim(), cn: '' } : null
  }).filter(Boolean)
}

function parseDemoOutput(sectionText) {
  const guided = parseSimpleKvBlock(codeBlockAfter(sectionText, '### GUIDED_SPEAKING'))
  const role = parseSimpleKvBlock(codeBlockAfter(sectionText, '### ROLE_PLAY'))
  const retell = parseSimpleKvBlock(codeBlockAfter(sectionText, '### RETELL'))
  const tasks = []
  if (guided.QUESTION || guided.SAMPLE_ANSWER) {
    tasks.push({
      id: uid('out'),
      type: 'guidedSpeaking',
      prompt: guided.QUESTION || 'Use this lesson to answer in English.',
      hints: String(guided.SUPPORT_CHUNKS || '').split(',').map(item => item.trim()).filter(Boolean),
      sample: guided.SAMPLE_ANSWER || ''
    })
  }
  const roleLines = parseRecordBlock(codeBlockAfter(sectionText, '### ROLE_PLAY'), ['SCENARIO'])[0]?.LINES || []
  const parsedRoleLines = parseDemoRoleLines(roleLines)
  if (parsedRoleLines.length) {
    tasks.push({
      id: uid('role'),
      type: 'rolePlay',
      scenario: role.SCENARIO || 'Role-play',
      userRole: role.ROLE_B || 'Kevin',
      aiRole: role.ROLE_A || 'Partner',
      lines: parsedRoleLines
    })
  }
  if (retell.PROMPT || retell.SAMPLE) {
    tasks.push({
      id: uid('retell'),
      type: 'retell',
      prompt: retell.PROMPT || 'Retell this lesson in simple English.',
      keywords: String(retell.KEYWORDS || '').split(',').map(item => item.trim()).filter(Boolean),
      frame: retell.SIMPLE_FRAME || '',
      sample: retell.SAMPLE || ''
    })
  }
  return tasks
}

function parseDemoReview(sectionText, courseId) {
  return parseRecordBlock(codeBlockAfter(sectionText, '## REVIEW_ITEMS'), ['TYPE']).map(record => ({
    id: uid('review'),
    courseId,
    type: record.TYPE || 'useful_sentence',
    promptCn: record.PROMPT_CN || '',
    answerEn: record.ANSWER_EN || '',
    source: record.SOURCE || '',
    nextReviewAt: Date.now() + 24 * 60 * 60 * 1000,
    level: 0,
    status: 'new'
  })).filter(item => item.promptCn && item.answerEn)
}

function buildImportReport(course, missingFields = [], warnings = []) {
  return {
    packType: course.packType || '',
    title: course.title,
    sourceType: SOURCE_TYPES[course.sourceType] || course.sourceType,
    audioMode: AUDIO_MODES[course.audioMode] || course.audioMode,
    importMethod: course.importMethod === 'audioImport' ? 'Audio Import' : 'Text Pack Import',
    linkedCourseTitle: course.linkedCourseTitle || '',
    learnItems: (course.transcriptLines?.length || 0) + (course.languageItems?.length || 0) + (course.background?.en || course.background?.cn ? 1 : 0),
    practiceItems: course.practiceItems?.length || 0,
    outputItems: course.outputTasks?.length || 0,
    reviewItems: course.reviewItems?.length || 0,
    missingFields,
    warnings
  }
}

function parseDemoCourse(section) {
  const meta = parseSimpleKvBlock(codeBlockAfter(section.text, '## 基本信息'))
  if (!meta.TITLE) return null
  const sourceType = normalizeSourceType(meta.SOURCE_TYPE || section.type)
  const audioMode = normalizeAudioMode(meta.AUDIO_MODE, sourceType)
  const id = sourceType === 'textbookCourse' ? (meta.PARENT_COURSE_ID || 'EF_3A_GREAT_BRITAIN') : uid('course')
  const lineBlock = sourceType === 'textbookCourse' ? codeBlockAfter(section.text, '## TRANSCRIPT_LINES') : codeBlockAfter(section.text, '## DIALOGUE')
  const transcriptLines = parseDemoLines(lineBlock, sourceType)
  const backgroundKv = parseSimpleKvBlock(codeBlockAfter(section.text, '## BACKGROUND'))
  const languageItems = enrichLanguageItems(parseDemoLanguage(section.text), transcriptLines)
  const practiceItems = parseDemoPractice(section.text)
  const outputTasks = parseDemoOutput(section.text)
  const reviewItems = parseDemoReview(section.text, id)
  const missingFields = []
  if (!transcriptLines.length) missingFields.push(sourceType === 'textbookCourse' ? 'TRANSCRIPT_LINES' : 'DIALOGUE')
  if (!languageItems.length) missingFields.push('LANGUAGE_PREVIEW')
  if (!practiceItems.length) missingFields.push('PRACTICE_ITEMS')
  if (!outputTasks.length) missingFields.push('OUTPUT_TASKS')
  const warnings = []
  if (sourceType === 'textbookCourse') warnings.push('Textbook Course keeps Original Audio Mode. Upload original audio later for playback; no TTS replacement will be used.')
  const course = {
    id,
    title: meta.TITLE,
    packType: meta.PACK_TYPE || section.type,
    sourceType,
    audioMode,
    importMethod: sourceType === 'textbookCourse' ? 'audioImport' : 'textPackImport',
    category: sourceType === 'textbookCourse' ? `${meta.PROVIDER || 'Textbook'} ${meta.UNIT || ''}`.trim() : (meta.SCENARIO || meta.TAGS || SOURCE_TYPES[sourceType]),
    level: meta.LEVEL || 'A2',
    linkedCourseId: meta.PARENT_COURSE_ID || '',
    linkedCourseTitle: meta.LINKED_COURSE_TITLE || '',
    status: sourceType === 'textbookCourse' ? 'Audio Required' : 'Ready',
    progress: 0,
    goal: meta.GOAL || backgroundKv.LEARNING_GOAL || '',
    background: {
      en: backgroundKv.MAIN_IDEA || backgroundKv.SCENE || backgroundKv.TOPIC || '',
      cn: backgroundKv.SIMPLE_CN_EXPLANATION || ''
    },
    uploadedAudioUrl: '',
    generatedTtsAudioUrl: null,
    transcriptLines,
    languageItems,
    practiceItems,
    outputTasks,
    reviewItems,
    stage6Prompt: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  return { ...course, importReport: buildImportReport(course, missingFields, warnings) }
}

function parseDemoContentPack(rawText) {
  const raw = String(rawText || '').trim()
  if (!/Demo Content Pack|PACK_TYPE:\s*(TEXTBOOK_COURSE|EXPANSION_PACK|GENERAL_TOPIC_PACK)/i.test(raw)) return null
  const courses = splitDemoSections(raw).map(parseDemoCourse).filter(Boolean)
  if (!courses.length) return null
  return {
    kind: 'bundle',
    id: uid('bundle'),
    title: 'English File 3A Demo Content Pack',
    courses,
    importReport: {
      packType: 'DEMO_CONTENT_PACK',
      title: 'English File 3A Demo Content Pack',
      sourceType: 'Mixed',
      audioMode: 'Original + Generated',
      importMethod: 'Demo Pack Import',
      linkedCourseTitle: 'English File 3A — Great Britain',
      learnItems: courses.reduce((sum, course) => sum + (course.importReport?.learnItems || 0), 0),
      practiceItems: courses.reduce((sum, course) => sum + (course.practiceItems?.length || 0), 0),
      outputItems: courses.reduce((sum, course) => sum + (course.outputTasks?.length || 0), 0),
      reviewItems: courses.reduce((sum, course) => sum + (course.reviewItems?.length || 0), 0),
      missingFields: courses.flatMap(course => (course.importReport?.missingFields || []).map(field => `${course.title}: ${field}`)),
      warnings: ['Textbook Course is imported as Original Audio metadata only. It will not use Generated Audio or TTS until original audio is uploaded.']
    }
  }
}

function attachImportReport(course) {
  return { ...course, importReport: buildImportReport(course) }
}

function parseImportText(rawText) {
  const demo = parseDemoContentPack(rawText)
  if (demo) return demo
  const single = parseTextPack(rawText)
  return single ? attachImportReport(single) : null
}

function parseManualTranscript(text) {
  return String(text || '')
    .split('\n')
    .map(splitSpeakerLine)
    .filter(line => line.en)
    .map((line, index) => ({ id: uid('line'), ...line, aligned: typeof line.startTime === 'number' && typeof line.endTime === 'number', order: index + 1 }))
}

function whisperToTranscriptLines(result) {
  const text = String(result?.text || '')
  return text
    .split(/(?<=[.!?])\s+/)
    .map(cleanLine)
    .filter(Boolean)
    .map((en, index) => ({ id: uid('line'), speaker: '', en, cn: '', startTime: null, endTime: null, aligned: false, order: index + 1 }))
}

function normalizeWordText(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9']/g, '')
}

function sentenceWords(sentence) {
  return String(sentence || '')
    .split(/\s+/)
    .map(normalizeWordText)
    .filter(Boolean)
}

function alignCleanSentencesToWords(sentences = [], words = []) {
  const normalizedWords = words
    .map((word, index) => ({
      index,
      word: normalizeWordText(word.word || word.text || ''),
      start: typeof word.start === 'number' ? word.start : null,
      end: typeof word.end === 'number' ? word.end : null
    }))
    .filter(item => item.word)
  let cursor = 0
  return sentences.map((sentence, sentenceIndex) => {
    const target = sentenceWords(sentence)
    let best = { score: 0, startIndex: -1, endIndex: -1 }
    if (target.length) {
      const searchEnd = Math.min(normalizedWords.length, cursor + Math.max(140, target.length * 5))
      for (let start = cursor; start < searchEnd; start++) {
        let matched = 0
        let wi = start
        for (const targetWord of target) {
          let foundAt = -1
          for (let look = wi; look < Math.min(normalizedWords.length, wi + 4); look++) {
            if (normalizedWords[look].word === targetWord) {
              foundAt = look
              break
            }
          }
          if (foundAt >= 0) {
            matched += 1
            wi = foundAt + 1
          } else {
            wi += 1
          }
        }
        const score = matched / target.length
        if (score > best.score) best = { score, startIndex: start, endIndex: Math.max(start, wi - 1) }
        if (score >= 0.95) break
      }
    }
    const aligned = best.score >= 0.8 && best.startIndex >= 0
    const startWord = aligned ? normalizedWords[best.startIndex] : null
    const endWord = aligned ? normalizedWords[best.endIndex] : null
    if (aligned) cursor = Math.max(cursor, best.endIndex + 1)
    return {
      id: uid('line'),
      speaker: '',
      en: cleanLine(sentence),
      cn: '',
      startTime: startWord?.start ?? null,
      endTime: endWord?.end ?? null,
      aligned,
      matchScore: Number(best.score.toFixed(2)),
      order: sentenceIndex + 1
    }
  }).filter(line => line.en)
}

function transcriptToText(lines = []) {
  return lines.map(line => {
    const start = typeof line.startTime === 'number' ? formatSeconds(line.startTime) : ''
    const end = typeof line.endTime === 'number' ? formatSeconds(line.endTime) : ''
    const time = start && end ? `[${start}-${end}] ` : ''
    const speaker = line.speaker ? `${line.speaker}: ` : ''
    const cn = line.cn ? ` = ${line.cn}` : ''
    return `${time}${speaker}${line.en}${cn}`
  }).join('\n')
}

function formatSeconds(seconds) {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return ''
  const mins = Math.floor(seconds / 60)
  const secs = seconds - mins * 60
  return `${String(mins).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`
}

function inferCnPrompt(line) {
  return line.cn || `听这句并说出英文：${line.speaker ? `${line.speaker} says` : 'sentence'}`
}

function extractWords(text) {
  const stop = new Set('the a an and or but to of in on at for with from this that it is are am was were be been being i you he she we they my your his her our their do does did can could would should will just really very have has had get got not no yes hi hello thanks thank okay sure please'.split(' '))
  return [...new Set(String(text || '').toLowerCase().match(/[a-z][a-z'-]{3,}/g) || [])]
    .filter(word => !stop.has(word))
    .slice(0, 8)
}

function countUnaligned(lines = []) {
  return lines.filter(line => !line.aligned).length
}

function listenGroupLabel(course) {
  return course?.sourceType === 'textbookCourse' ? 'Textbook Audio' : 'Generated Dialogue'
}

function languageTypeLabel(type) {
  if (type === 'keyword') return 'Keywords'
  if (type === 'chunk') return 'Chunks'
  if (type === 'pattern') return 'Patterns'
  return 'Useful Sentences'
}

function groupLanguageItems(items = []) {
  return [
    ['keyword', 'Keywords'],
    ['chunk', 'Chunks'],
    ['pattern', 'Patterns'],
    ['usefulSentence', 'Useful Sentences']
  ].map(([type, label]) => ({ type, label, items: items.filter(item => item.type === type) }))
}

function backgroundRows(background = {}) {
  return [
    ['Topic', background.topic],
    ['Scene', background.scene],
    ['Speakers', background.speakers],
    ['Main Idea', background.mainIdea || background.en],
    ['Purpose', background.purpose],
    ['Real-life Use', background.realLifeUse],
    ['Learning Goal', background.learningGoal],
    ['Simple Chinese Explanation', background.simpleCnExplanation || background.cn]
  ].filter(([, value]) => value)
}

function reviewBucketLabel(item) {
  if (item.status === 'weak' || item.status === 'stuck' || item.type === 'weak_sentence') return 'Weak / Stuck'
  if (item.type === 'chunk') return 'Chunks'
  if (item.type === 'usefulSentence' || item.type === 'useful_sentence' || item.type === 'sentence') return 'Useful Sentences'
  return 'Today Review'
}

function inferAudioType(lines = []) {
  const cleanLines = lines.filter(line => line.en)
  const text = cleanLines.map(line => line.en).join(' ')
  const speakerCount = new Set(cleanLines.map(line => line.speaker).filter(Boolean)).size
  const questionCount = cleanLines.filter(line => /\?/.test(line.en)).length
  const avgWords = cleanLines.length
    ? cleanLines.reduce((sum, line) => sum + line.en.split(/\s+/).filter(Boolean).length, 0) / cleanLines.length
    : 0

  if (!cleanLines.length) return 'textbookAudio'
  if (speakerCount >= 2) return 'listeningDialogue'
  if (questionCount >= 2 && cleanLines.length <= 12) return 'shortQA'
  if (cleanLines.length >= 8 && avgWords >= 9) return 'readingPassage'
  if (cleanLines.length >= 4 && avgWords <= 4) return 'vocabularyOrPhrases'
  if (questionCount >= 1) return 'grammarExamples'
  return 'textbookAudio'
}

function buildTrainingFromTranscript(courseId, title, lines = []) {
  const cleanLines = lines.filter(line => line.en)
  const audioType = inferAudioType(cleanLines)
  const usefulLines = cleanLines.filter(line => line.en.split(/\s+/).length >= 3).slice(0, 8)
  const words = extractWords(cleanLines.map(line => line.en).join(' ')).slice(0, 5).map(word => ({
    id: uid('lang'),
    type: 'keyword',
    en: word,
    cn: '',
    note: 'Keyword from the original textbook audio.',
    sourceSentence: cleanLines.find(line => line.en.toLowerCase().includes(word))?.en || '',
    examples: [],
    autoSentences: [],
    reviewEnabled: false
  }))
  const usefulSentences = usefulLines.map(line => ({
    id: uid('lang'),
    type: 'usefulSentence',
    en: line.en,
    cn: line.cn,
    note: 'Useful sentence from the original audio.',
    sourceSentence: line.en,
    examples: [],
    autoSentences: [],
    reviewEnabled: true
  }))
  const chunkCandidates = [
    ['Can I', '我可以……吗？'],
    ['I would like', '我想要……'],
    ['I need to', '我需要……'],
    ['Do you have', '你们有……吗？'],
    ['What do you', '你……什么？'],
    ['How do you', '你怎么……？'],
    ['for me', '对我来说'],
    ['a lot of', '很多'],
    ['from all over', '来自各地']
  ]
  const chunks = chunkCandidates
    .filter(([chunk]) => cleanLines.some(line => line.en.toLowerCase().includes(chunk.toLowerCase())))
    .slice(0, 5)
    .map(([chunk, cn]) => ({
      id: uid('lang'),
      type: 'chunk',
      en: chunk,
      cn,
      note: 'High-frequency chunk found in the original audio.',
      sourceSentence: cleanLines.find(line => line.en.toLowerCase().includes(chunk.toLowerCase()))?.en || '',
      examples: [],
      autoSentences: [],
      reviewEnabled: true
    }))
  const questionLine = cleanLines.find(line => /\?/.test(line.en))
  const patterns = questionLine ? [{
    id: uid('lang'),
    type: 'pattern',
    en: questionLine.en.replace(/\b[a-z][a-z']+\b/gi, word => ['what', 'where', 'when', 'why', 'how', 'do', 'does', 'did', 'can', 'could', 'would', 'is', 'are'].includes(word.toLowerCase()) ? word : '...'),
    cn: '根据原音频问题做替换练习',
    note: 'Pattern inferred from a question in the original audio.',
    sourceSentence: questionLine.en,
    examples: [],
    autoSentences: [{ en: questionLine.en, cn: questionLine.cn }],
    reviewEnabled: false
  }] : []
  const languageItems = enrichLanguageItems([...words, ...chunks, ...patterns, ...usefulSentences], cleanLines)
  const enrichedPatterns = languageItems.filter(item => item.type === 'pattern')
  const practiceItems = [
    ...usefulLines.slice(0, 8).map(line => ({ id: uid('quick'), type: 'quickResponse', promptCn: inferCnPrompt(line), hint: line.speaker ? `Speaker: ${line.speaker}` : 'From original audio', answerEn: line.en })),
    ...usefulLines.slice(0, 10).map(line => ({ id: uid('type'), type: 'typing', promptCn: line.cn || 'Listen and type this sentence.', answerEn: line.en })),
    ...enrichedPatterns.flatMap(pattern => (pattern.autoSentences || []).map(sentence => ({ id: uid('rep'), type: 'replacement', base: pattern.en, replacement: sentence.cn || 'original sentence', answerEn: sentence.en })))
  ]
  const outputTasks = [
    {
      id: uid('retell'),
      type: 'retell',
      prompt: '听完这段教材音频后，用自己的话复述主要内容。',
      keywords: extractWords(cleanLines.map(line => line.en).join(' ')).slice(0, 6),
      sample: cleanLines.slice(0, 4).map(line => line.en).join(' ')
    }
  ]
  const speakers = [...new Set(cleanLines.map(line => line.speaker).filter(Boolean))]
  if (speakers.length >= 2) {
    outputTasks.unshift({
      id: uid('role'),
      type: 'rolePlay',
      scenario: title,
      userRole: speakers.find(s => /kevin|mandy|student/i.test(s)) || speakers[1],
      aiRole: speakers[0],
      lines: cleanLines.map(({ speaker, en, cn, startTime, endTime, aligned }) => ({ speaker, en, cn, startTime, endTime, aligned }))
    })
  }
  outputTasks.unshift({
    id: uid('guided'),
    type: 'guidedSpeaking',
    prompt: '根据这段教材音频，用英文回答一个简单问题：What is this audio mainly about?',
    hints: languageItems.slice(0, 4).map(item => item.en),
    sample: cleanLines.slice(0, 2).map(line => line.en).join(' ')
  })
  const reviewItems = [...chunks, ...usefulSentences].slice(0, 16).map(item => ({
    id: uid('review'),
    courseId,
    type: item.type,
    promptCn: item.cn || '看中文/提示回忆英文',
    answerEn: item.en,
    nextReviewAt: Date.now() + 24 * 60 * 60 * 1000,
    level: 0,
    status: 'new'
  }))
  return { audioType, languageItems, practiceItems, outputTasks, reviewItems }
}

function reviewInterval(level) {
  if (level <= 0) return 1
  if (level === 1) return 3
  if (level === 2) return 7
  if (level === 3) return 14
  if (level === 4) return 30
  return 60
}

function dateLabel(ts) {
  if (!ts) return 'Not scheduled'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const target = new Date(ts); target.setHours(0, 0, 0, 0)
  const diff = Math.round((target - today) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}

function shortDateLabel(ts) {
  if (!ts) return ''
  try {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

function localDayKey(ts = Date.now()) {
  const date = new Date(ts)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function previousDayKey(dayKey) {
  const [year, month, day] = String(dayKey || '').split('-').map(Number)
  if (!year || !month || !day) return ''
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return localDayKey(date.getTime())
}

function normalizeActivity(activity = {}) {
  const totals = activity.totals || {}
  return {
    streakDays: Number(activity.streakDays || 0),
    lastStudyDate: String(activity.lastStudyDate || ''),
    totals: {
      practice: Number(totals.practice || 0),
      output: Number(totals.output || 0),
      review: Number(totals.review || 0),
      weak: Number(totals.weak || 0)
    },
    days: activity.days && typeof activity.days === 'object' ? activity.days : {}
  }
}

function bumpActivity(activity, kind) {
  const current = normalizeActivity(activity)
  const today = localDayKey()
  const todayStats = { practice: 0, output: 0, review: 0, weak: 0, ...(current.days[today] || {}) }
  if (kind in todayStats) todayStats[kind] += 1
  const totals = { ...current.totals }
  if (kind in totals) totals[kind] += 1
  let streakDays = current.streakDays || 0
  if (current.lastStudyDate !== today) {
    streakDays = current.lastStudyDate === previousDayKey(today) ? streakDays + 1 : 1
  }
  return {
    ...current,
    streakDays,
    lastStudyDate: today,
    totals,
    days: { ...current.days, [today]: todayStats }
  }
}

function App() {
  const [userProfiles, setUserProfiles] = useState(() => normalizeUserProfiles(load(USER_PROFILES_KEY, DEFAULT_USER_PROFILES)))
  const [activeUserId, setActiveUserId] = useState(() => {
    const saved = load(ACTIVE_USER_KEY, DEFAULT_USER_PROFILES[0].id)
    return DEFAULT_USER_PROFILES.some(user => user.id === saved) ? saved : DEFAULT_USER_PROFILES[0].id
  })
  const [store, setStore] = useState(() => normalizeStore(loadUserStore(activeUserId)))
  const [settings, setSettings] = useState(() => normalizeSettings(load(SETTINGS_KEY, {})))
  const [tab, setTab] = useState('today')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [libraryMode, setLibraryMode] = useState('list')
  const [librarySubtab, setLibrarySubtab] = useState('courses')
  const [learnSubtab, setLearnSubtab] = useState('audio')
  const [practiceMode, setPracticeMode] = useState('quick')
  const [outputMode, setOutputMode] = useState('guided')
  const [reviewMode, setReviewMode] = useState('today')
  const [activeIndex, setActiveIndex] = useState(0)
  const [answerShown, setAnswerShown] = useState(false)
  const [typed, setTyped] = useState('')
  const [message, setMessage] = useState('')
  const [textPack, setTextPack] = useState('')
  const [audioForm, setAudioForm] = useState({ title: '', category: 'Textbook', level: 'A2', transcript: '', audioPreviewUrl: '', fileName: '', processingDepth: 'full', processStep: 'idle' })
  const [editingLineId, setEditingLineId] = useState('')
  const [splitLineId, setSplitLineId] = useState('')
  const [lineMoreId, setLineMoreId] = useState('')
  const [understandLineId, setUnderstandLineId] = useState('')
  const audioRef = useRef(null)
  const audioFileRef = useRef(null)
  const backupFileRef = useRef(null)
  const ttsCache = useRef(new Map())
  const originalAudioUrlCache = useRef(new Map())

  const activeCourse = useMemo(
    () => store.courses.find(course => course.id === store.activeCourseId) || store.courses[0],
    [store]
  )
  const dueReview = useMemo(() => store.reviewQueue.filter(item => item.nextReviewAt <= Date.now()), [store.reviewQueue])
  const textPreview = useMemo(() => parseImportText(textPack), [textPack])
  const practicePool = useMemo(() => {
    if (!activeCourse) return []
    if (practiceMode === 'quick') return activeCourse.practiceItems.filter(item => item.type === 'quickResponse')
    if (practiceMode === 'typing') return activeCourse.practiceItems.filter(item => item.type === 'typing')
    return activeCourse.practiceItems.filter(item => item.type === 'replacement')
  }, [activeCourse, practiceMode])
  const outputPool = useMemo(() => {
    if (!activeCourse) return []
    const type = outputMode === 'guided' ? 'guidedSpeaking' : outputMode
    return activeCourse.outputTasks.filter(item => item.type === type)
  }, [activeCourse, outputMode])
  const courseGroups = useMemo(() => [
    { id: 'textbookCourse', title: 'Textbook Courses', courses: store.courses.filter(course => course.sourceType === 'textbookCourse') },
    { id: 'realLifeExpansion', title: 'Expansion Packs', courses: store.courses.filter(course => course.sourceType === 'realLifeExpansion') },
    { id: 'generalTopicPack', title: 'General Topic Packs', courses: store.courses.filter(course => course.sourceType === 'generalTopicPack') }
  ], [store.courses])
  const reviewBuckets = useMemo(() => {
    const buckets = { 'Chunks': 0, 'Useful Sentences': 0, 'Weak / Stuck': 0, 'Today Review': dueReview.length }
    store.reviewQueue.forEach(item => {
      const label = reviewBucketLabel(item)
      if (label !== 'Today Review') buckets[label] = (buckets[label] || 0) + 1
    })
    return buckets
  }, [store.reviewQueue, dueReview.length])
  const reviewPool = useMemo(() => {
    if (reviewMode === 'today') return dueReview
    if (reviewMode === 'chunks') return store.reviewQueue.filter(item => reviewBucketLabel(item) === 'Chunks')
    if (reviewMode === 'sentences') return store.reviewQueue.filter(item => reviewBucketLabel(item) === 'Useful Sentences')
    return store.reviewQueue.filter(item => reviewBucketLabel(item) === 'Weak / Stuck')
  }, [store.reviewQueue, dueReview, reviewMode])
  const weakReview = useMemo(() => store.reviewQueue.filter(item => reviewBucketLabel(item) === 'Weak / Stuck'), [store.reviewQueue])
  const todayActivity = useMemo(() => normalizeActivity(store.activity).days[localDayKey()] || { practice: 0, output: 0, review: 0, weak: 0 }, [store.activity])
  const todayPractice = useMemo(() => activeCourse?.practiceItems?.slice(0, 3) || [], [activeCourse])
  const recentCourses = useMemo(() => store.courses.slice(0, 4), [store.courses])
  const editorLines = activeCourse?.transcriptLines || []
  const selectedEditorIndex = Math.max(0, editorLines.findIndex(line => line.id === editingLineId))
  const selectedEditorLine = editorLines[selectedEditorIndex] || editorLines[0] || null
  const speakerVoiceNames = useMemo(() => {
    const names = new Set(['Kevin', 'Mandy', 'Neighbour', 'Receptionist'])
    ;(activeCourse?.transcriptLines || []).forEach(line => {
      if (line.speaker) names.add(line.speaker)
    })
    ;(activeCourse?.outputTasks || []).forEach(task => {
      ;(task.lines || []).forEach(line => {
        if (line.speaker) names.add(line.speaker)
      })
    })
    return Array.from(names).slice(0, 10)
  }, [activeCourse])
  const uiLanguage = settings.uiLanguage === 'zh' ? 'zh' : 'en'
  const t = (key, values) => formatUiText(UI_TEXT[uiLanguage]?.[key] ?? UI_TEXT.en[key] ?? key, values)

  useEffect(() => save(userStoreKey(activeUserId), store), [store, activeUserId])
  useEffect(() => save(ACTIVE_USER_KEY, activeUserId), [activeUserId])
  useEffect(() => save(USER_PROFILES_KEY, userProfiles), [userProfiles])
  useEffect(() => save(SETTINGS_KEY, settings), [settings])
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])

  function updateStore(next) {
    setStore(prev => typeof next === 'function' ? next(prev) : next)
  }

  function recordActivity(kind) {
    updateStore(prev => ({ ...prev, activity: bumpActivity(prev.activity, kind) }))
  }

  function recordStudy(stage, options = {}) {
    const courseId = options.courseId || activeCourse?.id
    if (!courseId) return
    updateStore(prev => ({
      ...prev,
      activity: options.activityKind ? bumpActivity(prev.activity, options.activityKind) : prev.activity,
      courses: prev.courses.map(course => course.id === courseId
        ? {
            ...course,
            lastStage: stage,
            lastStudiedAt: new Date().toISOString(),
            progress: Math.max(course.progress || 0, options.minProgress || 0),
            updatedAt: new Date().toISOString()
          }
        : course)
    }))
  }

  function updateUserProfile(userId, patch) {
    setUserProfiles(prev => prev.map(user => {
      if (user.id !== userId) return user
      const next = { ...user, ...patch }
      if ('name' in patch) next.name = String(patch.name || '').slice(0, 24)
      if ('password' in patch) next.password = String(patch.password || '').slice(0, 64)
      return next
    }))
  }

  function switchUser(nextUserId) {
    if (nextUserId === activeUserId) return
    const nextProfile = userProfiles.find(user => user.id === nextUserId)
    if (nextProfile?.password) {
      const entered = window.prompt(t('passwordPrompt', { name: nextProfile.name }))
      if (entered !== nextProfile.password) {
        setMessage(t('passwordWrong'))
        return
      }
    }
    stopAudio()
    save(userStoreKey(activeUserId), store)
    setActiveUserId(nextUserId)
    setStore(normalizeStore(loadUserStore(nextUserId)))
    setTab('today')
    setLibraryMode('list')
    setLibrarySubtab('courses')
    setActiveIndex(0)
    setAnswerShown(false)
    setTyped('')
    setMessage('')
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  async function playUrl(url, startTime = null, endTime = null) {
    if (!url) return
    stopAudio()
    const audio = new Audio(url)
    audioRef.current = audio
    if (typeof startTime === 'number') audio.currentTime = startTime
    if (typeof endTime === 'number') {
      audio.ontimeupdate = () => {
        if (audio.currentTime >= endTime) {
          audio.pause()
          audio.ontimeupdate = null
        }
      }
    }
    await audio.play()
  }

  async function resolveOriginalAudioUrl(ref) {
    if (!ref) return ''
    if (!String(ref).startsWith('idb-audio:')) return ref
    if (originalAudioUrlCache.current.has(ref)) return originalAudioUrlCache.current.get(ref)
    const blob = await getOriginalAudioBlob(ref)
    if (!blob) throw new Error('Original audio is missing. Please re-upload this audio.')
    const url = URL.createObjectURL(blob)
    originalAudioUrlCache.current.set(ref, url)
    return url
  }

  function voiceForSpeaker(speaker) {
    const key = String(speaker || '').trim()
    return (key && settings.speakerVoices?.[key]) || settings.voice || defaultSettings.voice
  }

  function setSpeakerVoice(speaker, voice) {
    setSettings(prev => ({
      ...prev,
      speakerVoices: {
        ...(prev.speakerVoices || {}),
        [speaker]: voice
      }
    }))
  }

  async function getTtsUrl(text, speaker = '') {
    const clean = String(text || '').trim()
    if (!clean) return ''
    const voice = voiceForSpeaker(speaker)
    const key = `${voice}:${clean}`
    if (ttsCache.current.has(key)) return ttsCache.current.get(key)
    const response = await fetch('/api/openai-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean, voice, apiKey: settings.apiKey })
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'OpenAI voice failed')
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    ttsCache.current.set(key, url)
    return url
  }

  async function playText(text, speaker = '') {
    try {
      setMessage('Preparing audio...')
      const url = await getTtsUrl(text, speaker)
      await playUrl(url)
      setMessage('')
    } catch (error) {
      setMessage(error?.message || 'Audio failed. Check Settings API key.')
    }
  }

  function pauseDurationMs() {
    if (settings.pauseSeconds === 'manual') return 0
    return (Number(settings.pauseSeconds) || 2) * 1000
  }

  async function playLine(line) {
    if (!activeCourse) return
    try {
      if (activeCourse.audioMode === 'original' && !activeCourse.uploadedAudioUrl) {
        setMessage('Original audio is required for this textbook course. Upload the textbook audio in Audio Import; the app will not replace it with TTS.')
        return
      }
      if (activeCourse.audioMode === 'original' && activeCourse.uploadedAudioUrl && typeof line.startTime === 'number') {
        await playUrl(await resolveOriginalAudioUrl(activeCourse.uploadedAudioUrl), line.startTime, line.endTime)
      } else if (activeCourse.audioMode === 'original' && activeCourse.uploadedAudioUrl) {
        setMessage('This line is unaligned, so the app will play the original audio from the start. Add timestamps in Line Editor for exact playback.')
        await playUrl(await resolveOriginalAudioUrl(activeCourse.uploadedAudioUrl))
      } else {
        await playText(line.en, line.speaker)
      }
      recordStudy('learn', { minProgress: 20 })
    } catch (error) {
      setMessage(error?.message || 'Audio playback failed.')
    }
  }

  async function playList(lines, options = {}) {
    for (const line of lines) {
      if (options.skipSpeaker && line.speaker?.toLowerCase() === options.skipSpeaker.toLowerCase()) {
        await new Promise(resolve => setTimeout(resolve, pauseDurationMs()))
        continue
      }
      await playText(line.en, line.speaker)
      await new Promise(resolve => setTimeout(resolve, pauseDurationMs()))
    }
  }

  async function playOriginalLineSequence(lines = [], options = {}) {
    if (!activeCourse?.uploadedAudioUrl) {
      setMessage('Original audio is required for this textbook course. The app will not use TTS as a substitute.')
      return
    }
    const playableLines = lines.filter(line => {
      if (options.skipSpeaker && line.speaker?.toLowerCase() === options.skipSpeaker.toLowerCase()) return false
      return typeof line.startTime === 'number' && typeof line.endTime === 'number'
    })
    if (!playableLines.length) {
      setMessage('No aligned subtitle lines yet. Open Line Editor and add start/end times, or use Play for the full original audio.')
      return
    }
    try {
      const url = await resolveOriginalAudioUrl(activeCourse.uploadedAudioUrl)
      stopAudio()
      const audio = new Audio(url)
      audioRef.current = audio
      for (const line of playableLines) {
        await new Promise((resolve, reject) => {
          audio.currentTime = line.startTime
          audio.ontimeupdate = () => {
            if (audio.currentTime >= line.endTime) {
              audio.pause()
              audio.ontimeupdate = null
              resolve()
            }
          }
          audio.onended = resolve
          audio.play().catch(reject)
        })
        await new Promise(resolve => setTimeout(resolve, pauseDurationMs()))
      }
      setMessage('')
    } catch (error) {
      setMessage(error?.message || 'Original audio playback failed.')
    }
  }

  async function playCourseTranscript(course) {
    if (course?.id) recordStudy('learn', { courseId: course.id, minProgress: 25 })
    if (course.audioMode === 'original') {
      await playOriginalLineSequence(course.transcriptLines || [])
    } else {
      await playList(course.transcriptLines || [])
    }
  }

  async function playOutputLines(lines, options = {}) {
    if (activeCourse?.audioMode === 'original') {
      await playOriginalLineSequence(lines, options)
    } else {
      await playList(lines, options)
    }
  }

  async function playCourseMain(course) {
    if (!course) return
    if (course.audioMode === 'original') {
      if (!course.uploadedAudioUrl) {
        setMessage('Original audio is required for this textbook course. Upload it through Audio Import before playback.')
        return
      }
      recordStudy('learn', { courseId: course.id, minProgress: 20 })
      await playUrl(await resolveOriginalAudioUrl(course.uploadedAudioUrl))
    } else {
      recordStudy('learn', { courseId: course.id, minProgress: 20 })
      await playList(course.transcriptLines || [])
    }
  }

  function selectCourse(courseId, nextTab = 'learn') {
    stopAudio()
    updateStore(prev => ({ ...prev, activeCourseId: courseId }))
    setActiveIndex(0)
    setAnswerShown(false)
    setTyped('')
    setTab(nextTab)
  }

  function openCourseStage(courseId, stage = 'learn') {
    selectCourse(courseId, stage)
    if (stage === 'review') setReviewMode(weakReview.length ? 'weak' : 'today')
  }

  function addCourse(course) {
    const queue = course.reviewItems || []
    updateStore(prev => ({
      ...prev,
      activeCourseId: course.id,
      courses: [course, ...prev.courses],
      reviewQueue: [...prev.reviewQueue, ...queue]
    }))
  }

  function addCourses(courses = []) {
    if (!courses.length) return
    const queue = courses.flatMap(course => course.reviewItems || [])
    updateStore(prev => ({
      ...prev,
      activeCourseId: courses[0].id,
      courses: [...courses, ...prev.courses],
      reviewQueue: [...prev.reviewQueue, ...queue]
    }))
  }

  function updateActiveCourse(updater) {
    if (!activeCourse) return
    updateStore(prev => {
      let nextCourse = null
      const courses = prev.courses.map(course => {
        if (course.id !== activeCourse.id) return course
        nextCourse = typeof updater === 'function' ? updater(course) : { ...course, ...updater }
        return { ...nextCourse, updatedAt: new Date().toISOString() }
      })
      const reviewQueue = nextCourse?.reviewItems
        ? [...prev.reviewQueue.filter(item => item.courseId !== activeCourse.id), ...nextCourse.reviewItems]
        : prev.reviewQueue
      return { ...prev, courses, reviewQueue }
    })
  }

  function regenerateActiveCourseTraining() {
    if (!activeCourse) return
    const generated = buildTrainingFromTranscript(activeCourse.id, activeCourse.title, activeCourse.transcriptLines || [])
    updateActiveCourse(course => ({
      ...course,
      ...generated,
      status: countUnaligned(course.transcriptLines || []) ? 'Need Check' : 'Ready',
      progress: Math.max(course.progress || 0, 10)
    }))
    setMessage('Training content generated from transcript: Language, Practice, Output, and Review are ready.')
  }

  function updateCourseLine(lineId, field, value) {
    updateActiveCourse(course => {
      const transcriptLines = (course.transcriptLines || []).map(line => {
        if (line.id !== lineId) return line
        const next = {
          ...line,
          [field]: field === 'startTime' || field === 'endTime' ? (value === '' ? null : Number(value)) : value
        }
        next.aligned = typeof next.startTime === 'number' && typeof next.endTime === 'number'
        return next
      })
      const generated = buildTrainingFromTranscript(course.id, course.title, transcriptLines)
      return { ...course, transcriptLines, ...generated, status: countUnaligned(transcriptLines) ? 'Need Check' : 'Ready' }
    })
  }

  function adjustCourseLineTime(lineId, field, delta) {
    const line = activeCourse?.transcriptLines?.find(item => item.id === lineId)
    if (!line) return
    const current = typeof line[field] === 'number' ? line[field] : 0
    updateCourseLine(lineId, field, Math.max(0, Math.round((current + delta) * 10) / 10))
  }

  function deleteTranscriptLine(lineId) {
    updateActiveCourse(course => {
      const transcriptLines = (course.transcriptLines || []).filter(line => line.id !== lineId)
      const generated = buildTrainingFromTranscript(course.id, course.title, transcriptLines)
      return { ...course, transcriptLines, ...generated, status: countUnaligned(transcriptLines) ? 'Need Check' : 'Ready' }
    })
  }

  function mergeTranscriptLineWithNext(lineId) {
    updateActiveCourse(course => {
      const lines = course.transcriptLines || []
      const index = lines.findIndex(line => line.id === lineId)
      if (index < 0 || index >= lines.length - 1) return course
      const current = lines[index]
      const next = lines[index + 1]
      const merged = {
        ...current,
        en: [current.en, next.en].filter(Boolean).join(' '),
        cn: [current.cn, next.cn].filter(Boolean).join(' '),
        endTime: typeof next.endTime === 'number' ? next.endTime : current.endTime,
        aligned: typeof current.startTime === 'number' && (typeof next.endTime === 'number' || typeof current.endTime === 'number')
      }
      const transcriptLines = [...lines.slice(0, index), merged, ...lines.slice(index + 2)]
      const generated = buildTrainingFromTranscript(course.id, course.title, transcriptLines)
      return { ...course, transcriptLines, ...generated, status: countUnaligned(transcriptLines) ? 'Need Check' : 'Ready' }
    })
  }

  function splitTranscriptLineAtWord(lineId, wordIndex) {
    updateActiveCourse(course => {
      const lines = course.transcriptLines || []
      const index = lines.findIndex(line => line.id === lineId)
      if (index < 0) return course
      const line = lines[index]
      const words = String(line.en || '').trim().split(/\s+/).filter(Boolean)
      if (wordIndex < 0 || wordIndex >= words.length - 1) return course
      const firstText = words.slice(0, wordIndex + 1).join(' ')
      const secondText = words.slice(wordIndex + 1).join(' ')
      const hasTimes = typeof line.startTime === 'number' && typeof line.endTime === 'number' && line.endTime > line.startTime
      const splitTime = hasTimes ? Math.round((line.startTime + ((line.endTime - line.startTime) * ((wordIndex + 1) / words.length))) * 10) / 10 : null
      const firstLine = {
        ...line,
        en: firstText,
        endTime: splitTime ?? line.endTime,
        aligned: typeof line.startTime === 'number' && typeof (splitTime ?? line.endTime) === 'number'
      }
      const secondLine = {
        ...line,
        id: uid('line'),
        en: secondText,
        cn: '',
        startTime: splitTime,
        endTime: line.endTime,
        aligned: typeof splitTime === 'number' && typeof line.endTime === 'number'
      }
      const transcriptLines = [...lines.slice(0, index), firstLine, secondLine, ...lines.slice(index + 1)]
      const generated = buildTrainingFromTranscript(course.id, course.title, transcriptLines)
      return { ...course, transcriptLines, ...generated, status: countUnaligned(transcriptLines) ? 'Need Check' : 'Ready' }
    })
    setSplitLineId('')
  }

  function addTranscriptLine() {
    if (!activeCourse) return
    updateActiveCourse(course => ({
      ...course,
      transcriptLines: [...(course.transcriptLines || []), { id: uid('line'), speaker: '', en: '', cn: '', startTime: null, endTime: null, aligned: false, order: (course.transcriptLines || []).length + 1 }]
    }))
  }

  async function transcribeAudioWithWhisper() {
    const file = audioFileRef.current
    if (!file) {
      setMessage('Please choose an audio file first.')
      return
    }
    try {
      setAudioForm(prev => ({ ...prev, processStep: 'whisper' }))
      setMessage('Step 1/3: Whisper word-level transcription is running...')
      const form = new FormData()
      form.append('file', file)
      form.append('model', 'whisper-1')
      form.append('response_format', 'verbose_json')
      form.append('timestamp_granularities[]', 'word')
      const headers = settings.apiKey ? { 'x-openai-key': settings.apiKey } : {}
      const response = await fetch('/api/openai-transcribe', {
        method: 'POST',
        headers,
        body: form
      })
      if (!response.ok) throw new Error(await response.text())
      const json = await response.json()
      const words = Array.isArray(json.words) ? json.words : []
      if (!words.length) throw new Error('Whisper did not return word-level timestamps.')
      setAudioForm(prev => ({ ...prev, processStep: 'gpt' }))
      setMessage('Step 2/3: GPT is cleaning punctuation and natural sentence breaks...')
      const rawText = words.map(word => word.word || '').join(' ').replace(/\s+/g, ' ').trim()
      const cleanResponse = await fetch('/api/openai-clean-subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.apiKey ? { 'x-openai-key': settings.apiKey } : {})
        },
        body: JSON.stringify({ text: rawText })
      })
      if (!cleanResponse.ok) throw new Error(await cleanResponse.text())
      const cleanJson = await cleanResponse.json()
      const sentences = Array.isArray(cleanJson.sentences) && cleanJson.sentences.length
        ? cleanJson.sentences
        : whisperToTranscriptLines(json).map(line => line.en)
      setAudioForm(prev => ({ ...prev, processStep: 'align' }))
      setMessage('Step 3/3: Matching GPT sentences back to Whisper word timestamps...')
      const lines = alignCleanSentencesToWords(sentences, words)
      setAudioForm(prev => ({ ...prev, transcript: transcriptToText(lines) }))
      const unaligned = lines.filter(line => !line.aligned).length
      setAudioForm(prev => ({ ...prev, processStep: 'done' }))
      setMessage(`Smart Process finished: ${lines.length} clean subtitle lines, ${unaligned} need manual check.`)
    } catch (error) {
      setAudioForm(prev => ({ ...prev, processStep: 'error' }))
      setMessage(`Whisper failed: ${error?.message || error}`)
    }
  }

  function importTextPack() {
    if (!textPreview) return
    if (textPreview.kind === 'bundle') {
      addCourses(textPreview.courses)
      setMessage(`${textPreview.courses.length} demo courses imported. Textbook Course keeps Original Audio Mode; Expansion and General packs use Generated Audio Mode.`)
    } else {
      addCourse(textPreview)
      setMessage('Text Pack imported. Open Learn to start.')
    }
    setTextPack('')
    setLibraryMode('list')
    setTab('learn')
  }

  async function importAudioCourse() {
    const title = audioForm.title.trim() || audioForm.fileName || 'Textbook Audio Course'
    const lines = parseManualTranscript(audioForm.transcript)
    if (!audioFileRef.current) {
      setMessage('Please upload the original textbook audio before saving.')
      return
    }
    if (!lines.length) {
      setMessage('Please run Smart Process or paste transcript lines before saving.')
      return
    }
    const courseId = uid('audio_course')
    const courseGenerated = buildTrainingFromTranscript(courseId, title, lines)
    let uploadedAudioUrl = ''
    if (audioFileRef.current) {
      try {
        uploadedAudioUrl = await putOriginalAudioBlob(courseId, audioFileRef.current)
      } catch (error) {
        setMessage(`Audio save failed: ${error?.message || error}`)
        return
      }
    }
    const course = {
      id: courseId,
      title,
      sourceType: 'textbookCourse',
      audioMode: 'original',
      importMethod: 'audioImport',
      category: audioForm.category || 'Textbook',
      level: audioForm.level || 'A2',
      audioType: courseGenerated.audioType,
      linkedCourseId: '',
      status: countUnaligned(lines) ? 'Need Check' : 'Ready',
      progress: 0,
      goal: 'Listen, shadow, extract useful language, and practice around this textbook audio.',
      background: { en: 'Original textbook audio imported by Kevin.', cn: 'Kevin 导入的教材原音频。' },
      uploadedAudioUrl,
      generatedTtsAudioUrl: null,
      transcriptLines: lines,
      languageItems: courseGenerated.languageItems,
      practiceItems: courseGenerated.practiceItems,
      outputTasks: courseGenerated.outputTasks,
      reviewItems: courseGenerated.reviewItems,
      stage6Prompt: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    addCourse(course)
    if (audioForm.audioPreviewUrl) URL.revokeObjectURL(audioForm.audioPreviewUrl)
    setAudioForm({ title: '', category: 'Textbook', level: 'A2', transcript: '', audioPreviewUrl: '', fileName: '', processingDepth: 'full', processStep: 'idle' })
    audioFileRef.current = null
    setLibraryMode('list')
    setMessage(`Audio course imported with ${courseGenerated.languageItems.length} language items, ${courseGenerated.practiceItems.length} practice items, and ${countUnaligned(lines)} unaligned lines.`)
    setTab('learn')
  }

  function onAudioFile(file) {
    if (!file) return
    audioFileRef.current = file
    setAudioForm(prev => {
      if (prev.audioPreviewUrl) URL.revokeObjectURL(prev.audioPreviewUrl)
      return { ...prev, audioPreviewUrl: URL.createObjectURL(file), fileName: file.name, title: prev.title || file.name.replace(/\.[^.]+$/, ''), processStep: 'ready' }
    })
  }

  function markReview(item, rating) {
    const updateReviewItem = row => {
      const level = rating === 'good' ? (row.level || 0) + 1 : 0
      const days = rating === 'good' ? reviewInterval(level) : 1
      return { ...row, level, status: rating === 'good' ? 'learning' : 'weak', nextReviewAt: Date.now() + days * 86400000 }
    }
    updateStore(prev => ({
      ...prev,
      courses: prev.courses.map(course => course.id !== item.courseId
        ? course
        : { ...course, reviewItems: (course.reviewItems || []).map(row => row.id === item.id ? updateReviewItem(row) : row) }),
      reviewQueue: prev.reviewQueue.map(row => row.id === item.id ? updateReviewItem(row) : row)
    }))
    recordStudy('review', { courseId: item.courseId, activityKind: 'review', minProgress: 90 })
    setAnswerShown(false)
    setActiveIndex(i => Math.max(0, Math.min(i, reviewPool.length - 1)))
  }

  function upsertWeakReviewItem(reviewItem) {
    if (!activeCourse || !reviewItem.answerEn) return
    updateActiveCourse(course => {
      const reviewItems = course.reviewItems || []
      const existing = reviewItems.find(item =>
        reviewBucketLabel(item) === 'Weak / Stuck' &&
        String(item.answerEn || '').trim().toLowerCase() === String(reviewItem.answerEn || '').trim().toLowerCase()
      )
      const nextItem = {
        ...reviewItem,
        id: existing?.id || uid('weak'),
        courseId: course.id,
        type: 'weak_sentence',
        level: 0,
        nextReviewAt: Date.now()
      }
      return {
        ...course,
        reviewItems: existing
          ? reviewItems.map(item => item.id === existing.id ? { ...item, ...nextItem } : item)
          : [...reviewItems, nextItem]
      }
    })
  }

  function markPracticeWeak(item, status = 'weak') {
    const answerEn = item.answerEn || item.base || ''
    if (!answerEn) return
    upsertWeakReviewItem({
      promptCn: item.promptCn || item.base || 'Practice this again.',
      answerEn,
      source: 'Practice',
      status
    })
    recordStudy('practice', { activityKind: 'weak', minProgress: 55 })
    setMessage(t(status === 'stuck' ? 'addedStuck' : 'addedWeak'))
  }

  function checkPracticeAnswer(item) {
    setAnswerShown(true)
    if (practiceMode !== 'typing') return
    const expected = String(item.answerEn || '').trim().toLowerCase()
    const actual = typed.trim().toLowerCase()
    if (!actual || actual === expected) {
      setMessage(actual ? t('typingCorrect') : '')
      return
    }
    markPracticeWeak(item, 'weak')
    setMessage(t('typingWrongAdded'))
  }

  function markOutputStuck(item) {
    let promptCn = item.prompt || item.scenario || t('weakStuck')
    let answerEn = item.sample || ''
    if (item.type === 'rolePlay') {
      promptCn = item.scenario || t('rolePlay')
      answerEn = (item.lines || []).map(line => `${line.speaker ? `${line.speaker}: ` : ''}${line.en}`).join(' / ')
    }
    if (!answerEn) answerEn = promptCn
    upsertWeakReviewItem({
      promptCn,
      answerEn,
      source: 'Output',
      status: 'stuck'
    })
    recordStudy('output', { activityKind: 'weak', minProgress: 80 })
    setMessage(t('addedStuck'))
  }

  function nextPracticeItem() {
    recordStudy('practice', { activityKind: 'practice', minProgress: 55 })
    setActiveIndex((activeIndex + 1) % practicePool.length)
    setTyped('')
    setAnswerShown(false)
  }

  function nextOutputItem() {
    recordStudy('output', { activityKind: 'output', minProgress: 80 })
    setActiveIndex((activeIndex + 1) % outputPool.length)
  }

  function exportCurrentUserData() {
    const activeProfile = userProfiles.find(user => user.id === activeUserId)
    const payload = {
      app: 'Kevin English Learning System',
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      user: { id: activeUserId, name: activeProfile?.name || activeUserId },
      store
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kevin-english-${activeUserId}-${localDayKey()}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setMessage(t('exportReady'))
  }

  function importCurrentUserData(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || '{}'))
        const importedStore = payload.store || payload
        setStore(normalizeStore(importedStore))
        setActiveIndex(0)
        setAnswerShown(false)
        setTyped('')
        setMessage(t('importDone'))
      } catch {
        setMessage(t('importFailed'))
      } finally {
        if (backupFileRef.current) backupFileRef.current.value = ''
      }
    }
    reader.onerror = () => setMessage(t('importFailed'))
    reader.readAsText(file)
  }

  function displayLine(line) {
    if (settings.displayMode === 'en') return <span>{line.en}</span>
    if (settings.displayMode === 'cn') return <span>{line.cn || line.en}</span>
    if (settings.displayMode === 'hide') return <span className="hiddenText">{line.cn || 'Hidden English'}</span>
    return <>
      <span>{line.en}</span>
      {line.cn && <small>{line.cn}</small>}
    </>
  }

  function sentenceDisplayNumber(index) {
    return String(index + 1).padStart(2, '0')
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function waitForAudio(audio, endTime = null) {
    return new Promise(resolve => {
      let done = false
      const finish = () => {
        if (done) return
        done = true
        audio.ontimeupdate = null
        audio.onended = null
        resolve()
      }
      if (typeof endTime === 'number') {
        audio.ontimeupdate = () => {
          if (audio.currentTime >= endTime) {
            audio.pause()
            finish()
          }
        }
      }
      audio.onended = finish
    })
  }

  async function playUrlAndWait(url, startTime = null, endTime = null) {
    if (!url) return
    stopAudio()
    const audio = new Audio(url)
    audioRef.current = audio
    if (typeof startTime === 'number') audio.currentTime = startTime
    const waiting = waitForAudio(audio, endTime)
    await audio.play()
    await waiting
  }

  async function playLineRepeated(line, repeatCount = settings.lineRepeatCount || 1) {
    const count = Math.max(1, Number(repeatCount) || 1)
    const pause = settings.pauseSeconds === 'manual' ? 0 : (Number(settings.pauseSeconds) || 2) * 1000
    try {
      if (activeCourse.audioMode === 'original' && !activeCourse.uploadedAudioUrl) {
        setMessage('Original audio is required for this textbook course. Upload the textbook audio in Audio Import; the app will not replace it with TTS.')
        return
      }
      for (let index = 0; index < count; index += 1) {
        if (activeCourse.audioMode === 'original' && activeCourse.uploadedAudioUrl && typeof line.startTime === 'number') {
          await playUrlAndWait(await resolveOriginalAudioUrl(activeCourse.uploadedAudioUrl), line.startTime, line.endTime)
        } else if (activeCourse.audioMode === 'original' && activeCourse.uploadedAudioUrl) {
          await playUrlAndWait(await resolveOriginalAudioUrl(activeCourse.uploadedAudioUrl))
        } else {
          await playUrlAndWait(await getTtsUrl(line.en, line.speaker))
        }
        if (pause && index < count - 1) await wait(pause)
      }
      recordStudy('learn', { minProgress: 20 })
    } catch (error) {
      setMessage(error?.message || 'Audio playback failed.')
    }
  }

  function buildUnderstandUnits(line) {
    const en = String(line?.en || '').trim()
    const cn = String(line?.cn || '').trim()
    if (!en) return { units: [], keywords: [], chunks: [] }
    const roughUnits = en
      .replace(/\s+(and|but|because|so|when|if|that)\s+/gi, ' | $1 ')
      .split(/\s*[,.!?;:]\s*|\s+\|\s+/)
      .map(part => part.trim())
      .filter(Boolean)
    const units = (roughUnits.length > 1 ? roughUnits : en.split(/\s+(?=(?:and|but|because|when|if)\b)/i))
      .map((part, index) => ({ id: `${line.id}_unit_${index}`, en: part.trim(), cn: index === 0 ? cn : '' }))
      .filter(item => item.en)
    const words = en
      .toLowerCase()
      .replace(/[^\w\s'-]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 4 && !['there', 'their', 'about', 'because', 'people', 'really'].includes(word))
    const keywords = [...new Set(words)].slice(0, 5).map((word, index) => ({ id: `${line.id}_kw_${index}`, en: word, cn: '' }))
    const chunkMatches = [
      /people from all over the world/i,
      /for me/i,
      /one thing i really like/i,
      /i(?:’|'|)d like to [\w\s]+/i,
      /i have a [\w\s]+/i,
      /do you like [\w\s]+/i
    ]
    const chunks = chunkMatches
      .map(pattern => en.match(pattern)?.[0])
      .filter(Boolean)
      .map((chunk, index) => ({ id: `${line.id}_chunk_${index}`, en: chunk, cn: '' }))
    return { units, keywords, chunks }
  }

  function addLanguageToPractice(item) {
    if (!activeCourse) return
    const nextItem = {
      id: uid('quick'),
      type: 'quickResponse',
      promptCn: item.cn || `Use: ${item.en}`,
      hint: languageTypeLabel(item.type),
      answerEn: item.en
    }
    updateActiveCourse(course => ({
      ...course,
      practiceItems: [...(course.practiceItems || []), nextItem]
    }))
    setMessage(`${item.en} added to Practice.`)
  }

  function addTextToReview(payload) {
    if (!activeCourse || !payload?.en) return
    const answerEn = String(payload.en || '').trim()
    const promptCn = String(payload.cn || payload.promptCn || 'Recall this expression').trim()
    updateActiveCourse(course => {
      const reviewItems = course.reviewItems || []
      const existing = reviewItems.find(item =>
        String(item.answerEn || '').trim().toLowerCase() === answerEn.toLowerCase()
      )
      const nextItem = {
        ...(existing || {}),
        id: existing?.id || uid('review'),
        courseId: course.id,
        type: payload.type || existing?.type || 'usefulSentence',
        promptCn,
        answerEn,
        source: payload.source || existing?.source || 'Saved',
        nextReviewAt: Date.now(),
        level: existing?.level || 0,
        status: existing?.status || 'new'
      }
      return {
        ...course,
        reviewItems: existing
          ? reviewItems.map(item => item.id === existing.id ? nextItem : item)
          : [...reviewItems, nextItem]
      }
    })
    setMessage(t('savedReview'))
  }

  function addLanguageToReview(item) {
    addTextToReview({
      en: item.en,
      cn: item.cn,
      type: item.type,
      source: 'Language Preview'
    })
  }

  function renderLanguageItem(item) {
    const isPattern = item.type === 'pattern'
    const examples = isPattern ? (item.autoSentences || []) : (item.examples || [])
    return <article className="expressionCard" key={item.id}>
      <div className="expressionMeta">
        <span className={`typePill ${item.type}`}>{languageGroupLabel(item.type)}</span>
        {item.cn && <small>{item.cn}</small>}
      </div>
      <button className="expressionMain" onClick={() => playText(item.en)}>
        <span className="playDot" aria-hidden="true"></span>
        <strong>{item.en}</strong>
      </button>
      <div className="miniActionRow">
        <button className="iconButton" onClick={() => addLanguageToPractice(item)}>{t('addPractice')}</button>
        <button className="iconButton starButton" title={t('addReview')} onClick={() => addLanguageToReview(item)}>⭐</button>
      </div>
      {item.note && <p className="expressionNote">{item.note}</p>}
      {examples.length > 0 && <div className="exampleList">
        <h4>{isPattern ? t('automationExamples') : t('examples')}</h4>
        {examples.map((example, index) => <div className="exampleRow" key={`${example.en}-${index}`}>
          <button className="exampleText" onClick={() => playText(example.en)}>
            <span className="miniPlayDot" aria-hidden="true"></span>
            <span>{example.en}</span>
            {example.cn && <small>{example.cn}</small>}
          </button>
          <div className="exampleActions">
            <em>{example.origin === 'original' ? t('originalLine') : t('dailyLine')}</em>
            <button title={t('saveReview')} onClick={() => addTextToReview({ en: example.en, cn: example.cn, type: item.type, source: example.origin === 'original' ? 'Original Example' : 'Daily Example' })}>⭐</button>
          </div>
        </div>)}
      </div>}
    </article>
  }

  const sourceLabel = sourceType => t(`source.${sourceType}`)
  const audioLabel = audioMode => t(`audio.${audioMode}`)
  const listenLabel = course => course?.sourceType === 'textbookCourse' ? t('listen.textbook') : t('listen.generated')
  const languageGroupLabel = type => {
    if (type === 'keyword') return uiLanguage === 'zh' ? '关键词汇' : 'Keywords'
    if (type === 'chunk') return t('chunks')
    if (type === 'pattern') return uiLanguage === 'zh' ? '核心句型' : 'Patterns'
    return t('usefulSentences')
  }
  const reviewLabel = label => {
    if (label === 'Chunks') return t('chunks')
    if (label === 'Useful Sentences') return t('usefulSentences')
    if (label === 'Weak / Stuck') return t('weakStuck')
    return t('todayReview')
  }
  const stageLabel = stage => t(`stage.${stage || 'learn'}`)
  const resumeStage = activeCourse?.lastStage || 'learn'

  const currentPractice = practicePool[activeIndex] || practicePool[0]
  const currentOutput = outputPool[activeIndex] || outputPool[0]
  const currentReview = reviewPool[activeIndex] || reviewPool[0]
  const currentAudioLineIndex = activeCourse?.transcriptLines?.length ? Math.min(activeIndex, activeCourse.transcriptLines.length - 1) : 0
  const currentAudioLine = activeCourse?.transcriptLines?.[currentAudioLineIndex] || activeCourse?.transcriptLines?.[0] || null
  const understandLine = activeCourse?.transcriptLines?.find(line => line.id === understandLineId) || currentAudioLine
  const understandData = understandLineId ? buildUnderstandUnits(understandLine) : null

  return <div className={`appShell font-${settings.fontScale}`}>
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">K</div>
        <div>
          <strong>Kevin English</strong>
          <span>MacBook + iPhone PWA</span>
        </div>
      </div>
      <div className="accountSwitcher" aria-label={t('account')}>
        <span>{t('account')}</span>
        <div>
          {userProfiles.map(user => <button key={user.id} className={activeUserId === user.id ? 'active' : ''} onClick={() => switchUser(user.id)}>{user.name}</button>)}
        </div>
      </div>
      <nav className="sideNav">
        {NAV_ITEMS.map(item => <button key={item.id} className={`${tab === item.id ? 'active' : ''} ${item.hideOnMobile ? 'mobileHiddenNav' : ''}`} onClick={() => { stopAudio(); setTab(item.id); setLibraryMode('list'); if (item.id === 'library') setLibrarySubtab('courses'); setAnswerShown(false); setTyped('') }}>
          <span>{t(`nav.${item.id}`)}</span>
          <small>{t(`navHint.${item.id}`)}</small>
        </button>)}
      </nav>
      {activeCourse && <div className="currentCourseMini">
        <span>{t('currentCourse')}</span>
        <strong>{activeCourse.title}</strong>
        <small>{sourceLabel(activeCourse.sourceType)} · {audioLabel(activeCourse.audioMode)}</small>
        <em>V{APP_VERSION}</em>
      </div>}
    </aside>

    <main className="mainArea">
      <header className="topBar">
        <div>
          <span className="eyebrow">{tab === 'library' ? t('libraryImport') : activeCourse ? activeCourse.category : 'English Learning System'}</span>
          <h1>{t(`title.${tab}`)}</h1>
        </div>
        <button className="settingsButton" onClick={() => setSettingsOpen(true)}>{t('settings')}</button>
      </header>

      {message && <div className="messageBar">{message}</div>}

      {tab === 'today' && <section className="pageGrid">
        <div className="heroPanel">
          <span>{t('continueLearning')}</span>
          <h2>{activeCourse?.title || t('chooseCourse')}</h2>
          <p>{activeCourse?.goal || t('firstCourseHint')}</p>
          {activeCourse && <div className="resumeMeta">
            <span>{activeCourse.lastStudiedAt ? t('lastStudied', { stage: stageLabel(resumeStage), date: shortDateLabel(activeCourse.lastStudiedAt) }) : t('notStartedYet')}</span>
          </div>}
          <div className="actionRow">
            <button className="primary" onClick={() => openCourseStage(activeCourse.id, resumeStage)} disabled={!activeCourse}>{t('resumeStage', { stage: stageLabel(resumeStage) })}</button>
            <button className="secondary" onClick={() => setTab('library')}>{t('openLibrary')}</button>
          </div>
        </div>
        <div className="summaryGrid">
          <div><strong>{store.courses.length}</strong><span>{t('courses')}</span></div>
          <div><strong>{dueReview.length}</strong><span>{t('dueReview')}</span></div>
          <div><strong>{normalizeActivity(store.activity).streakDays}</strong><span>{t('studyStreak')} · {t('days')}</span></div>
        </div>
        <div className="activityStrip">
          <span>{t('todayDone')}</span>
          <strong>{todayActivity.practice}</strong><em>{t('practiceDone')}</em>
          <strong>{todayActivity.output}</strong><em>{t('outputDone')}</em>
          <strong>{todayActivity.review}</strong><em>{t('reviewDone')}</em>
        </div>
        <div className="todayGrid">
          <article>
            <span>{t('todayPractice')}</span>
            <strong>{todayPractice[0]?.promptCn || todayPractice[0]?.base || t('quickResponse')}</strong>
            <p>{todayPractice.length ? t('practiceSuggested', { count: todayPractice.length }) : t('noPracticeQueued')}</p>
            <button className="secondary compact" onClick={() => setTab('practice')}>{t('startPractice')}</button>
          </article>
          <article>
            <span>{t('todayReview')}</span>
            <strong>{weakReview[0]?.promptCn || dueReview[0]?.promptCn || t('reviewMemory')}</strong>
            <p>{weakReview.length ? t('weakPriority', { count: weakReview.length }) : t('reviewReady', { count: dueReview.length })}</p>
            <button className="secondary compact" onClick={() => { setReviewMode(weakReview.length ? 'weak' : 'today'); setTab('review') }}>{t('startReview')}</button>
          </article>
          <article>
            <span>{t('libraryImport')}</span>
            <strong>{t('manageContent')}</strong>
            <p>{t('manageContentHint')}</p>
            <button className="secondary compact" onClick={() => { setTab('library'); setLibraryMode('list'); setLibrarySubtab('courses') }}>{t('openLibrary')}</button>
          </article>
        </div>
        <div className="courseStrip">
          {recentCourses.map(course => <button key={course.id} onClick={() => selectCourse(course.id)}>
            <strong>{course.title}</strong>
            <small>{sourceLabel(course.sourceType)} · {audioLabel(course.audioMode)}</small>
          </button>)}
        </div>
      </section>}

      {tab === 'library' && <section>
        {libraryMode === 'list' && <>
          <div className="libraryHeader">
            <div>
              <h2>{t('courseLibrary')}</h2>
              <p>{t('courseLibraryHint')}</p>
            </div>
            <button className="primary compact" onClick={() => setLibrarySubtab('import')}>{t('addContent')}</button>
          </div>
          <div className="subTabs">
            <button className={librarySubtab === 'courses' ? 'active' : ''} onClick={() => setLibrarySubtab('courses')}>{t('courses')}</button>
            <button className={librarySubtab === 'import' ? 'active' : ''} onClick={() => setLibrarySubtab('import')}>{t('import')}</button>
          </div>
          {librarySubtab === 'courses' && <div className="libraryGroups">
            {courseGroups.map(group => <section className="libraryGroup" key={group.id}>
              <div className="groupHeader">
                <h3>{group.id === 'textbookCourse' ? (uiLanguage === 'zh' ? '教材课程' : 'Textbook Courses') : group.id === 'realLifeExpansion' ? (uiLanguage === 'zh' ? '拓展训练包' : 'Expansion Packs') : (uiLanguage === 'zh' ? '自由主题包' : 'General Topic Packs')}</h3>
                <span>{group.courses.length}</span>
              </div>
              <div className="courseList">
                {group.courses.map(course => <CourseCard
                  key={course.id}
                  course={course}
                  linkedTitle={course.linkedCourseTitle || store.courses.find(row => row.id === course.linkedCourseId)?.title || ''}
                  onLearn={() => selectCourse(course.id, 'learn')}
                  onPractice={() => selectCourse(course.id, 'practice')}
                  t={t}
                  sourceLabel={sourceLabel}
                  audioLabel={audioLabel}
                  listenLabel={listenLabel}
                />)}
              </div>
            </section>)}
          </div>}
          {librarySubtab === 'import' && <div className="importChoice">
            <button onClick={() => setLibraryMode('audioImport')}>
              <strong>{t('audioImport')}</strong>
              <span>{t('audioImportHint')}</span>
            </button>
            <button onClick={() => setLibraryMode('textImport')}>
              <strong>{t('textPackImport')}</strong>
              <span>{t('textPackImportHint')}</span>
            </button>
          </div>}
        </>}
        {libraryMode === 'import' && <div className="importChoice">
          <button onClick={() => setLibraryMode('audioImport')}>
            <strong>{t('audioImport')}</strong>
            <span>{t('audioImportHint')}</span>
          </button>
          <button onClick={() => setLibraryMode('textImport')}>
            <strong>{t('textPackImport')}</strong>
            <span>{t('textPackImportHint')}</span>
          </button>
          <button className="secondary" onClick={() => setLibraryMode('list')}>{t('back')}</button>
        </div>}
        {libraryMode === 'audioImport' && <div className="importPanel">
          <div className="topActions"><button className="secondary compact" onClick={() => { setLibraryMode('list'); setLibrarySubtab('import') }}>{t('back')}</button><span>{t('textbookAudioMode')}</span></div>
          <div className="modeNotice">
            <strong>{t('audioImportNoticeTitle')}</strong>
            <p>{t('audioImportNoticeBody')}</p>
          </div>
          <div className="formGrid">
            <label>{t('courseTitle')}<input value={audioForm.title} onChange={e => setAudioForm({ ...audioForm, title: e.target.value })} /></label>
            <label>{t('category')}<input value={audioForm.category} onChange={e => setAudioForm({ ...audioForm, category: e.target.value })} /></label>
            <label>{t('level')}<select value={audioForm.level} onChange={e => setAudioForm({ ...audioForm, level: e.target.value })}>{['A1', 'A2', 'A2+', 'B1', 'B1+', 'B2'].map(level => <option key={level}>{level}</option>)}</select></label>
          </div>
          <label className="fileDrop">{t('uploadTextbookAudio')}<input type="file" accept="audio/*" onChange={e => onAudioFile(e.target.files?.[0])} /></label>
          {audioForm.fileName && <div className="messageBar">{t('selectedAudio', { name: audioForm.fileName })}</div>}
          <div className="actionRow">
            <button className="secondary" disabled={!audioFileRef.current} onClick={transcribeAudioWithWhisper}>{t('smartProcess')}</button>
            <button className="secondary" disabled={!audioForm.transcript.trim()} onClick={() => setMessage(t('previewReady', { count: parseManualTranscript(audioForm.transcript).length }))}>{t('previewTranscript')}</button>
          </div>
          <div className="smartProcess">
            {[
              ['ready', 'Audio ready'],
              ['whisper', '1 Whisper words'],
              ['gpt', '2 GPT clean sentences'],
              ['align', '3 Align timestamps'],
              ['done', 'Ready to save']
            ].map(([id, label]) => <span key={id} className={audioForm.processStep === id ? 'active' : ''}>{label}</span>)}
          </div>
          <label>{t('transcriptLines')}<textarea value={audioForm.transcript} onChange={e => setAudioForm({ ...audioForm, transcript: e.target.value })} placeholder="[00:01.20-00:03.40] Staff: Hi. How are you? = 你好，今天怎么样？&#10;[00:03.50-00:05.10] Kevin: Good, thanks. = 挺好的，谢谢。&#10;&#10;If there is no timestamp, the app still creates Learn / Practice / Output / Review." /></label>
          {audioForm.transcript.trim() && <div className="previewBox">
            <strong>{parseManualTranscript(audioForm.transcript).length} subtitle lines detected</strong>
            <span>{countUnaligned(parseManualTranscript(audioForm.transcript))} unaligned lines. Save Audio Course will generate Language, Quick Response, Typing, Role-play/Retell, and Review items.</span>
          </div>}
          <div className="processSteps">
            <span>1 Upload original audio</span>
            <span>2 Whisper or paste transcript</span>
            <span>3 Generate training content</span>
            <span>4 Edit timestamps if needed</span>
          </div>
          <button className="primary" disabled={!audioFileRef.current || !audioForm.transcript.trim()} onClick={importAudioCourse}>{t('saveAudioCourse')}</button>
        </div>}
        {libraryMode === 'textImport' && <div className="importPanel">
          <div className="topActions"><button className="secondary compact" onClick={() => { setLibraryMode('list'); setLibrarySubtab('import') }}>{t('back')}</button><span>{t('textPackDemoImport')}</span></div>
          <textarea value={textPack} onChange={e => setTextPack(e.target.value)} placeholder={t('textPackPlaceholder')} />
          {textPreview && <ImportPreview preview={textPreview} t={t} sourceLabel={sourceLabel} audioLabel={audioLabel} />}
          <button className="primary" disabled={!textPreview} onClick={importTextPack}>{textPreview?.kind === 'bundle' ? t('importDemoPack') : t('importTextPack')}</button>
        </div>}
      </section>}

      {tab === 'learn' && activeCourse && <section>
        <CourseHeader course={activeCourse} t={t} sourceLabel={sourceLabel} audioLabel={audioLabel} />
        <div className="subTabs">
          {['audio', 'notes', 'language', 'editor'].map(id => <button key={id} className={learnSubtab === id ? 'active' : ''} onClick={() => setLearnSubtab(id)}>{id === 'audio' ? t('listen') : id === 'language' ? t('languagePreview') : id === 'editor' ? t('lineEditor') : t('background')}</button>)}
        </div>
        {learnSubtab === 'audio' && <div className="learnPlayer">
          <div className="playerCard">
            <button className="playCircle" onClick={() => playCourseMain(activeCourse)}>{t('play')}</button>
            <div>
              <h2>{listenLabel(activeCourse)}</h2>
              <p>{activeCourse.title} · {listenLabel(activeCourse)} · {audioLabel(activeCourse.audioMode)} · {activeCourse.level}</p>
              {activeCourse.linkedCourseTitle && <small>{t('linkedTo', { title: activeCourse.linkedCourseTitle })}</small>}
            </div>
            <button className="secondary compact" onClick={() => playCourseTranscript(activeCourse)}>{t('listenAll')}</button>
          </div>
          {currentAudioLine && <div className="listenToolPanel">
            <div>
              <span>{t('currentLine')} {sentenceDisplayNumber(currentAudioLineIndex)}</span>
              <strong>{currentAudioLine.en}</strong>
              {currentAudioLine.cn && <small>{currentAudioLine.cn}</small>}
            </div>
            <div className="listenToolControls">
              <button className="secondary compact" onClick={() => setUnderstandLineId(currentAudioLine.id)}>{t('understand')}</button>
              <span>{t('repeatCount')}</span>
              {[1, 3, 5].map(count => <button key={count} className={settings.lineRepeatCount === count ? 'active' : ''} onClick={() => setSettings({ ...settings, lineRepeatCount: count })}>{count}x</button>)}
              <span>{t('pauseControl')}</span>
              {[1, 2, 3, 5].map(seconds => <button key={seconds} className={Number(settings.pauseSeconds) === seconds ? 'active' : ''} onClick={() => setSettings({ ...settings, pauseSeconds: seconds })}>{seconds}s</button>)}
              <button className={settings.pauseSeconds === 'manual' ? 'active' : ''} onClick={() => setSettings({ ...settings, pauseSeconds: 'manual' })}>{t('manualPause')}</button>
              <button className="primary compact" onClick={() => playLineRepeated(currentAudioLine)}>{t('playLine')}</button>
            </div>
          </div>}
          {understandData && <div className="understandPanel">
            <div className="topActions">
              <div>
                <h2>{t('understand')}</h2>
                <p>{t('clickToPlay')}</p>
              </div>
              <button className="secondary compact" onClick={() => setUnderstandLineId('')}>{t('close')}</button>
            </div>
            <div className="understandGrid">
              <section>
                <h3>{t('meaningUnits')}</h3>
                {understandData.units.map(unit => <button key={unit.id} onClick={() => playText(unit.en)}><strong>{unit.en}</strong>{unit.cn && <small>{unit.cn}</small>}</button>)}
              </section>
              <section>
                <h3>{languageGroupLabel('keyword')}</h3>
                {understandData.keywords.map(item => <button key={item.id} onClick={() => playText(item.en)}>{item.en}</button>)}
              </section>
              <section>
                <h3>{t('chunks')}</h3>
                {understandData.chunks.length ? understandData.chunks.map(item => <button key={item.id} onClick={() => playText(item.en)}>{item.en}</button>) : <small>{t('noLanguageItems')}</small>}
              </section>
            </div>
          </div>}
          <DisplaySwitch settings={settings} setSettings={setSettings} />
          <div className="sentenceList">
            {activeCourse.transcriptLines.map((line, index) => <React.Fragment key={line.id}>
              <div className={`sentenceRow ${line.aligned ? '' : 'needCheck'} ${currentAudioLine?.id === line.id ? 'activeLine' : ''}`}>
                <span className="lineNumber">{sentenceDisplayNumber(index)}</span>
                <button className="sentenceText sentencePlay" onClick={() => { setActiveIndex(index); playLine(line) }}>{displayLine(line)}</button>
                <div className="lineActions">
                  {!line.aligned && <em>{t('unaligned')}</em>}
                  <button className="starButton" title={t('saveReview')} aria-label={t('saveReview')} onClick={() => addTextToReview({ en: line.en, cn: line.cn, type: 'usefulSentence', source: 'Transcript' })}>⭐</button>
                  <button title={t('lineMore')} aria-label={t('lineMore')} onClick={() => { setActiveIndex(index); setEditingLineId(line.id); setLineMoreId(lineMoreId === line.id ? '' : line.id) }}>🔧</button>
                </div>
              </div>
              {lineMoreId === line.id && <div className="lineMorePanel">
                <div className="topActions">
                  <div>
                    <span>{t('lineMore')}</span>
                    <h2>{line.en}</h2>
                  </div>
                  <button className="secondary compact" onClick={() => setLineMoreId('')}>{t('close')}</button>
                </div>
                <section className="controlSection">
                  <h3>{t('timing')}</h3>
                  <div className="timingGrid">
                    <div className="timingBox">
                      <span>{t('start')}</span>
                      <input value={line.startTime ?? ''} onChange={e => updateCourseLine(line.id, 'startTime', e.target.value)} placeholder="00:00" />
                      <div>
                        <button onClick={() => adjustCourseLineTime(line.id, 'startTime', -0.1)}>-100ms</button>
                        <button onClick={() => adjustCourseLineTime(line.id, 'startTime', 0.1)}>+100ms</button>
                      </div>
                    </div>
                    <div className="timingBox">
                      <span>{t('end')}</span>
                      <input value={line.endTime ?? ''} onChange={e => updateCourseLine(line.id, 'endTime', e.target.value)} placeholder="00:00" />
                      <div>
                        <button onClick={() => adjustCourseLineTime(line.id, 'endTime', -0.1)}>-100ms</button>
                        <button onClick={() => adjustCourseLineTime(line.id, 'endTime', 0.1)}>+100ms</button>
                      </div>
                    </div>
                  </div>
                  <div className="controlActionGrid">
                    <button className="primary" onClick={() => playLineRepeated(line)}>{t('playLine')}</button>
                    <button className="secondary" onClick={() => setMessage(t('timingSaved'))}>{t('saveTiming')}</button>
                  </div>
                </section>
                <section className="controlSection">
                  <h3>{t('structure')}</h3>
                  <div className="structureGrid">
                    <button onClick={() => setSplitLineId(splitLineId === line.id ? '' : line.id)}><strong>{t('splitHere')}</strong><small>{t('splitHint')}</small></button>
                    <button onClick={() => mergeTranscriptLineWithNext(line.id)}><strong>{t('mergeNext')}</strong><small>{activeCourse.transcriptLines[index + 1]?.en || ''}</small></button>
                  </div>
                  {splitLineId === line.id && <div className="splitWordPicker">
                    <p>{t('splitHint')}:</p>
                    <div>{String(line.en || '').trim().split(/\s+/).filter(Boolean).map((word, wordIndex, words) => <button key={`${word}-${wordIndex}`} disabled={wordIndex >= words.length - 1} onClick={() => splitTranscriptLineAtWord(line.id, wordIndex)}>{word}</button>)}</div>
                  </div>}
                </section>
                <section className="controlSection">
                  <h3>{t('text')}</h3>
                  <div className="editorTextGrid">
                    <label>{t('english')}<textarea value={line.en || ''} onChange={e => updateCourseLine(line.id, 'en', e.target.value)} /></label>
                    <label>{t('chinese')}<textarea value={line.cn || ''} onChange={e => updateCourseLine(line.id, 'cn', e.target.value)} /></label>
                  </div>
                </section>
                <section className="controlSection dangerSection">
                  <button className="secondary" onClick={() => setSettings({ ...settings, displayMode: 'cn' })}>{t('cnOnly')}</button>
                  <button className="secondary" onClick={() => setMessage(t('resetOriginalUnavailable'))}>{t('resetOriginal')}</button>
                  <button className="secondary weakAction" onClick={() => deleteTranscriptLine(line.id)}>{t('delete')}</button>
                </section>
              </div>}
            </React.Fragment>)}
          </div>
        </div>}
        {learnSubtab === 'language' && <div className="languagePreview">
          {activeCourse.languageItems.length ? groupLanguageItems(activeCourse.languageItems).map(group => group.items.length ? <section className="languageGroup" key={group.type}>
            <div className="groupHeader">
              <h3>{languageGroupLabel(group.type)}</h3>
              <span>{group.items.length}</span>
            </div>
            <div className="expressionGrid">{group.items.map(renderLanguageItem)}</div>
          </section> : null) : <Empty text={t('noLanguageItems')} />}
        </div>}
        {learnSubtab === 'editor' && <div className="lineEditorPanel">
          <div className="topActions">
            <div>
              <h2>{t('lineEditorTitle')}</h2>
              <p>{t('lineEditorHint')}</p>
            </div>
            <button className="secondary compact" onClick={addTranscriptLine}>{t('addLine')}</button>
          </div>
          {selectedEditorLine && <div className="lineControlPanel">
            <div className="lineControlHeader">
              <div>
                <span>{t('lineLabel', { number: selectedEditorIndex + 1 }).toUpperCase()}</span>
                <input value={selectedEditorLine.speaker || ''} onChange={e => updateCourseLine(selectedEditorLine.id, 'speaker', e.target.value)} placeholder={t('speaker')} />
              </div>
              <div className="lineControlNav">
                <button disabled={selectedEditorIndex <= 0} onClick={() => { setEditingLineId(editorLines[selectedEditorIndex - 1]?.id || ''); setSplitLineId('') }}>{t('prevLine')}</button>
                <button disabled={selectedEditorIndex >= editorLines.length - 1} onClick={() => { setEditingLineId(editorLines[selectedEditorIndex + 1]?.id || ''); setSplitLineId('') }}>{t('nextLine')}</button>
                <button onClick={() => setLearnSubtab('audio')}>{t('back')}</button>
              </div>
            </div>
            <div className="linePreviewCard">
              <strong>{selectedEditorLine.en || t('english')}</strong>
              {selectedEditorLine.cn && <span>{selectedEditorLine.cn}</span>}
            </div>

            <section className="controlSection">
              <h3>{t('timing')}</h3>
              <div className="timingGrid">
                <div className="timingBox">
                  <span>{t('start')}</span>
                  <input value={selectedEditorLine.startTime ?? ''} onChange={e => updateCourseLine(selectedEditorLine.id, 'startTime', e.target.value)} placeholder="00:00" />
                  <div>
                    <button onClick={() => adjustCourseLineTime(selectedEditorLine.id, 'startTime', -0.1)}>-100ms</button>
                    <button onClick={() => adjustCourseLineTime(selectedEditorLine.id, 'startTime', 0.1)}>+100ms</button>
                  </div>
                </div>
                <div className="timingBox">
                  <span>{t('end')}</span>
                  <input value={selectedEditorLine.endTime ?? ''} onChange={e => updateCourseLine(selectedEditorLine.id, 'endTime', e.target.value)} placeholder="00:00" />
                  <div>
                    <button onClick={() => adjustCourseLineTime(selectedEditorLine.id, 'endTime', -0.1)}>-100ms</button>
                    <button onClick={() => adjustCourseLineTime(selectedEditorLine.id, 'endTime', 0.1)}>+100ms</button>
                  </div>
                </div>
              </div>
              <div className="controlActionGrid">
                <button className="primary" onClick={() => playLine(selectedEditorLine)}>{t('playLine')}</button>
                <button className="secondary" onClick={() => setMessage(t('timingSaved'))}>{t('saveTiming')}</button>
              </div>
            </section>

            <section className="controlSection">
              <h3>{t('structure')}</h3>
              <div className="structureGrid">
                <button onClick={() => setSplitLineId(splitLineId === selectedEditorLine.id ? '' : selectedEditorLine.id)}><strong>{t('splitHere')}</strong><small>{t('splitHint')}</small></button>
                <button onClick={() => mergeTranscriptLineWithNext(selectedEditorLine.id)}><strong>{t('mergeNext')}</strong><small>{selectedEditorIndex < editorLines.length - 1 ? editorLines[selectedEditorIndex + 1]?.en : ''}</small></button>
              </div>
              {splitLineId === selectedEditorLine.id && <div className="splitWordPicker">
                <p>{t('splitHint')}:</p>
                <div>{String(selectedEditorLine.en || '').trim().split(/\s+/).filter(Boolean).map((word, index, words) => <button key={`${word}-${index}`} disabled={index >= words.length - 1} onClick={() => splitTranscriptLineAtWord(selectedEditorLine.id, index)}>{word}</button>)}</div>
              </div>}
            </section>

            <section className="controlSection">
              <h3>{t('text')}</h3>
              <div className="editorTextGrid">
                <label>{t('english')}<textarea value={selectedEditorLine.en || ''} onChange={e => updateCourseLine(selectedEditorLine.id, 'en', e.target.value)} /></label>
                <label>{t('chinese')}<textarea value={selectedEditorLine.cn || ''} onChange={e => updateCourseLine(selectedEditorLine.id, 'cn', e.target.value)} /></label>
              </div>
            </section>

            <section className="controlSection dangerSection">
              <button className="secondary weakAction" onClick={() => deleteTranscriptLine(selectedEditorLine.id)}>{t('deleteLine')}</button>
            </section>
          </div>}
          <div className="editorLineList">
            {editorLines.map((line, index) => <button className={`editorLineItem ${selectedEditorLine?.id === line.id ? 'active' : ''}`} key={line.id} onClick={() => { setEditingLineId(line.id); setSplitLineId('') }}>
              <span>{index + 1}</span>
              <strong>{line.en || t('english')}</strong>
              <small>{line.speaker || t('speaker')} · {line.startTime ?? '--'} - {line.endTime ?? '--'}</small>
            </button>)}
          </div>
        </div>}
        {learnSubtab === 'notes' && <BackgroundPanel course={activeCourse} t={t} />}
      </section>}

      {tab === 'practice' && activeCourse && <section>
        <CourseHeader course={activeCourse} t={t} sourceLabel={sourceLabel} audioLabel={audioLabel} />
        <div className="subTabs">
          <button className={practiceMode === 'quick' ? 'active' : ''} onClick={() => { setPracticeMode('quick'); setActiveIndex(0); setAnswerShown(false) }}>{t('quickResponse')}</button>
          <button className={practiceMode === 'typing' ? 'active' : ''} onClick={() => { setPracticeMode('typing'); setActiveIndex(0); setAnswerShown(false) }}>{t('typing')}</button>
          <button className={practiceMode === 'replacement' ? 'active' : ''} onClick={() => { setPracticeMode('replacement'); setActiveIndex(0); setAnswerShown(false) }}>{t('replacement')}</button>
        </div>
        {currentPractice ? <PracticeCard item={currentPractice} mode={practiceMode} answerShown={answerShown} typed={typed} setTyped={setTyped} setAnswerShown={setAnswerShown} playText={playText} onCheck={() => checkPracticeAnswer(currentPractice)} onSaveReview={() => addTextToReview({ en: currentPractice.answerEn || currentPractice.base, cn: currentPractice.promptCn, type: 'usefulSentence', source: 'Practice' })} onMarkWeak={() => markPracticeWeak(currentPractice)} onNext={nextPracticeItem} t={t} /> : <Empty text={t('noPracticeItems')} />}
      </section>}

      {tab === 'output' && activeCourse && <section>
        <CourseHeader course={activeCourse} t={t} sourceLabel={sourceLabel} audioLabel={audioLabel} />
        <div className="subTabs">
          <button className={outputMode === 'guided' ? 'active' : ''} onClick={() => { setOutputMode('guided'); setActiveIndex(0) }}>{t('guidedSpeaking')}</button>
          <button className={outputMode === 'rolePlay' ? 'active' : ''} onClick={() => { setOutputMode('rolePlay'); setActiveIndex(0) }}>{t('rolePlay')}</button>
          <button className={outputMode === 'retell' ? 'active' : ''} onClick={() => { setOutputMode('retell'); setActiveIndex(0) }}>{t('retell')}</button>
        </div>
        {currentOutput ? <OutputCard item={currentOutput} playText={playText} playList={playOutputLines} onSaveReview={payload => addTextToReview({ ...payload, source: payload.source || 'Output' })} onMarkStuck={() => markOutputStuck(currentOutput)} onNext={nextOutputItem} t={t} /> : <Empty text={t('noOutputTasks')} />}
      </section>}

      {tab === 'review' && <section>
        <div className="reviewBuckets">
          {Object.entries(reviewBuckets).map(([label, count]) => <div key={label}><strong>{count}</strong><span>{reviewLabel(label)}</span></div>)}
        </div>
        <div className="subTabs">
          <button className={reviewMode === 'today' ? 'active' : ''} onClick={() => { setReviewMode('today'); setActiveIndex(0); setAnswerShown(false) }}>{t('todayReview')}</button>
          <button className={reviewMode === 'chunks' ? 'active' : ''} onClick={() => { setReviewMode('chunks'); setActiveIndex(0); setAnswerShown(false) }}>{t('chunks')}</button>
          <button className={reviewMode === 'sentences' ? 'active' : ''} onClick={() => { setReviewMode('sentences'); setActiveIndex(0); setAnswerShown(false) }}>{t('usefulSentences')}</button>
          <button className={reviewMode === 'weak' ? 'active' : ''} onClick={() => { setReviewMode('weak'); setActiveIndex(0); setAnswerShown(false) }}>{t('weakStuck')}</button>
        </div>
        <div className="reviewCard">
          <span>{reviewMode === 'today' ? t('todayReview') : reviewMode === 'chunks' ? t('chunks') : reviewMode === 'sentences' ? t('usefulSentences') : t('weakStuck')}</span>
          {currentReview ? <>
            <h2>{currentReview.promptCn}</h2>
            {answerShown ? <button className="answerBox">{currentReview.answerEn}</button> : <button className="primary" onClick={() => setAnswerShown(true)}>{t('showAnswer')}</button>}
            <div className="actionRow">
              <button className="secondary" onClick={() => playText(currentReview.answerEn)}>{t('play')}</button>
              <button className="secondary" onClick={() => markReview(currentReview, 'again')}>{t('again')}</button>
              <button className="primary" onClick={() => markReview(currentReview, 'good')}>{t('good')}</button>
            </div>
          </> : <Empty text={reviewMode === 'today' ? t('noReviewToday') : t('noReviewSection')} />}
        </div>
        <div className="queueList">
          {reviewPool.slice(0, 12).map(item => <button key={item.id} onClick={() => playText(item.answerEn)}><strong>{item.answerEn}</strong><span>{reviewLabel(reviewBucketLabel(item))} · {dateLabel(item.nextReviewAt)} · {item.status}</span></button>)}
        </div>
      </section>}
    </main>

    <aside className="rightPanel">
      <div className="sideCard">
        <span>{t('nextStep')}</span>
        <strong>{tab === 'learn' ? t('practiceQuick') : tab === 'practice' ? t('tryOutput') : t('continueLearn')}</strong>
        <button onClick={() => setTab(tab === 'learn' ? 'practice' : tab === 'practice' ? 'output' : 'learn')}>{t('go')}</button>
      </div>
      <div className="sideCard">
        <span>{t('nav.review')}</span>
        <strong>{t('reviewReady', { count: dueReview.length })}</strong>
        <button onClick={() => setTab('review')}>{t('nav.review')}</button>
      </div>
    </aside>

    {settingsOpen && <div className="drawerBackdrop" onClick={() => setSettingsOpen(false)}>
      <div className="settingsDrawer" onClick={e => e.stopPropagation()}>
        <div className="topActions"><h2>{t('settingsTitle')}</h2><button className="secondary compact" onClick={() => setSettingsOpen(false)}>{t('close')}</button></div>
        <div className="settingsNote">{t('settingsNote', { version: APP_VERSION })}</div>
        <label>{t('account')}<select value={activeUserId} onChange={e => switchUser(e.target.value)}>{userProfiles.map(user => <option value={user.id} key={user.id}>{user.name}</option>)}</select></label>
        <div className="accountSettings">
          <strong>{t('accountSettings')}</strong>
          {userProfiles.map(user => <div className="accountEditRow" key={user.id}>
            <label>{t('accountName')}<input value={user.name} onChange={e => updateUserProfile(user.id, { name: e.target.value })} /></label>
            <label>{t('accountPassword')}<input type="password" value={user.password} onChange={e => updateUserProfile(user.id, { password: e.target.value })} placeholder={t('passwordPlaceholder')} /></label>
          </div>)}
          <p>{t('passwordSavedHint')}</p>
        </div>
        <div className="dataTools">
          <strong>{t('dataBackup')}</strong>
          <p>{t('backupHint')}</p>
          <div className="actionRow">
            <button className="secondary" onClick={exportCurrentUserData}>{t('exportData')}</button>
            <button className="secondary" onClick={() => backupFileRef.current?.click()}>{t('importData')}</button>
          </div>
          <input ref={backupFileRef} type="file" accept="application/json,.json" onChange={e => importCurrentUserData(e.target.files?.[0])} />
        </div>
        <label>{t('uiLanguage')}<select value={uiLanguage} onChange={e => setSettings({ ...settings, uiLanguage: e.target.value })}><option value="en">{t('uiEnglish')}</option><option value="zh">{t('uiChinese')}</option></select></label>
        <label>{t('openaiKey')}<input type="password" value={settings.apiKey} onChange={e => setSettings({ ...settings, apiKey: e.target.value })} placeholder="sk-..." /></label>
        <label>{t('defaultVoice')}<select value={settings.voice} onChange={e => setSettings({ ...settings, voice: e.target.value })}>{VOICE_OPTIONS.map(v => <option key={v}>{v}</option>)}</select></label>
        <div className="voiceMap">
          <strong>{t('speakerVoices')}</strong>
          <p>{t('speakerVoicesHint')}</p>
          {speakerVoiceNames.map(speaker => <label key={speaker}>{t('voiceFor', { speaker })}<select value={settings.speakerVoices?.[speaker] || settings.voice} onChange={e => setSpeakerVoice(speaker, e.target.value)}>{VOICE_OPTIONS.map(v => <option key={v}>{v}</option>)}</select></label>)}
        </div>
        <label>{t('languageDisplay')}<select value={settings.displayMode} onChange={e => setSettings({ ...settings, displayMode: e.target.value })}><option value="both">EN + CN</option><option value="en">EN</option><option value="cn">CN</option><option value="hide">Hide English</option></select></label>
        <label>{t('pauseSeconds')}<select value={settings.pauseSeconds} onChange={e => setSettings({ ...settings, pauseSeconds: e.target.value === 'manual' ? 'manual' : Number(e.target.value) })}><option value={1}>1 second</option><option value={2}>2 seconds</option><option value={3}>3 seconds</option><option value={5}>5 seconds</option><option value="manual">{t('manualPause')}</option></select></label>
        <label>{t('displayScale')}<select value={settings.fontScale} onChange={e => setSettings({ ...settings, fontScale: e.target.value })}><option value="normal">{t('normal')}</option><option value="comfortable">{t('comfortable')}</option><option value="large">{t('large')}</option></select></label>
      </div>
    </div>}
  </div>
}

function CourseCard({ course, linkedTitle, onLearn, onPractice, t, sourceLabel, audioLabel, listenLabel }) {
  const unaligned = countUnaligned(course.transcriptLines || [])
  const lastStage = course.lastStage ? t(`stage.${course.lastStage}`) : t('notStartedYet')
  return <article className="courseCard">
    <div className="courseTop">
      <span className="modeBadge">{audioLabel(course.audioMode)}</span>
      <span>{course.level}</span>
    </div>
    <h3>{course.title}</h3>
    <p>{course.goal || course.category}</p>
    <div className="courseMeta">
      <span>{sourceLabel(course.sourceType)}</span>
      <span>{course.importMethod === 'audioImport' ? t('audioImport') : t('textPackImport')}</span>
      {course.status && <span>{course.status}</span>}
      {linkedTitle && <span className="linkedBadge">{t('linkedTo', { title: linkedTitle })}</span>}
      {unaligned > 0 && <span className="warningBadge">{unaligned} {t('unaligned')}</span>}
    </div>
    <div className="courseStatsLine">{listenLabel(course)} · {course.transcriptLines?.length || 0} {t('lines')} · {lastStage}</div>
    <div className="actionRow">
      <button className="primary" onClick={onLearn}>{t('open')}</button>
      <button className="secondary" onClick={onPractice}>{t('continue')}</button>
    </div>
  </article>
}

function CourseHeader({ course, t, sourceLabel, audioLabel }) {
  const unaligned = countUnaligned(course.transcriptLines || [])
  const lastStage = course.lastStage ? t(`stage.${course.lastStage}`) : t('notStartedYet')
  return <div className="courseHeader">
    <div>
      <span>{sourceLabel(course.sourceType)} · {audioLabel(course.audioMode)} · {course.level}{course.audioType ? ` · ${course.audioType}` : ''}</span>
      <h2>{course.title}</h2>
      <p>{course.goal || course.category}</p>
      <em className="stagePill">{lastStage}{course.lastStudiedAt ? ` · ${shortDateLabel(course.lastStudiedAt)}` : ''}</em>
      {course.linkedCourseTitle && <em className="linkedLine">{t('linkedTo', { title: course.linkedCourseTitle })}</em>}
      {unaligned > 0 && <em className="headerWarning">{t('unalignedWarning', { count: unaligned })}</em>}
    </div>
  </div>
}

function BackgroundPanel({ course, t }) {
  const rows = backgroundRows(course.background || {})
  return <div className="heroPanel backgroundPanel">
    <span>{t('background')}</span>
    <h2>{course.background?.topic || course.background?.en || course.title}</h2>
    {rows.length ? <div className="backgroundGrid">
      {rows.map(([label, value]) => <div key={label}>
        <strong>{t(`bg.${label}`)}</strong>
        <p>{value}</p>
      </div>)}
    </div> : <p>{course.background?.cn || course.goal}</p>}
    {course.stage6Prompt && <button className="secondary">{t('copyVoicePrompt')}</button>}
  </div>
}

function DisplaySwitch({ settings, setSettings }) {
  return <div className="displaySwitch">
    {[
      ['en', 'EN'],
      ['both', 'EN+CN'],
      ['hide', 'Hide']
    ].map(([id, label]) => <button key={id} className={settings.displayMode === id ? 'active' : ''} onClick={() => setSettings({ ...settings, displayMode: id })}>{label}</button>)}
  </div>
}

function ImportPreview({ preview, t, sourceLabel, audioLabel }) {
  const courses = preview.kind === 'bundle' ? preview.courses : [preview]
  const report = preview.importReport
  return <div className="previewBox importReport">
    <strong>{report.title}</strong>
    <div className="reportGrid">
      <span>PACK_TYPE: {report.packType || 'TEXT_PACK'}</span>
      <span>SOURCE_TYPE: {report.sourceType}</span>
      <span>AUDIO_MODE: {report.audioMode}</span>
      <span>IMPORT_METHOD: {report.importMethod}</span>
      <span>LINKED_COURSE_TITLE: {report.linkedCourseTitle || 'None'}</span>
    </div>
    <div className="routeGrid">
      <div><strong>{report.learnItems}</strong><span>{t('nav.learn')}</span></div>
      <div><strong>{report.practiceItems}</strong><span>{t('nav.practice')}</span></div>
      <div><strong>{report.outputItems}</strong><span>{t('nav.output')}</span></div>
      <div><strong>{report.reviewItems}</strong><span>{t('nav.review')}</span></div>
    </div>
    <div className="coursePreviewList">
      {courses.map(course => <div key={course.id}>
        <strong>{course.title}</strong>
        <span>{sourceLabel(course.sourceType)} · {audioLabel(course.audioMode)} · {course.importMethod === 'audioImport' ? t('audioImport') : t('textPackImport')}</span>
      </div>)}
    </div>
    {!!report.missingFields?.length && <p>{t('missingFields')}: {report.missingFields.join(', ')}</p>}
    {!!report.warnings?.length && <p>{t('warnings')}: {report.warnings.join(' ')}</p>}
  </div>
}

function PracticeCard({ item, mode, answerShown, typed, setTyped, setAnswerShown, playText, onCheck, onSaveReview, onMarkWeak, onNext, t }) {
  const expected = item.answerEn || ''
  const isCorrect = typed.trim().toLowerCase() === expected.trim().toLowerCase()
  return <div className="practiceCard">
    <span>{mode === 'quick' ? t('quickResponse') : mode === 'typing' ? t('typing') : t('replacement')}</span>
    <h2>{mode === 'replacement' ? item.base : item.promptCn}</h2>
    {item.hint && <p>{item.hint}</p>}
    {mode === 'typing' && <input value={typed} onChange={e => setTyped(e.target.value)} placeholder={t('typeEnglishAnswer')} />}
    {mode === 'replacement' && <div className="answerBox">{t('replacement')}: {item.replacement}</div>}
    {answerShown && <button className={`answerBox ${mode === 'typing' && typed ? (isCorrect ? 'correct' : 'wrong') : ''}`}>{expected}</button>}
    <div className="actionRow">
      <button className="secondary" onClick={() => playText(expected)}>{t('play')}</button>
      <button className="secondary" onClick={mode === 'typing' ? onCheck : () => setAnswerShown(true)}>{mode === 'typing' ? t('check') : t('showAnswer')}</button>
      <button className="secondary" onClick={onSaveReview}>{t('saveReview')}</button>
      <button className="secondary weakAction" onClick={onMarkWeak}>{t('markWeak')}</button>
      <button className="primary" onClick={onNext}>{t('next')}</button>
    </div>
  </div>
}

function OutputCard({ item, playText, playList, onSaveReview, onMarkStuck, onNext, t }) {
  const [userRole, setUserRole] = useState(item.userRole || 'Kevin')
  if (item.type === 'rolePlay') {
    return <div className="practiceCard">
      <span>{t('rolePlay')}</span>
      <h2>{item.scenario}</h2>
      <select value={userRole} onChange={e => setUserRole(e.target.value)}>
        {[...new Set(item.lines.map(line => line.speaker).filter(Boolean))].map(role => <option key={role}>{role}</option>)}
      </select>
      <button className="primary" onClick={() => playList(item.lines, { skipSpeaker: userRole })}>{t('rolePlay')}</button>
      <div className="sentenceList compactList">
        {item.lines.map((line, index) => <div className="sentenceRow" key={index}>
          <span className="speaker">{line.speaker}</span>
          <button className="sentenceText sentencePlay" onClick={() => playText(line.en, line.speaker)}><span>{line.en}</span>{line.cn && <small>{line.cn}</small>}</button>
          <div className="lineActions">
            <button title={t('saveReview')} onClick={() => onSaveReview({ en: line.en, cn: line.cn, type: 'usefulSentence' })}>⭐</button>
          </div>
        </div>)}
      </div>
      <div className="actionRow">
        <button className="secondary weakAction" onClick={onMarkStuck}>{t('markStuck')}</button>
        <button className="primary" onClick={onNext}>{t('next')}</button>
      </div>
    </div>
  }
  if (item.type === 'retell') {
    return <div className="practiceCard">
      <span>{t('retell')}</span>
      <h2>{item.prompt}</h2>
      <div className="chipRow">{(item.keywords || []).map(k => <span key={k}>{k}</span>)}</div>
      <textarea placeholder={t('retellPlaceholder')} />
      <div className="actionRow">
        <button className="secondary" onClick={() => playText(item.sample)}>{t('play')}</button>
        <button className="secondary" onClick={() => onSaveReview({ en: item.sample, cn: item.prompt, type: 'usefulSentence' })}>{t('saveReview')}</button>
        <button className="secondary weakAction" onClick={onMarkStuck}>{t('markStuck')}</button>
        <button className="primary" onClick={onNext}>{t('next')}</button>
      </div>
      <button className="answerBox">{item.sample}</button>
    </div>
  }
  return <div className="practiceCard">
    <span>{t('guidedSpeaking')}</span>
    <h2>{item.prompt}</h2>
    <div className="chipRow">{(item.hints || []).map(h => <span key={h}>{h}</span>)}</div>
    <textarea placeholder={t('answerPlaceholder')} />
    <div className="actionRow">
      <button className="secondary" onClick={() => playText(item.sample)}>{t('play')}</button>
      <button className="secondary" onClick={() => onSaveReview({ en: item.sample, cn: item.prompt, type: 'usefulSentence' })}>{t('saveReview')}</button>
      <button className="secondary weakAction" onClick={onMarkStuck}>{t('markStuck')}</button>
      <button className="primary" onClick={onNext}>{t('next')}</button>
    </div>
    {item.sample && <button className="answerBox">{item.sample}</button>}
  </div>
}

function Empty({ text }) {
  return <div className="emptyState">{text}</div>
}

createRoot(document.getElementById('root')).render(<App />)
