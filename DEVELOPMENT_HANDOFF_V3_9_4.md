# Kevin English Learning System 开发交接文档

版本：V3.9.4 Learn Audio First Refinement  
更新时间：2026-05-30  
项目目录：`/Users/maxli/Documents/Codex/2026-05-16/files-mentioned-by-the-user-spacedreview/KevinAudioMemory_UPLOAD_TO_GITHUB`  
线上地址：`https://kevin-audio-memory-app.vercel.app/`  
GitHub 仓库：`my31118829-dev/kevin-audio-memory-vercel`  
最新已部署 commit：`27d6ba4`

> 给下一次新对话的第一句话建议：
>
> 请先阅读项目里的 `DEVELOPMENT_HANDOFF_V3_9_4.md`，继续开发 Kevin English Learning System，从 V3.9.5 Learn Polish + Audio Interaction 开始。

---

## 1. 一句话产品定位

Kevin English Learning System 是一个面向 Kevin 的 **MacBook + iPhone 17 Pro 双端使用的 Audio First 英语课程训练播放器**。

它不是 Anki，不是普通背单词软件，不是 AI 自由聊天工具，也不是复杂 LMS。它的核心是：

```text
Library / Import 管课程来源
Today 告诉用户今天学什么
Learn 负责听懂、看懂、跟读和语言预习
Practice 负责把语言练成自动反应
Output 负责半控制输出
Review 负责长期记忆和弱项修复
```

产品的灵魂是：

```text
听 -> 看 -> 跟读 -> 练 -> 说 -> 记住
```

---

## 2. 当前项目状态

当前线上版本是 **V3.9.4**。

已经确认：

- 生产页面能打开。
- 页面显示 `V3.9.4`。
- 线上 JS 资源为 `/assets/index-BILxAmML.js`。
- 线上 CSS 资源为 `/assets/index--h7nFVVU.css`。
- `public/sw.js` / `dist/sw.js` 使用缓存版本 `v23`。
- iPhone 430px 视口检查无横向溢出。
- Learn 页已显示新的句子行结构：序号 + 句子 + 中文 + `⭐` + `🔧`。
- Learn 页已显示 `Understand`、`1x / 3x / 5x`、`1s / 2s / 3s / 5s / Manual`。
- 旧的 Learn 顶部低价值统计已删除。

注意：本项目目前主要代码仍集中在 `src/main.jsx` 和 `src/style.css`，不要在没有必要时做大规模拆文件重构。下一步应继续以稳定体验为主。

---

## 3. 关键文件

```text
src/main.jsx
  主应用逻辑。包含数据模型、内置 Demo、Import、Learn、Practice、Output、Review、Settings。

src/style.css
  全部主要 UI 样式。当前目标是 Apple-like、干净、低刺激、长期阅读舒服。

api/openai-transcribe.js
  音频转录接口。用于 Audio Import。

api/openai-clean-subtitles.js
  GPT 清理自然句和字幕句接口。用于 Smart Process。

api/openai-voice.js
  OpenAI TTS 语音生成接口。用于 Generated Audio Mode 和语言内容播放。

public/sw.js
  PWA service worker。每次关键部署需要递增缓存版本。

scripts/check-tracked-node-modules.mjs
  构建前检查，防止 node_modules 被提交。

README.md
  当前版本说明和版本历史。

PROJECT_HANDOFF.md
  旧交接文档，内容偏 V2，已明显过时。不要作为当前开发依据。

DEVELOPMENT_HANDOFF_V3_9_4.md
  本文件。新对话应优先读这个。
```

---

## 4. 不要泄露密钥

用户曾在对话里提供过 GitHub token。交接文档、README、源码、提交信息、最终回答里都不要写入任何 token 或 API key。

部署脚本可以从环境变量或剪贴板读取 token，但文档中只写流程，不写密钥内容。

---

## 5. 核心不可违反规则

### 5.1 Audio Import 和 Text Pack Import 不能混淆

```text
Audio Import = Textbook Course = Original Audio Mode
Text Pack Import = Expansion Pack / General Topic Pack = Generated Audio Mode
```

Audio Import 只用于教材原音频：

```text
上传原音频
-> Whisper 转录
-> GPT 清理自然句
-> 滑动窗口重新对齐时间轴
-> 字幕 / 语言点 / Practice / Output / Review
-> 保存为 Textbook Course
```

