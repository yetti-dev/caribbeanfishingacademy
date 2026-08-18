# CLAUDE.md — how to build in this repo

This repo is a **website factory**. Someone gives an idea, a reference URL, and a project
name. We clone that site's branding, copy and media, build a **stunning, unique** site
around it with an AI FAQ widget, then push it to a GitHub repo they created.

Five commands, in order:

- **`/check`** — sub-second preflight.
- **`/update`** — bring Next.js and every dependency to latest, prove the build passes.
  **Run this first on a fresh clone.**
- **`/build`** — idea + URL + project name, and the whole repo becomes their site.
- **`/run`** — build, fix every error until green, start the dev server.
- **`/ship`** — force-push a clean export to the GitHub repo URL they give you.

**No tokens anywhere.** No GitHub API, no Vercel API, no `GITHUB_TOKEN`, no `VERCEL_TOKEN`.
The user creates the repo, pastes the URL, and imports it into Vercel by hand. The only key
in `.env` is `OPENAI_API_KEY` for the FAQ widget.

**The starter ships blank.** `app/page.tsx` is an empty canvas, `components/sections/` does
not exist, `brand.config.ts` holds neutral placeholders, `content/*.ts` is empty scaffolding.
`/build` authors all of it. The blank starter is the reset, there is no clean command.

**`/build` is agentic.** It orchestrates `.claude/agents/`: `site-scraper` ->
`design-director` -> parallel (`section-smith` + `widget-smith` + one `page-smith` per inner
page) -> `build-fixer`. Fan out independent work in one message. Agents return
caveman-compressed output. Keep responses lean.

---

## The stack (don't fight it)

Next.js (App Router, RSC) · Tailwind v4 (CSS-first `@theme`, **no tailwind.config.js**, tokens
in `app/globals.css`) · shadcn/ui (`npm run ui -- <name>`) · `motion` for animation ·
**`lucide-react` for every icon** · OpenAI for the FAQ widget.

**This is not the Next.js in your training data.** Read
`node_modules/next/dist/docs/` for the installed version before writing anything unfamiliar.

