# Kevin Audio Memory App Project Handoff

> 当前文件是早期 V2 方向的旧交接文档，已经过时。
>
> 新对话继续开发 Kevin English Learning System 时，请优先阅读：
>
> `DEVELOPMENT_HANDOFF_V3_9_4.md`
>
> 当前产品方向是 V3.9.4：MacBook + iPhone 17 Pro 双端 Audio First 英语课程训练播放器。

## 1. 当前项目状态

当前项目已经从早期的“音频记忆工具”进入 V2.0 方向：`Topic Conversation Automation Trainer`，也就是“主题会话自动化训练系统”。

当前线上版本主要部署在 Vercel：

- Production URL: `https://kevin-audio-memory-app.vercel.app/`
- GitHub repo: `kevin-audio-memory-vercel`
- 当前项目目录：`KevinAudioMemory_UPLOAD_TO_GITHUB`
- 主要代码文件：`src/main.jsx`、`src/style.css`、`api/openai-voice.js`、`public/sw.js`

当前程序已经具备基础 Import、Library、Learn、OpenAI TTS、PWA 配置和部分 5 阶段训练入口，但仍处于不稳定状态。

最需要注意的是：

- iPhone 上音频缓存、Play List、Listen All、Prepare Source Audio 仍可能导致白屏或播放失败。
- Topic Pack 导入解析仍不够稳定，尤其是 `MINI_DIALOGUE`、多行字段、Stage 1-6 内容识别。
- iPhone 网页版、添加到主屏幕后的 App 版、Mac 网页版目前数据不同步，因为数据仍主要保存在本地浏览器存储中。
- 当前不应优先做复杂云同步或复杂 AI Chat，应先修复核心训练流程稳定性。

## 2. 最新产品定位

本程序不是：

- Anki clone
- 背单词软件
- 普通资料库
- 简单音频播放器
- 复杂工程型 SRS 系统
- AI Chat 聊天软件

本程序是：

**面向 Kevin 的 iPhone First 主题英语会话自动化训练系统。**

整体分工：

- ChatGPT 负责生成主题训练内容。
- 程序负责把内容变成可反复训练的流程。
- ChatGPT Voice 负责最后真实模拟对话。

核心目标：

- 帮助 Kevin 在澳洲生活场景中提高听力熟悉度、开口反应、语块记忆、句型自动化和长期复习。
- 让 Kevin 通过主题会话训练，而不是孤立背单词。
- 让程序像一个“英语音频训练播放器 + 记忆训练器”，而不是复杂学习管理系统。

设计优先级：

1. iPhone 17 Pro Max 优先。
2. 音频优先。
3. 主题内容优先。
4. 操作简单优先。
5. 稳定性优先。

Mac 网页版只作为辅助管理或测试入口，不作为主要体验优化对象。

## 3. 1-5 阶段训练逻辑

V2.0 的核心训练流程应围绕 Topic Pack 展开，而不是围绕零散 Chunks / Sentences / Patterns / Mini Dialogues 展开。

### Stage 1: Theme Dialogue

主题对话学习。

目标：

- 先让 Kevin 熟悉完整场景。
- 理解真实对话结构。
- 通过听、跟读、角色扮演建立场景感。

应包含：

- 完整对话预览。
- Listen All。
- 单句播放。
- 逐句跟读。
- 分角色显示。
- Role-play。
- 英文 / 中文 / 英中 / 隐藏英文显示切换。
- 播放时自动去掉说话人标签，只播放真实台词内容。

### Stage 2: Words & Chunks

词汇与高频语块学习。

目标：

- 不是单纯背单词。
- 要让 Kevin 在真实句子中理解和使用词汇、语块。

应包含：

- 英文。
- 中文意思。
- 发音。
- 例句。
- 例句中文。
- 跟读。
- 拼写练习。
- 中文提示说英文。
- 自己造句入口。

### Stage 3: Pattern Drill

句型自动化训练。

目标：

- 让 Kevin 不只是知道句型，而是能快速说出来。

应包含：

- 句型结构。
- 中文意思。
- 3-5 个替换例句。
- 例句中文。
- 替换练习。
- 看中文说英文。
- 半句补全。
- 快速口头反应。
- 相关 Mini Dialogue。

### Stage 4: Useful Sentences

实用句子训练。

目标：

- 训练最值得 Kevin 直接背下来、生活中马上能用的完整句子。

应包含：

- 英文句子。
- 中文意思。
- 播放。
- 跟读。
- 例句。
- Pattern。
- Mini Dialogue。
- 拼写练习。
- 中文到英文 Recall。
- Again / Good。