Text Pack Import 用于 ChatGPT 生成的拓展包和自由主题包：

```text
导入文字稿
-> 解析结构
-> 生成 / 使用 TTS 音频
-> 保存为 Expansion Pack 或 General Topic Pack
```

### 5.2 教材原音频不能被 TTS 替代

Textbook Course 的原音频必须保留。

禁止：

```text
用 TTS 替代教材音频
自动生成新对话冒充教材音频
改写教材原文内容
```

可以：

```text
转录
分句
翻译
提取语言点
生成练习
生成输出任务
生成复习卡
```

### 5.3 没有用户点击不能自动播放

浏览器和 iPhone PWA 都必须遵守：

```text
用户点击内容 / 按钮
=
才可以播放音频
```

不要做页面打开后自动播放。

### 5.4 Audio First 原则

最重要的交互原则：

```text
内容本身就是播放按钮
```

以下内容都应逐步支持点击播放：

```text
字幕句子
词汇
语块
句型
实用句子
例句
迷你对话
Output 示例答案
Review 答案
```

不要让用户先找播放按钮，再播放。学习内容本身应该可以点。

---

## 6. 当前菜单结构

### 6.1 iPhone 底部主菜单

iPhone 底部最多 5 个：

```text
Today 今日
Learn 输入
Practice 内化
Output 输出
Review 复习
```

iPhone 底部不要放：

```text
Library
AI Generate
Audio Backend
Data
Settings
Developer Mode
Smart Process
```

Library 从 Today 或右上入口进入。

### 6.2 Mac 左侧主菜单

Mac 可以保留 6 个：

```text
Today 今日
Library 内容库
Learn 输入
Practice 内化
Output 输出
Review 复习
```

### 6.3 Learn 二级菜单

```text
Listen 听与跟读
Background 背景理解
Language Preview 语言预习
```

不要再把 Shadowing 做成单独主菜单。Shadowing 是 Listen 内部功能。

### 6.4 Practice 二级菜单

```text
Quick Response 快反
Typing 拼写打字
Replacement 替换练习
```

### 6.5 Output 二级菜单

```text
Guided Speaking 半控制表达
Role-play 角色扮演
Retell 复述
```

ChatGPT Voice 只作为辅助：

```text
Copy to ChatGPT Voice
Preview Voice Prompt
```

不要作为 Output 主菜单。

### 6.6 Review 二级菜单

```text
Today Review 今日复习
Chunks 语块复习
Useful Sentences 实用句子复习
Weak / Stuck 易错卡壳
```

Saved 只能作为筛选条件，不作为主菜单。

### 6.7 Library 二级菜单

```text
Courses 课程
Import 导入
```

Courses 下：

```text
Textbook Courses 教材课程
Expansion Packs 拓展训练包
General Topic Packs 自由主题包
```

Import 下：

```text
Audio Import 音频导入
Text Pack Import 文字稿导入
```

---

## 7. 内置 Demo 数据

程序已预装 3 类 Demo Pack，用于验证数据结构和流向，不只是展示内容。

### 7.1 Textbook Course

```text
id: EF_3A_GREAT_BRITAIN
title: English File 3A — Great Britain
level: A2
packType: TEXTBOOK_COURSE
sourceType: Textbook Course
audioMode: Original Audio
importMethod: Audio Import
```

用途：

```text
教材原音频主线
Learn / Listen -> Textbook Audio
Background -> Learn / Background
Language Preview -> Learn / Language Preview
Practice Items -> Practice
Output Tasks -> Output
Review Items -> Review
```

### 7.2 Expansion Pack

```text
id: EXP_3A_MELBOURNE_LIFE
title: Melbourne Life Expansion — What Kevin Likes About Melbourne
level: A2
packType: EXPANSION_PACK
sourceType: Expansion Pack
audioMode: Generated Audio
importMethod: Text Pack Import
parentCourseId: EF_3A_GREAT_BRITAIN
linkedCourseTitle: English File 3A — Great Britain
```

用途：

```text
教材单元拓展训练
必须显示 Linked to: English File 3A — Great Britain
Learn / Listen -> Generated Dialogue
```

### 7.3 General Topic Pack

