# 双陆 Shuanglu

A local web prototype of Shuanglu, an ancient Chinese dice-and-race board game reconstruction.

## Commands

```bash
npm install
npm run dev
npm test
npm run build
```

## Architecture

- `src/game`: pure TypeScript rules engine.
- `src/components`: React rendering and interaction components.
- `src/store`: UI state orchestration around the rules engine.
- `tests`: Vitest coverage for core rules.