### Stage 5: Guided Conversation

半控制输出训练。

目标：

- 帮 Kevin 从跟读模仿过渡到自己表达。
- 不是自由聊天，而是在本课内容范围内做输出训练。

应包含：

- 中文场景提示。
- Kevin 输入英文回答。
- 关键词提示。
- 句型提示。
- 参考答案。
- 改进版本。
- 参考答案播放。
- 保存弱项到复习。

语音回应可以作为后续版本增强，不应阻塞 V2.0 Fix 1。

## 4. Stage 6 程序外 ChatGPT 语音模拟逻辑

Stage 6 不在程序内完成。

程序只需要保存并管理 ChatGPT 生成的 Stage 6 Prompt，并提供一键复制。

正确流程：

1. Kevin 在程序内完成 Stage 1-5。
2. 在 Library 的课程详情中打开 Stage 6 Prompt。
3. 点击 Copy。
4. 粘贴到 ChatGPT Voice。
5. 在 ChatGPT Voice 里完成真实模拟对话。

Stage 6 Prompt 应明确约定：

- 对话主题范围。
- Kevin 当前英语水平。
- 优先使用本课学过的词汇、语块、句型和实用句子。
- ChatGPT 不要使用太难表达。
- 如果 Kevin 不会回答，应给提示，不应直接换话题。
- 对话结束后给出简单反馈和可复习表达。

程序不要升级成完整 AI Chat。当前阶段应避免把重点转向复杂 AI 对话功能。

## 5. 当前已完成功能

以下功能已经有基础版本，但其中部分仍需要稳定性修复：

- Import 可以导入结构化英文学习内容。
- 旧版 `CHUNK` / `SENTENCE` 数据仍可使用。
- Library 可以显示课程 / Source，并支持 Start Learning。
- Learn 已出现 5 阶段训练方向的入口。
- Deep Learn / Card 页面已有 Listen / Recall 基础模式。
- Mini Dialogue 已有单句播放、Listen All、Role-play、角色选择、停顿选择等基础功能。
- OpenAI TTS API 已接入。
- Vercel 部署已可成功构建。
- PWA 基础文件已存在。
- iPhone 上可以通过浏览器或添加到主屏幕方式打开。

但这些功能不能视为稳定完成。下一版必须以测试反馈为准，先修稳定性和训练流程。

## 6. 最新测试反馈与必须修复的问题

请特别阅读本章节。下一版开发必须优先处理这些测试反馈，不能只按旧计划开发。

### 6.1 Import / 导入问题

当前问题：

- Topic Pack 导入解析不稳定。
- Stage 1-6 不能保证完整识别。
- `Dialogue`、`Vocabulary`、`Chunks`、`Patterns`、`Useful Sentences`、`Guided Conversation`、`Stage 6 Prompt` 的识别规则还不够清楚。
- 多行字段容易丢失，尤其是 `MINI_DIALOGUE`、`DIALOGUE`、`EXAMPLES`。
- 用户多次导入含 `MINI_DIALOGUE` 的内容后，程序仍显示错误的默认句子：`When do you use this sentence?`
- 这说明程序仍在使用旧 fallback 内容、旧缓存内容，或解析后没有正确覆盖旧字段。
- 重复导入时，新增、更新、覆盖逻辑不透明。
- Import Preview 如果显示正常但训练页显示错误，说明 Preview 和实际保存数据可能不是同一套解析结果。

修改要求：

- 建立统一 Topic Pack parser。
- 支持课程级字段：`COURSE_TITLE` / `SOURCE` / `CATEGORY` / `LEVEL` / `TAGS` / `PACK_TYPE`。
- 支持内容块字段：`TYPE`、`CONTENT`、`MEANING`、`EXAMPLES`、`PATTERN`、`DIALOGUE`、`MINI_DIALOGUE`、`OUTPUT_PRACTICE`、`STAGE_6_PROMPT`。
- 多行字段必须一直读取到下一个字段名或分隔线 `---`。
- 如果导入内容提供了 `MINI_DIALOGUE`，训练页必须显示用户导入内容，不允许自动生成默认对话。
- 旧默认句 `When do you use this sentence?` 只能在完全没有任何对话内容时作为 fallback，并且应明确标记为 fallback。
- 重复导入同一课程时，应显示：新增多少、更新多少、跳过多少。

优先级：P0，必须立即修复。

注意事项：