```text
id: GEN_DOCTOR_APPOINTMENT_A2
title: Doctor Appointment — Talking About Symptoms
level: A2
packType: GENERAL_TOPIC_PACK
sourceType: General Topic Pack
audioMode: Generated Audio
importMethod: Text Pack Import
```

用途：

```text
独立自由主题训练
不要求 Linked Course
Learn / Listen -> Generated Dialogue
```

---

## 8. 数据存储

### 8.1 localStorage keys

当前主要 key：

```text
kevin_english_learning_system_v3
kevin_english_settings_v3
kevin_english_active_user_v1
kevin_english_user_profiles_v1
```

### 8.2 IndexedDB

教材原音频存 IndexedDB：

```text
kevin_english_original_audio_v1
```

原因：

```text
原音频体积大，不能存 localStorage。
V3.1.1 已修复上传后保存图书馆闪退问题。
```

### 8.3 两个本地账户

当前支持 Kevin / Mandy 两个本地账户：

```text
名字可编辑
可设置本地可选密码
课程、复习队列、进度、活动数据相互独立
```

不是复杂认证系统。不要引入复杂登录后端，除非进入未来同步版本。

### 8.4 尚未支持云同步

Mac / iPhone 数据目前仍是本地浏览器数据。

未来推荐方向：

```text
Supabase database: 课程、进度、复习队列、账户数据
Supabase Storage: generated MP3 / original audio references
```

但不是 V3.9.x 的优先级。

---

## 9. OpenAI / Audio 相关

### 9.1 API

```text
api/openai-transcribe.js
  Whisper transcription, word-level timestamps.

api/openai-clean-subtitles.js
  GPT 清理自然句。

api/openai-voice.js
  OpenAI TTS。
```

### 9.2 Settings

Settings 中已有：

```text
OpenAI API Key
TTS voice
按 speaker 选择不同 voice
UI language: English / Chinese
学习文本显示: EN / EN+CN / CN / Hide
Pause seconds
Display size
Export / Import current account data
```

用户要求过：

```text
支持独白、多角色对话的讲话人选择
所有例句和迷你对话都可以点句子播放声音
```

目前 speaker voice 基础已存在，但体验仍可继续打磨。

---

## 10. V3.9.4 已完成重点

V3.9.4 是 Learn 页 Audio First 改造的第一版。

### 10.1 句子列表

当前默认显示：

```text
01
English sentence
Chinese translation
⭐
🔧
```

已经去掉：

```text
Play
Speaker
timestamp
播 / 收 / 调 文字按钮
```

交互：

```text
点击句子 -> 播放该句
⭐ -> 收藏复习
🔧 -> 打开句子工具
```

### 10.2 显示模式

Learn 页面主显示按钮保留：

```text
EN
EN+CN
Hide
```

CN-only 不作为主按钮，放入句子工具 / Settings。

### 10.3 Understand 长句助解

当前已加入 `Understand` 按钮。

初版逻辑在 `buildUnderstandUnits(line)`，目前是轻量启发式拆分：

```text
Meaning Units
Keywords
Chunks
```

下一步可以升级为：

```text
GPT / rule hybrid
存入课程数据
支持中文解释
支持 Add to Practice / Add to Review
```

### 10.4 Shadowing 控制

已加入：

```text
Repeat: 1x / 3x / 5x
Pause: 1s / 2s / 3s / 5s / Manual
```

对应设置：

```text
settings.lineRepeatCount
settings.pauseSeconds
```

### 10.5 删除低价值统计

Learn 页已删除：

```text
字幕句统计
语言点统计
练习任务统计
大进度环
大量状态数字
```

保留：

```text
课程名
当前学习内容
当前句
核心操作
```

---

## 11. 当前 UI / 审美方向

用户明确提出：

```text
需要像 Apple 风格
需要简洁
长期学习阅读不刺眼
需要 Codex 自己提供审美判断
```

当前推荐方向：

### 11.1 色彩

用户认可过的方向：

```text
主文字 / Sidebar 选中背景: #1C1C1A
页面背景: #F5F3EE
卡片背景: #FFFFFF
次级背景 / 输入框: #E8E6DF
辅助文字 / 标签: #888780
完成 / 当前播放高亮: 极淡绿
Again / Need Check: 极淡黄
```

原则：

