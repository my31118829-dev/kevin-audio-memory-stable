# Kevin Audio Memory Stable

Stable baseline: 2026-05-22 dialogue-focused upgrade (commit 0cb82c0 source line).

This is the long-term daily-learning version.

## What this stable baseline includes
- Learn quick entry for: Chunks / Sentences / Patterns / Mini Dialogues
- Recall flow: CN prompt -> self speak -> Show English -> Again / Good
- Mini Dialogue with Listen All
- Audio playback auto-filters role labels (A:/B:/Kevin:/Waitress:)
- Role-play with configurable pause options (2s/4s/6s/10s)

## Stable rules
Allowed:
- Critical bug fixes
- Run/deploy fixes
- Audio import/playback/save fixes
- Obvious UI alignment fixes

Not allowed:
- Large feature additions
- Flow refactor
- Experimental AI modules

## Local run
```bash
npm install
npm run dev
```
Default: http://localhost:5181/

## Deploy (Vercel)
- Framework: Vite
- Build command: npm run build
- Output directory: dist
- Env: OPENAI_API_KEY