- 不要为了兼容新 Topic Pack 而破坏旧 `CHUNK` / `SENTENCE` 数据。
- Import 只负责导入，不要变成学习页面。

### 6.2 Library / 资料管理问题

当前问题：

- Library 还没有真正按 Topic Pack 管理课程。
- 课程标题、分类、标签、等级、学习进度显示不够完整。
- Start Learning 可用，但课程详情、Stage 6 Prompt、Source Text 管理不完整。
- 资料可能重复，分类可能混乱。
- 删除、重命名、移动分类、编辑标签仍不够方便。

修改要求：

- Library 升级为课程管理中心。
- 课程卡片显示：标题、分类、等级、标签、内容数量、学习进度、Start Training、View Source、Edit、Move、Delete。
- 增加 Course Detail 页面。
- Course Detail 包含：Overview、Stage 1 Dialogue、Words & Chunks、Patterns、Useful Sentences、Guided Conversation、Stage 6 Prompt、Source Text。
- Stage 6 Prompt 的复制入口应放在 Course Detail，而不是 Learn 首页主按钮。

优先级：P1，应尽快优化。

注意事项：

- Library 负责选课和管理。
- Learn 只负责训练。

### 6.3 Train / 学习训练流程问题

当前问题：

- 当前训练逻辑已经有 1-5 阶段方向，但旧内容类型入口仍曾与新 Stage 入口重复。
- `Current Source`、`Queue`、`Chunks`、`Sentences`、`MORE` 等旧入口曾造成理解混乱。
- 用户反馈 `CURRENT SOURCE` 点击没有反应，不能选择其他课程。
- Play List、Play All 点击后无声或报错。
- 当前界面仍有可能只是展示内容，没有形成真正训练流程。

修改要求：

- Learn 首页只保留 5 个训练阶段入口。
- 删除或隐藏重复旧入口：`Current Source` 下拉、`Queue`、Content Type 二次选择、Search Learn。
- 当前课程选择统一从 Library 完成。
- Learn 页面只显示当前课程标题、等级、分类和 5 个 Stage。
- 每个 Stage 点击后直接进入对应训练页，不要再二次选择 Mini Dialogues / Sentences 等。

优先级：P0，必须立即修复。

注意事项：

- 如果保留任何二级入口，必须有明确学习意义。
- 不要让 Kevin 在 Learn 页做资料管理。

### 6.4 Stage 1 Dialogue / 主题对话训练问题

当前问题：

- 点击 Theme Dialogue 后，不应再进入 Mini Dialogues 二级筛选。
- 完整对话预览、逐句播放、Listen All、Role-play 需要统一。
- Mini Dialogue / Theme Dialogue 播放时还可能读出 `A:`、`B:`、`Kevin:` 等说话人标签，听感不自然。
- Role-play 需要支持选择角色，并隐藏或跳过该角色台词，留出回应时间。
- 用户要求停顿时间为：2s / 4s / 6s / 10s。
- 需要避免角色播放顺序错误、按钮混乱、音频重叠。

修改要求：

- Theme Dialogue 入口直达主题对话学习页。
- 对话每句保存 speaker、english、chinese 三个字段。
- UI 可以显示 speaker 标签，但 TTS 播放时必须只播放真实台词。
- `Listen All` 连续播放全部台词，中间有合理停顿。
- `Role-play` 播放非用户角色台词，用户角色台词不播放，只留停顿时间。
- 支持短对话 4-6 句、标准对话 6-10 句、长对话 10-16 句。

优先级：P0，必须立即修复。

注意事项：

- Listen All 和 Role-play 是用户主动点击，可以播放队列。
- 页面切换、Good & Next、导入后不能自动播放。

### 6.5 Stage 2-4 Card Training / 卡片训练问题

当前问题：

- Words、Chunks、Patterns、Useful Sentences 的训练边界还不够清楚。
- 例句和 Mini Dialogue 可能只显示英文，没有中文。
- 用户反馈句子导入后 Mini Dialogue 被错误改写成默认句。
- 例句和对话目前多为一句一句点播放，缺少局部连续播放按钮。
- 内容显示有时偏密集，按钮较多。

修改要求：

- Words & Chunks、Pattern Drill、Useful Sentences 必须有不同训练结构。
- 所有例句、对话都支持 EN / CN / EN+CN / Hide English。
- 每个卡片页增加局部播放按钮，例如：
  - Play Examples
  - Play Dialogue
  - Listen All
- 局部连续播放要有停顿，不要机械无间隔播放。
- Pattern 需要替换练习、中文提示说英文、半句补全。
- Useful Sentences 需要拼写、中英互译、Mini Dialogue、Again / Good。