```text
不要大面积浅绿色
不要高饱和绿色
不要太多彩色标签
不要每个模块一个颜色
不要像后台系统
```

### 11.2 字体层级

建议：

```text
页面大标题: 28px / weight 500
模块标题: 12px / weight 500 / uppercase / letter-spacing 0.08em
Section 标题: 13px / weight 500 / grey
英文学习句: 18px / weight 400 / line-height 1.7
中文翻译: 14px / weight 400 / #888780
卡片标题 / 词汇: 17px / weight 500
Meta 信息: 12px / weight 400 / grey
按钮文字: 14px / weight 500
```

### 11.3 UI 原则

```text
学习内容最大
解释文字最淡
按钮数量少
低频操作进 More
内容本身可点击播放
当前项有轻微高亮，不要厚重边框
不要把页面做成卡片堆
```

### 11.4 用户不喜欢的设计

用户明确批评过：

```text
字幕句编辑器设计错误，没有参考截图
句尾“播放 / 收藏复习 / 微调句子”大按钮很丑
浅绿色背景看着炫眼
过多解释和状态数字影响学习内容
```

后续不要回到这些设计。

---

## 12. 用户上传 / 提到的重要文档

这些文档曾作为产品依据：

```text
/Users/maxli/Desktop/untitled folder/模块定义与具体功能说明.docx
/Users/maxli/Desktop/untitled folder/设计风格、界面与 UI 交互说明.docx
/Users/maxli/Desktop/untitled folder/英语教材音频上传与智能处理技术说明_V1.docx
/Users/maxli/Desktop/untitled folder/Audio Import 与 Text Pack Import 不能混淆.docx
/Users/maxli/Desktop/问题修改要求：.pdf
```

核心结论已经整理进本交接文档。新对话如果需要更细，可以再读原文档。

---

## 13. 当前仍需改进的问题

### 13.1 Learn More / 句子工具还不够优雅

当前 `🔧` 可打开行内工具，但下一步应更像经典播放器 / Apple sheet：

```text
Timing
  Start / End
  -100ms / +100ms
  Play Line
  Save Timing

Structure
  Split Here
  Merge with Next

Text
  Edit English
  Edit Chinese

Reset
  Reset to Original
  Delete
```

要求：

```text
一次显示完整
不要滚动条
不要大黑粗边按钮
不要密集表格感
```

当前 `Reset to Original` 没有原始基线时只提示“暂时没有可恢复的原始版本”。未来若要真正恢复，需要保存 original snapshot。

### 13.2 所有语言内容点击播放还要继续统一

V3.9.4 已经开始做，但还要检查完整覆盖：

```text
Keywords
Chunks
Patterns
Useful Sentences
Examples
Automation sentences
Mini dialogues
Role-play lines
Output sample answers
Review answers
```

目标：

```text
内容文本本身就是播放按钮
小播放图标只作为辅助，不是必需路径
```

### 13.3 Understand 还只是初版

后续建议：

```text
长句自动拆 Meaning Units
中文解释每个意义块
提取 Keywords
提取 Chunks
提取 Pattern
可 Add to Practice
可 Add to Review
缓存结果，避免每次重算
```

### 13.4 Library 文件管理还不够

用户要求过：

```text
编辑课程
创建新文件 / 新文件夹
改名
删除
移动课程文件
课程归类管理
```

当前 Library 已有分类和 Import，但还不是完整文件管理器。

### 13.5 Audio line editor 需要重做审美

用户给过参考截图：

```text
点击单词拆分句子
Timing Start / End ±100ms
Play Line / Save Timing
Split here / Merge next
Edit English / Edit Chinese
Reset / Delete
```

之前实现的字幕句编辑器太像粗糙表格，用户不满意。

未来要做：

```text
轻量 sheet
圆角小按钮
清晰分区
没有粗黑边
单句为核心
移动端也能舒服使用
```

### 13.6 Smart Process 需要继续真实音频回归测试

V3.1.1 已做：

```text
Whisper word-level
GPT clean sentences
sliding-window timestamp alignment
```

但后续每次改 Import 都要检查：

```text
上传音频是否闪退
Smart Process 三步是否正常
字幕是否比 Whisper 原始分句更准确
unaligned 是否橙色提示
保存后 Learn / Practice / Output / Review 是否有内容
Original audio 是否仍存在 IndexedDB
教材原音频是否没有被 TTS 替代
```

