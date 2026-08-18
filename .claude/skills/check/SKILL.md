---
name: check
description: Sub-second preflight for the factory — node, deps, brand sync, content files, image weight, .env, git remote, skills. Use for "/check", "status", "are we ready".
user-invocable: true
argument-hint: "(no args)"
---

# /check — preflight

```
npm run check
```

Files only, no network, no build. Reports node and `node_modules`, whether
`brand.config.ts` is real or still placeholder, whether `globals.css` and `lib/fonts.ts`
are in sync with it (`npm run brand` fixes drift), whether copy is split into
`content/*.ts`, the scraped image count and any file over 400KB, `OPENAI_API_KEY`, the git
branch and `origin`, and that the five skills plus `CLAUDE.md` are present.

`x` = blocker, exit 1. `!` = warning, safe to build. `v` = good.

Flow: `/check` -> `/update` -> `/build` -> `/run` -> `/ship`.