优先级：P1，应尽快优化。

注意事项：

- 不要一次把按钮堆满首屏。低频功能可折叠到二级区域。

### 6.6 Stage 5 Guided Conversation / 半控制对话问题

当前问题：

- Stage 5 还没有完全形成半控制输出训练。
- 当前如果只是展示提示，不足以帮助 Kevin 输出。
- 语音回应是否实现不明确，当前不应为了语音输入拖慢主线。
- 输出可能太自由，容易超出本课范围。

修改要求：

- Stage 5 先支持打字回应。
- 每题提供中文场景提示。
- 提供关键词提示、句型提示、参考答案、改进版本。
- 回答内容应尽量限制在本课已学词汇、语块、句型、实用句子范围内。
- 语音回答可以放到后续版本。

优先级：P1，应尽快优化。

注意事项：

- Stage 5 不是 ChatGPT 自由聊天。
- 不要把程序做成 AI Chat。

### 6.7 Stage 6 ChatGPT Voice Prompt / 真实模拟对话指令问题

当前问题：

- Stage 6 Prompt 的保存、展示、复制位置还不够清楚。
- 用户容易误解 Stage 6 是否在程序内完成。
- Learn 页顶部显示 Copy Stage 6 容易干扰主训练流程。

修改要求：

- Stage 6 Prompt 作为 Course Detail 的一部分保存。
- 提供一键复制。
- 明确说明：Stage 6 在 ChatGPT Voice 中完成，不在程序内完成。
- Learn 页可在完成 Stage 1-5 后提供轻量入口，但不要作为主要训练按钮。

优先级：P1，应尽快优化。

注意事项：

- 避免把程序变成 AI Chat。

### 6.8 Audio / TTS / 播放问题

当前问题：

- OpenAI TTS 已接入，但音频生成和播放仍不稳定。
- iPhone 上 Prepare Source Audio 过程中出现白屏。
- 在线点播未缓存音频时速度慢，有时提示 `Audio took too long. Please try again.`
- Play List / Play All 经常无声、卡住或出现白屏。
- iPhone 上出现过错误：`The request is not allowed by the user agent or the platform in the current context...`
- 这说明播放队列可能触发了 iOS 的用户手势限制。
- 用户还看到过错误页：`App needs a refresh`，错误为 `n is not a function. (In 'n()', 'n' is true)`。
- 可能存在音频状态变量、播放回调、缓存对象或压缩后的函数名冲突问题。

修改要求：

- 建立真正的 Single Global Audio Player。
- 播放新音频前必须停止旧音频。
- 所有播放入口都走同一个播放队列和状态机。
- Play List / Listen All / Role-play 必须由用户点击启动，并在同一播放流程内连续执行。
- 生成音频、缓存音频、播放音频要分状态：generating、ready、playing、paused、error。
- Prepare Source Audio 必须分批处理，不能一次生成大量音频导致 iPhone 内存压力。
- 失败时只跳过当前音频并提示，不应造成整页白屏。
- 必须定位并修复 `n is not a function` 的根因，不能只用错误页掩盖。

优先级：P0，必须立即修复。

注意事项：

- 不允许浏览器原生低质量 TTS 替代 OpenAI TTS。
- 不允许自动播放。
- 但用户点击 Play List / Listen All / Role-play 后，队列播放属于明确用户操作。

### 6.9 Review / 复习逻辑问题

当前问题：

- 旧版 Good / Again 间隔复习逻辑需要确认是否仍正常。
- 新 Topic Pack 内容如何进入 Review 还不清楚。
- Review 应优先复习弱项，而不是简单复习所有内容。
- 新内容不应马上进入 Today Review。

修改要求：

- 保留旧 Review 间隔：
  - 第一次 Good：1 天
  - 第二次 Good：3 天
  - 第三次 Good：7 天
  - 第四次 Good：14 天
  - 第五次 Good：30 天
  - 之后：60 天
  - Again：明天复习
- Topic Pack 内的 Chunks、Patterns、Useful Sentences、Guided Conversation 弱项应能进入 Review。
- 新导入内容不应立即出现在 Today Review。

优先级：P1，应尽快优化。

注意事项：

- Review 不要变成复杂统计系统。

### 6.10 iPhone UI / 显示问题

当前问题：

