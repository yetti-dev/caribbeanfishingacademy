---
name: update
description: Bring Next.js, React, Tailwind and every other dependency to latest, then prove the build still passes. Run this FIRST on a fresh clone of the starter, before /build. Use for "/update", "update packages", "bump deps".
user-invocable: true
argument-hint: "(no args, add --minor to skip major bumps)"
---

# /update — latest packages, green build

First command in the pipeline. Nothing else runs until this is clean.

## Steps

1. **Look before bumping:**
   ```
   npm run up -- --dry
   ```
   It prints every `current -> latest` and flags **major** jumps. Majors are the only
   ones that break things.

2. **Bump and install:**
   ```
   npm run up
   ```
   Add `-- --minor` if the dry run shows a major you do not want yet (a TypeScript or
   ESLint major mid-project, for example).

3. **Read the Next.js docs for the installed version before fixing anything.** This
   repo tracks Next.js majors that postdate your training data. The real docs ship
   inside the package:
   ```
   ls node_modules/next/dist/docs/
   ```
   Read the relevant guide instead of guessing at APIs.

4. **Prove it:**
   ```
   npm run build
   ```
   Fix every error at the root cause, then re-run until green. Typical fallout from a
   Next or React major: changed async APIs (`params`, `searchParams`, `cookies`),
   moved config keys in `next.config.ts`, stricter types, renamed `lucide-react` icons.

5. **Report** the version table (what moved, which were majors), what you fixed, and
   that the build is green.

## Rules

- Keep `next` and `eslint-config-next` on the **same** version. `npm run up` pins both
  exactly, do not loosen them to a caret.
- **Do not enable Turbopack.** `dev` and `build` pass `--webpack` with a 4GB heap cap on
  purpose: Turbopack leaks uncapped native memory on M-series Macs and can balloon to
  tens of GB. `npm run dev:turbo` exists only to test it deliberately.
- If a major genuinely cannot be made to build, roll that one package back in
  `package.json`, reinstall, say so plainly, and move on. Do not leave the build red.
