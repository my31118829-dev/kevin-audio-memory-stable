# Kevin Audio Memory Stable

Stable = daily learning version.

This repository is the long-term stable branch of Kevin Audio Memory for daily iPhone learning.

## Positioning
- Audio First learning workflow
- Stable and simple daily usage
- No experimental feature expansion

## Maintenance Rules (Strict)
Allowed:
- Fix critical bugs
- Fix run failures
- Fix audio upload / playback / save issues
- Fix obvious UI layout issues

Not allowed:
- Large feature additions
- Training flow refactor
- Large UI redesign
- Experimental AI modules
- Complex reporting / dashboard expansion

## Local Run

```bash
npm install
npm run dev
```

Default local URL:
- http://localhost:5181/

## Deploy (Vercel)
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Required env:
  - `OPENAI_API_KEY`

## Notes
- This repo should stay stable for real learning use.
- New ideas must be implemented in `kevin-english-dev` first.