**Dev and build run on Webpack, not Turbopack.** `npm run dev` and `npm run build` pass
`--webpack` with a 4GB heap cap. Turbopack leaks uncapped native memory on M-series Macs and
can grow to tens of GB (vercel/next.js#93896); the Webpack path peaks near 500MB.
`npm run dev:turbo` is the deliberate escape hatch. Do not make it the default.

**Two sources of truth, and they are separate:**
- `brand.config.ts` — name, hue, corners, fonts, domain, socials, contact. UI and metadata
  import it; `npm run brand` syncs the build-time surfaces. Never hardcode the name, brand
  color, or domain in a component.
- `content/*.ts` — **all page copy**, one typed file per page (`home.ts`, `about.ts`, ...)
  plus `site.ts` for nav and footer, typed against `content/types.ts`. A component with a
  hardcoded headline is a bug.

---

## Design law — make it look designed, not generated

A visitor should ask "who made this?", never "which AI made this?". Average is invisible.
Have a point of view and commit to it.

### 0. Absolute bans (these come from real failures)
- **No em dashes or en dashes (— –) in any user-facing copy.** Use a period, comma, colon,
  or parentheses. Applies to headings, body, buttons, alt text, metadata, `knowledge.md`.
- **No text over a photo behind a dark gradient scrim.** Unreadable and cheap. Image in its
  own area, text BELOW on a solid surface. Use `components/magic/image-card.tsx` (`ImageCard`).
- **No unreadable contrast.** Body text clears ~4.5:1. Never dark text on a dark or saturated
  surface or a busy image. On a colored/photo panel, put text on `bg-card`/`bg-background`
  or invert to a light token.
- **The favicon is not the logo.** The logo is the branded mark in navbar and footer
  (`brand.json` -> `logo`). The favicon is a tab icon only.
- **No grid-grid-grid.** Do not stack three `md:grid-cols-3` sections in a row.
- **No `AuroraBackground` or `GridPattern` in the hero, ever.** Biggest "AI made this" tell.
  Build hero atmosphere from a real image, a color block, a border or texture, or a custom
  shape. They are fine sparingly behind a mid-page CTA.
- **No full-capital-letter headings.** No `uppercase` on `h1`/`h2`/`h3`. Reserve
  `uppercase tracking-[0.2em]` for small eyebrow labels only.

### 1. Color
Drive everything from the semantic tokens (`bg-primary`, `text-foreground`,
`text-muted-foreground`, `bg-card`, `border-border`, `bg-accent`) so the site re-skins from
one OKLCH hue. **Gradients and gradient text are encouraged** (`text-gradient`, mesh
backgrounds, gradient borders) as punctuation, not as a coat of paint. Have one dominant
color and use it with conviction: a saturated hero, a color-blocked section, a dark section
for contrast. Sites that whisper in grey read as templates.

### 2. Typography
Headings `--font-display`, body `--font-sans`, labels `font-mono`. **Do not default to
Inter/Geist/Roboto for headings** (reach for Space Grotesk, Fraunces, Instrument Serif, Sora,
Bricolage Grotesque, General Sans). Hero `text-6xl`–`text-8xl`, `font-bold`,
`tracking-tight`, `text-balance`, `leading-[0.95]`. Section heads `text-4xl`–`text-5xl`. Body
`text-base`–`text-lg` `leading-relaxed`. A small tracked mono eyebrow above section heads is
a good recurring motif. Never a flat 16px wall.

### 3. Structure — mirror the source, vary the layout
- **Follow the source site's chronology** (`brand.json` -> `sectionOrder`). Lead with what
  they lead with, then make it better. 6+ distinct sections on home.
- **Build every inner page** the clone found (`innerPages`, `navItems`, `footerItems`). One
  real route each, with navbar, footer, metadata, real images, 2-4 sections, a CTA. Never
  ship a one-page site when the source has more, and never a thin stub.
- **Vary the layout.** Grids where a grid is right, then break the rhythm:
  `AutoSlider` (`components/magic/auto-slider.tsx`), `Marquee`, `Carousel`, `Gallery` with
  lightbox, bento with varied cells, alternating image/text rows, sticky scroll.
- **A distinctive navbar**, not logo-left + centered-links + button-right. Pill/floating,
  split, mega-menu, or a bordered editorial header. Scroll state, real mobile sheet, real logo.
- **Cards, authored not stock.** No row of identical `rounded-xl border p-6` boxes. Vary
  sizes, add a featured card, an image bleed, a number or eyebrow. Reserve `BorderBeam` for
  one element.

### 4. Icons
Every icon from `lucide-react`; brand glyphs in `components/icons.tsx`. No emoji-as-icons,
no stray SVGs. Icon-only buttons get `aria-label`.

### 5. Images — never empty, never colored boxes, never unbounded
- **A site without imagery is a bug.** Colored `<div>` placeholders are forbidden.
- `npm run clone` downloads up to 60 real images to `public/ingested/<slug>/`, already
  resized to <=1600px WebP. Use them in the hero, galleries, sliders, sections.
- Thin scrape or greenfield: use **Unsplash or Pexels** and verify the URLs resolve
  (`https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=1600&q=80`). Prefer fewer
  real photos over many guessed ones. Pull the source's videos and YouTube links too.
- Meaningful `alt` text in the brand voice.

#### Image performance — HARD RULES (breaking these crashes the build)
1. **<=10 images per page rendered with `next/image`.** Does not apply to images inside
   `Gallery` or `Carousel` (plain lazy `<img>`, so a 50-image gallery is fine), or when the
   user explicitly asks for more standalone images. If a layout needs many images, it is a
   gallery.
2. **Compress at the source.** Nothing over ~400KB in `public/`. `npm run clone` handles it;
   hand-added images go through the same treatment.
3. **`next/image` discipline** for those <=10: always set `sizes` and explicit
   `width`/`height` (or `fill` + a sized parent), `quality={70}`–`{80}`, and exactly **one**
   `priority` per page (the hero).
4. **Bulk imagery -> plain lazy `<img>`** (`loading="lazy" decoding="async"`) via
   `Gallery`/`Carousel`, never 50 `next/image` tags. This is the rule that prevents the
   "100-image repo won't compile" failure. One colleague rendered ~100 unbounded images and
   the dev server collapsed before it could compile.

### 6. Motion
Wrap entering content in `Reveal`/`RevealGroup`, stagger children 50-80ms, keep durations
300-500ms ease-out. **Banned:** everything fading up in unison, the same `whileInView` on
every block, 1s+ floaty fades, looping pulse on static content, gratuitous parallax. Animate
on purpose: a hero word reveal, a stat count-up, a logo marquee, hover micro-interactions.
All motion respects `prefers-reduced-motion` (the wrappers do, keep it that way).

### 7. Interaction
**Everything clickable shows `cursor-pointer`** (buttons, links, cards-as-links, tabs,
carousel controls). Disabled -> `cursor-not-allowed`. Every interactive element gets a visible
hover AND `focus-visible:ring`: buttons lift or shift background, cards
`hover:-translate-y-1 hover:shadow-lg`, links move, with `transition` `duration-200`–`300`
`ease-out`.

### 8. Copy
No "Welcome to our platform" or "Empower your workflow". Concrete outcomes, real verbs. Pull
from the per-page scrape files (`.scrape/<slug>/pages/*.md`) and sharpen them. Copy goes in
`content/*.ts`, never in JSX.

### 9. Widgets and contact
- **FAQ widget** (`components/widget/faq-widget.tsx`) is mounted globally and answers from
  `content/knowledge.md`. Always wired. Bottom-right.
- **WhatsApp widget** (`components/widget/whatsapp-widget.tsx`) is mounted globally and
  renders only when `brand.contact.whatsapp` is set. Bottom-left. If the source exposes a
  number, it must appear.
- **Map / location**: when `brand.contact.address`/`mapQuery` is set, build
  `components/sections/map.tsx` and place it where the source places its location.

### 10. Accessibility
One `<h1>` per page. Real landmarks (`main`/`nav`/`footer`/`section`). Labeled icon buttons.
Decorative layers `aria-hidden`. Keep contrast (no `text-muted-foreground` on `bg-muted`).

---

## Conventions

- `"use client"` only for state, effects, or motion. Default to Server Components.
- Class merging: `cn()` from `@/lib/utils`. Named exports, PascalCase files in
  `components/{sections,ui,magic,widget}`.
- Design decisions come from the **`ui-ux-pro-max`** skill (local design DB: styles,
  palettes, font pairings, product types, UX rules, motion). Query it before writing UI:
  ```bash
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <style|color|typography|landing|product|ux|icons|gsap|chart|web> -n 3
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry>" --design-system -p "Name" --stack nextjs
  ```
  Where it conflicts with the bans above, the bans win.
- Always finish with `/run` before `/ship`. `/run` ends with `npm run verify`, which
  asserts the build emitted a real stylesheet and every page links it. A green build can
  still ship unstyled.
- **Never move `tailwindcss`, `@tailwindcss/postcss`, or `typescript` into
  `devDependencies`.** A Vercel project with `NODE_ENV=production` skips devDependencies,
  and the deploy then fails on unresolved `@/` imports or renders with no CSS. `npm run
  ship` refuses to push if they are misplaced.
- Class names must be literal. `bg-primary` is scanned, `` `bg-${color}` `` is not and gets
  purged. Keep a lookup object of complete class strings instead. The `@source` globs at
  the top of `app/globals.css` declare every directory that gets scanned; add one if you
  put class names somewhere new.

## Commands

`npm run clone -- <url> --slug <s>` (scrape brand + copy + images) · `npm run brand` (sync
theme/fonts) · `npm run up` (latest deps) · `npm run check` (preflight) ·
`npm run ui -- <c>` (add shadcn) · `npm run dev` / `npm run build` ·
`npm run ship -- <repo-url>` (push clean export).

## Layout

```
app/           layout.tsx, page.tsx (blank), globals.css (tokens), api/chat (FAQ)
components/    magic/ (Reveal, ImageCard, Gallery, Carousel, AutoSlider, Marquee, BorderBeam)
               ui/ (shadcn) · widget/ (faq, whatsapp) · sections/ (yours to author)
content/       types.ts · site.ts · home.ts · <page>.ts · knowledge.md
lib/           fonts.ts (generated by npm run brand) · utils.ts
scripts/       clone.mjs · apply-brand.mjs · check.mjs · ship.mjs · update-deps.mjs
.scrape/<slug>/  clone output (gitignored, never pushed)
```
