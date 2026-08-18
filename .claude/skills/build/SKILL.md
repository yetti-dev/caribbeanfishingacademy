---
name: build
description: Turn a reference URL plus a project name into a complete, stunning website. Clones the source site's branding, copy, images and media, locks a design system, then builds the landing page, every inner page, the content files and the AI FAQ widget. Use for "/build", "build the site", "clone this site".
user-invocable: true
argument-hint: "<project-name> <reference-url> — then describe the idea"
---

# /build — reference URL to a finished site

You own the whole build. Follow `CLAUDE.md`'s design law. Move fast, look designed.

## Step 0 — the brief

Need three things, ask only for what is missing:
1. **Project name** -> the slug (lowercase, hyphenated).
2. **Reference URL** -> the site we are cloning the brand and structure from. Most
   important input.
3. **The idea** -> one paragraph: what we are building and the vibe.

## Step 1 — clone the source (fast, one command)

```
npm run clone -- <reference-url> --slug <slug>
npm run brand
```

Parallel crawl, 12 pages, 60 images, compressed to WebP. Writes `.scrape/<slug>/`:

| file | what it is |
|---|---|
| `plan.md` | the brief: home section order, inner routes, nav, footer, contact |
| `brand.json` | machine-readable plan: hue, logo, fonts, navItems, innerPages, contact |
| `pages/NN-*.md` | **one file per page** — give each page agent only its own file |
| `faq.md` | scraped Q&A, seeds the widget |
| `media.json` | images, videos, YouTube links |

Read `plan.md` and `brand.json`. Then:
- **`logo` is not `favicon`.** The logo is the navbar/footer mark, put it in both. The
  favicon is the browser tab only. If `logo` is null and `logoNote` says inline svg,
  recreate the mark in `components/icons.tsx`.
- **`sectionOrder`** is the chronology to mirror on the landing page.
- **`innerPages` / `navItems` / `footerItems`** each become a real route. Never ship a
  one-page site when the source has more.
- **`contact`** drives the WhatsApp widget and the map section.
- Fewer than ~30 images back? Top up with Unsplash / Pexels and verify the URLs resolve.
- Wrong hue or fonts? Fix `brand.config.ts`, re-run `npm run brand`.

Tuning: `--pages N`, `--images N`, `--no-apply` (skip patching `brand.config.ts`).

## Step 2 — lock the design system (before any UI)

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" \
  --design-system -p "<Project Name>" --stack nextjs
```

Its palette drives the hue, its font pairing drives `--font-display`, its style and UX
rules drive layout. Sliders: `--variance` (layout novelty), `--motion`, `--density`.
Where it conflicts with `CLAUDE.md`, the design law wins. Decide once here, then build.
Reskinning halfway through is the biggest time sink there is.

## Step 3 — content files first, then components

**Copy never lives in JSX.** Write the typed content files, then render them:

- `content/site.ts` — nav, footer groups, global CTA (from `navItems` / `footerItems`).
- `content/home.ts` — home copy in the source's section order.
- `content/<page>.ts` — one file per inner page, matching its `pages/NN-*.md`.
- `content/types.ts` — shared primitives. Extend it if a section needs a new shape.

Components import the typed object and render it. A component with a hardcoded headline
is a bug. Sharpen the scraped copy, do not paste it verbatim, and no em or en dashes.

## Step 4 — build the site

Author `app/page.tsx` + `components/sections/*` (the starter ships no sections, they are
yours to write), then one `app/<path>/page.tsx` per inner page. Every page: real navbar
and footer, `metadata`, one `<h1>`, real images, 2-4 real sections, a CTA. Same polish
bar on inner pages as home, never a stub.

Non-negotiables live in `CLAUDE.md`: layout variety (no grid/grid/grid), distinctive
navbar, `ImageCard` for image+text (never a text-over-photo scrim), lucide icons only,
**<=10 `next/image` per page with exactly one `priority`**, bulk images through
`Gallery`/`Carousel`, staggered short motion, `cursor-pointer` + hover + focus-visible on
everything interactive, readable contrast, no aurora or grid pattern in the hero, no
all-caps headings.

Reuse `components/magic/*` primitives (`Reveal`, `ImageCard`, `Gallery`, `Carousel`,
`AutoSlider`, `Marquee`, `BorderBeam`) instead of authoring new ones.

**Parallelize.** Once the design spec and shared chrome exist, fan out the inner pages:
one `page-smith` agent per route, all in a single message, each given only its own
`pages/NN-*.md` and the design spec. Run `widget-smith` in the same message. Finish with
`build-fixer`.

## Step 5 — widgets

- **FAQ widget** is mounted globally and answers from `content/knowledge.md` (the clone
  seeds it). Refine the knowledge and the greeting in `components/widget/faq-widget.tsx`.
- **WhatsApp widget** is mounted globally and renders only when `brand.contact.whatsapp`
  is set. If the source exposed a number, confirm it shows and links correctly.
- **Map section**: if `brand.contact.address` / `mapQuery` exists, build a location
  section and place it where the source places it.

## Step 6 — hand off

Run `/run` to clear build errors and boot the dev server. Tell the colleague what you
built and that `/ship` is next.

## Checklist

- [ ] `npm run clone` done, `plan.md` read, `npm run brand` run
- [ ] `ui-ux-pro-max --design-system` queried, its palette/fonts/style drive the build
- [ ] All copy in `content/*.ts`, nothing hardcoded in components
- [ ] Real logo in navbar AND footer (not the favicon)
- [ ] Home sections follow the source `sectionOrder`
- [ ] Every `innerPages` / `navItems` entry is a real, fully built route
- [ ] Layout variety, distinctive navbar, `ImageCard` for image+text
- [ ] <=10 `next/image` per page, one `priority`, bulk images in `Gallery`/`Carousel`
- [ ] Real images everywhere, no colored-box placeholders, lucide icons only
- [ ] `cursor-pointer` + hover + focus-visible on every interactive element
- [ ] No em or en dashes anywhere in copy, headings, buttons, alt text, metadata
- [ ] WhatsApp widget shows when a number exists, map section when an address exists
- [ ] `content/knowledge.md` reflects the brand
- [ ] `/run` passes and the dev server boots