### 13.7 Settings 仍可继续简化

Settings 当前功能较多：

```text
账户
备份
语言
OpenAI key
TTS 声音
speaker voices
文本显示
停顿
字体大小
```

后续建议把低频设置折叠，不要让 Settings 像开发面板。

---

## 14. 下一版建议路线

### V3.9.5 Learn Polish + Audio Interaction

优先级最高。建议做：

1. 继续统一所有语言内容点击播放。
2. 优化 `🔧` More 面板视觉，让它像 Apple-style compact sheet。
3. 句子行 hover / active 状态更轻，不要抢内容。
4. Understand 面板更安静，意义块支持播放和收藏。
5. Speaker 默认隐藏，只在 Dialogue Mode / More 中显示。
6. 检查 iPhone 430px：无横向溢出，按钮够大。
7. 减少 Learn 页剩余解释性文字。

### V3.10 Library Content Management

目标：

```text
Library 真正成为内容管理中心
```

建议做：

1. Course edit mode。
2. 新建文件夹 / 新建课程占位。
3. 改名。
4. 删除。
5. 移动课程到分类 / 文件夹。
6. Expansion Pack 显示和编辑 linked course。
7. 操作要简单，不做复杂后台管理。

### V3.11 Audio Segment Editor

目标：

```text
把字幕句微调做成可长期使用的工具
```

建议做：

1. 单句工具 sheet。
2. Start / End 时间微调。
3. Split by word。
4. Merge next。
5. Edit English / Chinese。
6. Reset / Delete。
7. unaligned 橙色 Need Check。
8. 保存后回到 Learn，不打断学习。

### V3.12 Import Preview + Text Pack Parser

目标：

```text
Text Pack Import 更稳定
```

建议做：

1. Required Import Preview Report：

```text
PACK_TYPE
TITLE
SOURCE_TYPE
AUDIO_MODE
IMPORT_METHOD
LINKED_COURSE_TITLE
Items routed to Learn
Items routed to Practice
Items routed to Output
Items routed to Review
Missing Fields
Warnings
```

2. 更稳定解析用户粘贴的 Demo Content Pack。
3. 明确 Expansion Pack / General Topic Pack。
4. Generated Audio Mode 才允许 TTS。

### V4.0 Optional Sync

不是当前优先级。

未来可做：

```text
Supabase Auth / simple user profile
Supabase DB for courses / progress / review
Supabase Storage for audio
Mac/iPhone sync
```

---

## 15. 构建和部署

### 15.1 本地构建

```bash
npm run build
```

当前构建应先执行：

```bash
npm run check:repo
vite build
```

### 15.2 本地运行

```bash
npm run dev -- --host
```

或：

```bash
npm run preview
```

如果沙盒无法启动本地端口，不要卡住，可以先用 production 检查。

### 15.3 部署

已有部署脚本：

```text
/Users/maxli/Documents/Codex/2026-05-24/users-maxli-documents-codex-2026-05/deploy_kevin_english_v3.sh
```

脚本会：

```text
clone GitHub repo 到 /tmp
复制当前项目文件
npm install
npm run build
删除 node_modules
commit
push main
Vercel 自动部署
```

注意：

```text
不要在文档或源码中写 token
每次关键版本更新 package.json / README / APP_VERSION / public/sw.js
```

---

## 16. 每次发布前检查清单

### 16.1 基础检查

```text
npm run build 通过
dist 生成最新 js/css
public/sw.js 缓存版本递增
package.json version 正确
README version 正确
src/main.jsx APP_VERSION 正确
```

### 16.2 产品规则检查

```text
Audio Import 是否仍是 Original Audio Mode
Text Pack Import 是否仍是 Generated Audio Mode
教材原音频是否没有 TTS 替代
无用户点击是否不会播放
Learn / Practice / Output / Review 是否仍可打开
Kevin / Mandy 数据是否仍独立
```

### 16.3 UI 检查

```text
Mac 宽屏无巨大空白或拥挤按钮
iPhone 430px 无横向溢出
底部菜单 iPhone 只保留 5 个学习流程入口
解释文字比学习内容更淡、更小
学习内容最突出
按钮不要大黑粗边
浅绿色不要大面积出现
```