- 用户明确希望以 iPhone 17 Pro Max 为主要适配目标。
- 中间显示区曾出现边距过大，浪费屏幕空间。
- 某些页面内容密集，按钮多。
- 播放按钮点击区域曾偏小，容易误触进入卡片。
- 底部 Safari / PWA 浏览器区域会占用空间，需要留出安全距离。
- Learn 页顶部大标题和重复按钮占用首屏空间。

修改要求：

- 减少页面左右边距，扩大主内容区。
- 保持大字体、大按钮、舒适间距。
- 高频按钮放一级，低频按钮放二级。
- 播放按钮点击区要足够大，并与进入卡片区域明确分开。
- Learn 首页减少标题占用，把训练入口放到首屏核心位置。
- 所有页面避免横向溢出。

优先级：P0 / P1。

注意事项：

- iPhone 优先，Mac 只保证可用，不做主要体验优化。

### 6.11 PWA / 手机稳定使用问题

当前问题：

- iPhone Safari 和添加到主屏幕后的 App 版本数据不一定相同。
- 手机上缓存音频后可能白屏。
- PWA 更新后旧缓存可能继续影响新版本。
- 用户希望不用 Mac 本地 Terminal，也能稳定使用。

修改要求：

- Vercel 部署是当前正确方向。
- Service Worker 必须谨慎，不应缓存旧 JS 导致新版不生效。
- IndexedDB / audio cache 必须有版本管理和清理策略。
- PWA 需要显示当前版本号，方便判断是否更新成功。
- 必须提供 Clear Audio Cache / Reload，但这只是辅助，不能替代稳定修复。

优先级：P0 / P1。

当前必须做：

- 修复白屏。
- 修复播放队列。
- 修复缓存崩溃。
- 确保 Vercel 新版能正常生效。

后续再做：

- 完整离线模式。
- 云端多设备同步。
- 大容量云音频存储。

### 6.12 数据保存与兼容问题

当前问题：

- iPhone Safari、iPhone 添加到主屏幕 App、Mac 浏览器的数据不互通。
- 这是因为当前数据主要保存在各自浏览器本地。
- 旧 CHUNK / SENTENCE 数据和新 Topic Pack 数据需要兼容。
- 如果修改数据结构，可能导致旧数据读不出来。

修改要求：

- 增加数据版本号。
- 增加旧数据迁移函数。
- 旧 CHUNK / SENTENCE 自动映射到新 Topic Pack 结构中的 Words & Chunks / Useful Sentences。
- 新 Topic Pack 不应破坏旧数据。
- 在导入和启动时检测数据结构，不符合时自动迁移或提示备份。

优先级：P0。

注意事项：

- Supabase 云同步可以解决多设备同步，但不是 V2.0 Fix 1 的首要任务。
- 先保证本地数据稳定，再接云。

## 7. 测试反馈优先级分类

### A. 必须立即修复的问题

这些问题会影响程序是否能正常训练，下一版必须先修：

- Topic Pack 导入解析不稳定。
- `MINI_DIALOGUE` 被错误替换成 `When do you use this sentence?`。
- Stage 1-5 流程没有稳定跑通。
- Learn 首页旧入口和新 Stage 入口重复。
- `Current Source` 点击无反应。
- Play List / Play All / Listen All 无声、卡住或触发 iOS 播放限制。
- Prepare Source Audio 造成白屏。
- `n is not a function` 崩溃必须定位根因。
- Single Global Audio Player 规则必须彻底实现。
- 旧数据和新 Topic Pack 数据必须兼容。
- iPhone 17 Pro Max 的核心页面必须清楚、可点、无横向溢出。
- Build 必须通过，并生成可上传的新版本文件。

### B. 应该尽快优化的问题

这些问题影响体验，但不一定阻止核心训练流程：

- Library Course Detail 不完整。
- Stage 6 Prompt 复制入口不够清楚。
- Recall 需要从课程标题回忆改为具体句子回忆。
- Stage 2-4 需要增加拼写、翻译、半句补全、局部连续播放。
- Stage 5 需要更像半控制输出训练。
- Import Preview 需要更准确。
- iPhone 视觉边距、按钮层级、低频功能折叠需要优化。
- PWA 版本显示和缓存清理体验需要优化。

### C. 可以以后再做的问题

这些是高级功能或长期优化，不要影响当前 V2.0 主线开发：

- Supabase 云同步。
- 云端音频存储。
- 多设备账号系统。
- 完整离线课程下载。
- 高级学习统计。
- 语音识别评分。
- AI Chat 内置对话。
-复杂数据看板。

## 8. 下一版开发计划

建议下一版命名：

