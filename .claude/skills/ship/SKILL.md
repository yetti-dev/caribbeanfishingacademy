---
name: ship
description: Push the finished site to a GitHub repo the user created, with the factory tooling stripped out. No tokens, no GitHub API, no Vercel automation. Use for "/ship", "push it", "deploy".
user-invocable: true
argument-hint: "<github-repo-url> (or nothing, to reuse origin)"
---

# /ship — push to the repo, nothing more

No tokens are involved. The user creates the repo on GitHub and imports it into Vercel
themselves. Your job is the push.

## Preflight

1. **Build is green AND the stylesheet verified.** Run `/run` first, which ends with
   `npm run verify`. An unstyled production site almost always traces back to shipping a
   build nobody verified.
2. **Repo URL.** Ask for it if it was not given:
   > Create the empty repo on GitHub, then paste the URL.
   Accepts `https://github.com/you/repo.git` or `git@github.com:you/repo.git`.

## Push

```
npm run ship -- <repo-url> --dry   # show every step, no side effects
npm run ship -- <repo-url>         # for real
npm run ship                       # reuses the existing origin
```

It commits local work, sets `origin`, then **force-pushes a clean export** with the
factory tooling stripped from the pushed copy: `.claude/`, `scripts/`, `.scrape/`,
`CLAUDE.md`, `AGENTS.md`, plus the factory-only npm scripts in `package.json`. The local
repo, files, and history are untouched. Safe to re-run.

The push is a **force-push to `main`**. That is intentional (the export is a fresh tree),
so confirm with the user before shipping to a repo that already holds work they care
about.

## After

Tell the user, in this order:
1. The repo URL, pushed.
2. Import it at `vercel.com/new` with these settings, and no others:
   - Framework preset **Next.js** (not "Other", which serves the repo as static files and
     is a classic cause of a site loading with no CSS).
   - Root directory: the repo root. Build command and output directory: leave **default**.
   - Do **not** set `NODE_ENV` as a project environment variable. Setting it to
     `production` makes Vercel skip devDependencies.
3. Add `OPENAI_API_KEY` in the project's environment variables, or the FAQ widget cannot
   answer.
4. Attach the domain in the dashboard.

## Troubleshooting

- `push failed` with an auth error -> their git credentials cannot write to that remote.
  They fix it with `gh auth login` or an SSH key. Do not ask for a token.
- `no commits yet` -> nothing was committed, commit and re-run.
- Remote already has commits -> the force-push replaces them. Confirm first.
- **Deployed site renders with no CSS.** Work down this list:
  1. Framework preset is "Other" instead of Next.js, or a custom output directory is set.
  2. `NODE_ENV=production` is set on the Vercel project, so devDependencies were skipped.
     `tailwindcss`, `@tailwindcss/postcss`, and `typescript` live in `dependencies` here
     precisely so this cannot break the CSS, and `npm run ship` refuses to push if anyone
     moves them back.
  3. Utilities were purged: a directory holding class names is not covered by the
     `@source` globs at the top of `app/globals.css`, or it is gitignored.
  4. A stale tree was pushed because the local commit silently failed. `npm run ship`
     now aborts instead. Confirm the deployed commit matches your HEAD.
  Reproduce it locally before touching Vercel:
  `rm -rf .next && NODE_ENV=production npm ci && npm run build && npm run verify`.
