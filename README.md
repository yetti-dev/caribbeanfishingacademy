






# Caribbean Fishing Academy Charters




A website factory. Give it a reference URL and an idea. It clones that site's branding,
copy, images and media, then builds a **stunning, unique** site around them with an AI FAQ
widget, and pushes it to a GitHub repo you created.

| Command | What it does |
|---|---|
| **`/check`** | Sub-second preflight: deps, brand sync, content files, image weight, git remote. |
| **`/update`** | Bumps Next.js and every dependency to latest, then proves the build passes. Run this first on a fresh clone. |
| **`/build`** | Project name + reference URL + the idea, and the whole repo becomes that site. Clones brand, copy, images and media, writes the content files, designs every page, wires the FAQ widget. |
| **`/run`** | Builds, fixes every error until green, starts the dev server. |
| **`/ship`** | Force-pushes a clean export to the GitHub repo URL you pass in. |

**No tokens.** No GitHub API, no Vercel API. You create the repo on GitHub, paste the URL,
and import it into Vercel yourself. The only key needed is `OPENAI_API_KEY` for the widget.

## Setup (once)

```bash
npm install
cp .env.example .env     # add OPENAI_API_KEY
```

## Build a site

In Claude Code:

```
/update
/build  acme  https://acme.com   "a bold landing page for Acme's new product"
/run
/ship   https://github.com/you/acme-site.git
```

Or drive the scripts directly:

```bash
npm run clone -- https://acme.com --slug acme   # brand + copy + images, parallel crawl
npm run brand                                   # re-skin from brand.config.ts
npm run up                                      # latest dependencies
npm run ship -- <repo-url> --dry                # preview the push
```

## What every site ships with

- **A real design system.** OKLCH tokens re-skinned from a single hue. Gradients welcome.
- **Copy separated from code.** One typed content file per page in `content/`.
- **Unique, rich UI.** Galleries, carousels, distinctive navbars, bento, marquees, motion.
  lucide icons throughout. Real images, never placeholders.
- **An AI FAQ widget** grounded in `content/knowledge.md`, plus a WhatsApp click-to-chat
  widget when the source site exposes a number.

## The stack

Next.js (App Router / RSC, Webpack not Turbopack) · Tailwind v4 (no `tailwind.config.js`) ·
shadcn/ui · `motion` · lucide-react · OpenAI.

## Layout

```
brand.config.ts          identity, theme hue, fonts, contact
content/                 types.ts · site.ts · home.ts · <page>.ts · knowledge.md  (all copy)
app/                     layout.tsx · page.tsx (blank) · globals.css · api/chat (widget)
components/              magic/ (Reveal, ImageCard, Gallery, Carousel, AutoSlider, Marquee)
                         ui/ (shadcn) · widget/ (faq, whatsapp) · sections/ (built by /build)
lib/                     fonts.ts (generated) · utils.ts
scripts/                 clone · apply-brand · check · ship · update-deps
.scrape/<slug>/          clone output: plan.md, brand.json, pages/*.md  (gitignored)
public/ingested/<slug>/  downloaded images, compressed to <=1600px WebP
.claude/skills/          update · build · run · ship · check · ui-ux-pro-max
CLAUDE.md                the design law
```

See [`CLAUDE.md`](./CLAUDE.md) for the design rules.
