<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project conventions

**Read [`CLAUDE.md`](./CLAUDE.md) before writing any UI.** This repo is a website factory
driven by five commands in `.claude/skills/`:

- **`/check`** preflight · **`/update`** latest deps + green build (run first on a fresh
  clone) · **`/build`** idea + reference URL to a full site · **`/run`** fix every error and
  start the dev server · **`/ship`** force-push a clean export to a GitHub repo URL you pass in.

No GitHub or Vercel tokens are used. You create the repo and import it into Vercel yourself.

Two sources of truth: `brand.config.ts` (identity, theme, contact) and `content/*.ts` (all
page copy, one typed file per page). Never hardcode copy, the brand name, or the hue in a
component.

Design law lives in CLAUDE.md. Short version: unique layouts, real images (never colored
boxes), lucide icons only, `ImageCard` for image+text (never a text-over-photo scrim), no em
or en dashes in copy, <=10 `next/image` per page.