### 16.4 Learn 检查

```text
点击句子可以播放
行尾只有 ⭐ 和 🔧
Understand 可打开
1x / 3x / 5x 可切换
1s / 2s / 3s / 5s / Manual 可切换
EN / EN+CN / Hide 可切换
没有旧的字幕句 / 语言点 / 练习任务统计
```

### 16.5 Production 检查

打开：

```text
https://kevin-audio-memory-app.vercel.app/
```

确认：

```text
页面显示新版本号
JS/CSS 资源为新 hash
Service worker 不是旧缓存
iPhone 视口无横向溢出
```

---

## 17. 已完成版本线索

重要版本：

```text
V3.0.1
  MacBook + iPhone PWA 双端结构。

V3.1
  Audio Import 从上传播放升级为字幕、语言点、Practice、Output、Review 生成。

V3.1.1
  修复 Smart Process：
  Whisper word-level -> GPT 清理自然句 -> 滑动窗口对齐时间轴。
  原始教材音频改存 IndexedDB。

V3.2
  Demo Content Pack 结构化导入。

V3.3
  预装 3 个 Demo Pack。

V3.4
  菜单结构改为 Today / Learn / Practice / Output / Review 主流程。

V3.5
  双本地账户 + 中英文 UI。

V3.5.1
  账户名可编辑，可选本地密码，减少低价值说明。

V3.5.2
  UI 层次优化，学习内容更突出。

V3.6
  Practice / Output 弱项回流 Review。

V3.7
  学习活动追踪和本地备份。

V3.8
  课程 resume memory 和 stage progress。

V3.9.0
  Audio & Content Control Foundation。
  加入音频控制、收藏、句子微调、speaker voice 等基础。

V3.9.2
  用户指出浅绿色背景刺眼，要求更 Apple-like。

V3.9.4
  Learn Audio First Refinement：
  句子点击播放、⭐/🔧、Understand、1x/3x/5x、停顿控制、删除低价值统计。
```

---

## 18. 新对话继续开发的推荐 prompt

可以直接复制以下内容到新对话：

```text
请继续开发 Kevin English Learning System。

项目目录：
/Users/maxli/Documents/Codex/2026-05-16/files-mentioned-by-the-user-spacedreview/KevinAudioMemory_UPLOAD_TO_GITHUB

请先阅读：
DEVELOPMENT_HANDOFF_V3_9_4.md

当前线上版本：
V3.9.4 Learn Audio First Refinement

当前线上地址：
https://kevin-audio-memory-app.vercel.app/

下一步请开发：
V3.9.5 Learn Polish + Audio Interaction

重点：
1. 所有语言内容点击即可播放，包括 keywords、chunks、patterns、useful sentences、examples、mini dialogues。
2. 优化 Learn 里的 🔧 More 工具面板，做成 Apple-like compact sheet，不要粗黑边，不要滚动条。
3. Understand 长句助解继续打磨，意义块可播放、可收藏、可加入练习。
4. 继续减少低价值解释和统计，让学习内容更突出。
5. iPhone 430px 无横向溢出，按钮够大，长期阅读舒服。
6. 不要违反 Audio Import = Original Audio Mode，Text Pack Import = Generated Audio Mode。
```

---

## 19. Codex 下一步工作方式建议

下一次对话开始后，建议 Codex：

1. 先读本文件。
2. 再读 `README.md`。
3. 用 `rg` 定位 Learn / renderLanguageItem / OutputCard / DisplaySwitch / lineMorePanel。
4. 小步改 UI，不要一次大重构。
5. 每改一个版本都运行 `npm run build`。
6. 部署前更新：

```text
src/main.jsx APP_VERSION
package.json version
README.md
public/sw.js cache version
```

7. 部署后检查 production 页面和 iPhone 视口。

---

## 20. 最重要的审美提醒

用户希望 Codex 不只是写代码，还要提供审美判断。

请记住：

```text
学习软件不是后台系统。
不要堆功能按钮。
不要堆统计数字。
不要让解释文字抢过学习内容。
不要让每个功能都变成一个大卡片。

真正重要的是当前句子、当前声音、当前练习、当前输出。
```

设计方向：

```text
Clean
Minimal
Apple-like
Audio First
Content First
Long-study friendly
```