**V2.0 Fix 1 · Topic Training Flow Stabilization**

如果 V2.0 尚未正式发布，也可以命名：

**V2.0 · Topic Pack + 5-Stage Training Flow**

下一版开发重点：

1. 先修复影响核心训练流程的问题。
2. 先保证 Topic Pack 可以稳定导入、显示、训练。
3. 先保证 Stage 1-5 的基本训练流程能跑通。
4. 先保证 iPhone 17 Pro Max 显示清楚、按钮好点。
5. 先保证 No Autoplay 和 Single Global Audio Player 不被破坏。
6. 先保证 build 通过并生成新 zip。
7. 不要优先做复杂统计、复杂云同步、复杂 AI Chat。

推荐执行顺序：

1. 重写或加固 Topic Pack parser。
2. 加数据版本和旧数据迁移。
3. 重构 Learn 首页为 5 个 Stage。
4. 修复 Theme Dialogue 直达训练页。
5. 修复 Mini Dialogue / Theme Dialogue 的 speaker 解析和 TTS 标签过滤。
6. 重建全局音频播放队列。
7. 修复 Play List / Play All / Listen All / Role-play。
8. 修复 Prepare Source Audio 分批生成和白屏问题。
9. 优化 iPhone 17 Pro Max 关键页面布局。
10. 做最小测试集验证。
11. `npm run build`。
12. 生成新版 zip。

下一版完成标准：

- 导入一个含 Stage 1-6 的 Topic Pack 后，各部分都能正确显示。
- 用户写入的 `MINI_DIALOGUE` 不再被替换。
- Theme Dialogue 能直接进入完整对话训练。
- Listen All / Play List / Role-play 在 iPhone 上能稳定播放。
- 无音频重叠。
- 无页面切换自动播放。
- Prepare Source Audio 不白屏。
- iPhone 首屏训练入口清楚。
- 旧 CHUNK / SENTENCE 数据仍可使用。

## 9. 不可破坏的核心规则

### No Autoplay

没有用户点击，不允许自动播放音频。

禁止在以下场景自动播放：

- 导入后。
- 切换页面后。
- Good & Next 后。
- Next 后。
- Source 切换后。
- 音频生成完成后，除非这次生成来自用户刚刚点击的播放动作。

### Single Global Audio Player

任何时候只能有一个音频在播放。

播放新音频前必须：

- 停止旧音频。
- 清理旧播放状态。
- 防止重叠播放。

### OpenAI TTS First

所有正式学习音频使用 OpenAI TTS。

不要用浏览器原生 TTS 作为正式学习音频。

### iPhone First

主要适配 iPhone 17 Pro Max。

要求：

- 大字体。
- 大按钮。
- 少层级。
- 少输入框。
- 无横向溢出。
- 底部安全区可用。
- 点击区域清楚。

### Library / Learn / Import 分工

- Import 只负责导入。
- Library 负责课程管理。
- Learn 负责当前课程训练。
- Settings 只负责核心设置。

不要把 Learn 再做成资料管理中心。

### Topic Based

学习应围绕 Topic Pack / Course 展开。

不要回到随机卡片、随机句子、孤立单词的模式。

### Review 轻量

保留 Good / Again 的轻量间隔复习。

不要做复杂统计系统。

### Backward Compatibility

不能破坏旧数据。

旧 `CHUNK` / `SENTENCE` 必须能继续打开、播放、复习。

## 10. 给新 Codex 对话的简短启动指令

请把下面内容复制给新的 Codex 对话：

```text
请先阅读 PROJECT_HANDOFF.md。

这个项目是 Kevin Audio Memory App，不是 Anki，也不是普通资料库，而是 iPhone First 的主题会话自动化训练系统。

下一版目标是 V2.0 Fix 1 · Topic Training Flow Stabilization。

请特别阅读 PROJECT_HANDOFF.md 中的《最新测试反馈与必须修复的问题》章节。下一版开发必须优先处理这些测试反馈，不能只按旧计划开发。

开发时请优先修复：
1. Topic Pack 导入解析。
2. MINI_DIALOGUE 被错误替换的问题。
3. Learn 首页 5 阶段训练流程。
4. Theme Dialogue 直达训练页。
5. iPhone 上 Play List / Listen All / Role-play / Prepare Source Audio 的播放和白屏问题。
6. Single Global Audio Player。
7. iPhone 17 Pro Max UI 显示和点击体验。

不要优先做复杂云同步、复杂统计或 AI Chat。

修改后必须运行 build，确认无编译错误，并生成新版 zip。
```
