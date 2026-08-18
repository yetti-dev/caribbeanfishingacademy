---
name: run
description: Build the app, fix every build and runtime error until clean, then start the dev server. Use for "/run", "run the app", "fix the build", before shipping.
user-invocable: true
argument-hint: "(no args)"
---

# /run — green build, live dev server

Do not stop at the first error. Loop until green.

1. **Build:**
   ```
   npm run build
   ```
2. **If it fails,** fix the root cause and re-run. Repeat until it passes. Usual causes:
   - `"use client"` missing on a component using state, effects, or motion.
   - A server-only module imported into a client component.
   - A `lucide-react` icon name that does not exist.
   - An image `src` pointing at a file that was never downloaded.
   - More than 10 `next/image` on one page, or more than one `priority`.
   - An API that changed in this Next.js major. Read
     `node_modules/next/dist/docs/` for the installed version, do not guess.
   - Unresolved `@/...` imports: `typescript` must stay in `dependencies`, Next reads
     tsconfig `paths` through it.
3. **Prove the stylesheet shipped:**
   ```
   npm run verify
   ```
   A green build can still emit a purged or missing stylesheet, which is exactly how a
   deploy ends up rendering unstyled. This asserts the CSS exists, is not just the reset,
   and that every prerendered page links it. Never hand off to `/ship` without it.
4. **Start the dev server (required):**
   ```
   npm run dev
   ```
   Background it, it is long-running. Wait for "Ready", confirm
   `curl -sI localhost:3000` returns 200, check the home page and one inner page render
   and the FAQ widget opens. Leave it running and give the URL.
5. **Report:** build green, dev server URL, what you changed, any warning worth knowing
   before `/ship`.

## Rules

- Fix causes, not symptoms. No `any` or `@ts-ignore` to silence a real error, and if you
  ever must, say so.
- The build must pass before `/ship`.
