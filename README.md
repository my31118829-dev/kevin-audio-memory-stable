# Kevin Audio Memory Stable (V3.9.4)

Stable = daily learning version.

This repository is locked to the V3.9.4 Audio First baseline for daily use.

## Rules
Allowed:
- Critical bug fixes
- Run/deploy fixes
- Audio import/playback/save fixes
- Obvious UI alignment fixes

Not allowed:
- Large feature additions
- Flow refactor
- Experimental AI modules
- Complex dashboard/reporting expansion

## Local
```bash
npm install
npm run dev
```
Default: http://localhost:5181/

## Deploy (Vercel)
- Framework: Vite
- Build Command: npm run build
- Output Directory: dist
- Env: OPENAI_API_KEY
