"use client";

/**
 * Section picker. Browse the catalogue, tick what the site needs, reorder it,
 * preview it as one page, then copy a prompt that names every chosen section by
 * code so a build agent can resolve it to an import without guessing.
 *
 * Three details that are easy to get wrong:
 *
 * 1. NO overflow-hidden on a section frame. Several navbars open a dropdown that
 *    escapes their own box; clipping the frame silently swallows it. Frames use
 *    a ring instead of a border-with-clip, and the header reserves room below.
 *
 * 2. Sticky chrome is neutralised in preview. A sticky navbar inside a scrolling
 *    preview column re-sticks to the column, so it floats mid-page. Preview
 *    renders those entries in a wrapper that cancels the stick.
 *
 * 3. Live theme needs more than a hue. At a fixed lightness the button label
 *    drops under 4.5:1 for most hues, so each swatch carries a solved --primary
 *    lightness from scripts/lib/color.mjs.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Check, ChevronDown, ClipboardCheck, Copy, Eye, LayoutList, Palette,
  PanelRightClose, PanelRightOpen, Trash2, ArrowUp, ArrowDown, X,
} from "lucide-react";
import { CATALOG, CATEGORIES, type CatalogEntry } from "@/components/sections/catalog";
import { cn } from "@/lib/utils";

type Swatch = { name: string; hue: number; primaryL: number; fgL: number; borderL: number; hex: string };

/** Solved by scripts/lib/color.mjs; every entry measured at >= 4.5:1. */
const SWATCHES: Swatch[] = [
  { name: "Violet", hue: 265, primaryL: 0.57, fgL: 0.99, borderL: 0.87, hex: "#3b6beb" },
  { name: "Ocean", hue: 232, primaryL: 0.53, fgL: 0.99, borderL: 0.87, hex: "#0078c9" },
  { name: "Teal", hue: 195, primaryL: 0.5, fgL: 0.99, borderL: 0.87, hex: "#008186" },
  { name: "Emerald", hue: 160, primaryL: 0.51, fgL: 0.99, borderL: 0.87, hex: "#008539" },
  { name: "Lime", hue: 128, primaryL: 0.54, fgL: 0.99, borderL: 0.87, hex: "#4b8100" },
  { name: "Amber", hue: 75, primaryL: 0.56, fgL: 0.99, borderL: 0.87, hex: "#b55900" },
  { name: "Orange", hue: 45, primaryL: 0.57, fgL: 0.99, borderL: 0.87, hex: "#d03e00" },
  { name: "Crimson", hue: 22, primaryL: 0.58, fgL: 0.99, borderL: 0.87, hex: "#d73240" },
  { name: "Magenta", hue: 340, primaryL: 0.58, fgL: 0.99, borderL: 0.87, hex: "#c13b9f" },
  { name: "Indigo", hue: 285, primaryL: 0.57, fgL: 0.99, borderL: 0.87, hex: "#715ce6" },
];

const STORE = "section-picker-v1";
type View = "browse" | "split" | "preview";

const themeVars = (s: Swatch) =>
  ({
    "--brand-hue": String(s.hue),
    "--primary": `oklch(${s.primaryL} 0.2 ${s.hue})`,
    "--primary-foreground": `oklch(${s.fgL} 0.01 ${s.hue})`,
    "--border": `oklch(${s.borderL} 0.01 ${s.hue})`,
    "--input": `oklch(${s.borderL} 0.01 ${s.hue})`,
  }) as React.CSSProperties;

/** Cancel sticky positioning so nav chrome does not float inside a preview column. */
function Unstick({ on, children }: { on?: boolean; children: React.ReactNode }) {
  return on ? <div className="[&_.sticky]:static [&_.sticky]:top-auto">{children}</div> : <>{children}</>;
}

/* ── prompt ───────────────────────────────────────────────────────────────── */

function buildPrompt(picked: CatalogEntry[], swatch: Swatch) {
  const lines = [
    "Build the site using the sections I already picked. Do not invent new section layouts.",
    "",
    `Primary colour: OKLCH hue ${swatch.hue} (${swatch.name}). Set brand.config.ts theme.hue to ${swatch.hue} and run \`npm run brand\`.`,
    "",
    `Page order, top to bottom (${picked.length} sections):`,
    "",
  ];
  picked.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.code}  ${p.component}  (${p.category}: ${p.label})`);
    lines.push(`   import { ${p.component} } from "@/${p.file.replace(/\.tsx$/, "")}";`);
    lines.push(`   props: ${p.props}`);
  });
  lines.push(
    "",
    "Rules:",
    "- Write all copy into content/*.ts typed against content/types.ts. No copy in JSX.",
    "- Pass real images from public/ingested/<slug>/ once the clone has run.",
    "- Keep the section order above exactly.",
    "- Upgrade only the hero to next/image with priority; leave the rest as lazy img.",
    "- No em dashes or en dashes anywhere in the copy.",
  );
  return lines.join("\n");
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export function SectionsShowcase() {
  const [swatch, setSwatch] = useState<Swatch>(SWATCHES[0]);
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c, true])),
  );
  const [view, setView] = useState<View>("browse");
  const [copied, setCopied] = useState(false);

  // Restore a selection across reloads; picking twenty sections is real work.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const s = JSON.parse(raw) as { picked?: string[]; hue?: number };
      if (Array.isArray(s.picked)) setPicked(s.picked.filter((c) => CATALOG.some((e) => e.code === c)));
      const hit = SWATCHES.find((x) => x.hue === s.hue);
      if (hit) setSwatch(hit);
    } catch { /* ignore a corrupt entry */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ picked, hue: swatch.hue })); } catch { /* quota */ }
  }, [picked, swatch]);

  const pickedEntries = useMemo(
    () => picked.map((c) => CATALOG.find((e) => e.code === c)).filter(Boolean) as CatalogEntry[],
    [picked],
  );

  const toggle = (code: string) =>
    setPicked((p) => (p.includes(code) ? p.filter((c) => c !== code) : [...p, code]));
  const move = (i: number, dir: -1 | 1) =>
    setPicked((p) => {
      const j = i + dir;
      if (j < 0 || j >= p.length) return p;
      const next = [...p];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(buildPrompt(pickedEntries, swatch));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked, the textarea below is the fallback */ }
  };

  const viewBtn = (v: View, label: string, icon: React.ReactNode) => (
    <button
      key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none",
        view === v ? "bg-zinc-800 text-white" : "text-zinc-600 hover:bg-zinc-200",
      )}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header. overflow stays visible so nested dropdowns can escape. */}
      <header className="sticky top-0 z-90 border-b border-zinc-300 bg-zinc-50/95 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <LayoutList aria-hidden className="size-5 text-zinc-500" />
            <span className="font-display text-base font-bold tracking-tight text-zinc-800">Section picker</span>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 font-mono text-[11px] text-zinc-600">
              {picked.length}/{CATALOG.length}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-zinc-200/70 p-1">
            {viewBtn("browse", "Browse", <LayoutList aria-hidden className="size-3.5" />)}
            {viewBtn("split", "Split", <PanelRightOpen aria-hidden className="size-3.5" />)}
            {viewBtn("preview", "Preview", <Eye aria-hidden className="size-3.5" />)}
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <Palette aria-hidden className="size-4 text-zinc-500" />
            <div role="radiogroup" aria-label="Primary colour" className="flex flex-wrap gap-1.5">
              {SWATCHES.map((s) => (
                <button
                  key={s.name} type="button" role="radio" aria-checked={s.name === swatch.name}
                  onClick={() => setSwatch(s)} title={`${s.name} (hue ${s.hue})`}
                  style={{ backgroundColor: s.hex }}
                  className={cn(
                    "grid size-6 cursor-pointer place-items-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:outline-none",
                    s.name === swatch.name && "ring-2 ring-zinc-800 ring-offset-2",
                  )}
                >
                  {s.name === swatch.name ? <Check aria-hidden className="size-3.5 text-white" /> : null}
                  <span className="sr-only">{s.name}</span>
                </button>
              ))}
            </div>

            <button
              type="button" onClick={copyPrompt} disabled={!picked.length}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {copied ? <ClipboardCheck aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
              {copied ? "Copied" : "Copy prompt"}
            </button>
          </div>
        </div>
      </header>

      <div className={cn("flex", view === "split" && "lg:h-[calc(100vh-61px)]")}>
        {/* ── selector ─────────────────────────────────────────────────────── */}
        {view !== "preview" ? (
          <aside
            className={cn(
              "shrink-0 border-r border-zinc-300 bg-zinc-50",
              view === "split" ? "w-full max-w-sm overflow-y-auto lg:w-80" : "hidden lg:block lg:w-80 lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:overflow-y-auto",
            )}
          >
            {picked.length ? (
              <div className="border-b border-zinc-300 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Page order</h2>
                  <button type="button" onClick={() => setPicked([])} className="flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                    <Trash2 aria-hidden className="size-3" /> Clear
                  </button>
                </div>
                <ol className="mt-3 space-y-1.5">
                  {pickedEntries.map((e, i) => (
                    <li key={e.code} className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1.5 ring-1 ring-zinc-200">
                      <span className="font-mono text-[10px] text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-mono text-[11px] font-semibold text-zinc-700">{e.code}</span>
                      <span className="ml-auto flex items-center gap-0.5">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${e.code} up`} className="cursor-pointer rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                          <ArrowUp aria-hidden className="size-3" />
                        </button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === picked.length - 1} aria-label={`Move ${e.code} down`} className="cursor-pointer rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                          <ArrowDown aria-hidden className="size-3" />
                        </button>
                        <button type="button" onClick={() => toggle(e.code)} aria-label={`Remove ${e.code}`} className="cursor-pointer rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                          <X aria-hidden className="size-3" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {CATEGORIES.map((cat) => {
              const items = CATALOG.filter((c) => c.category === cat);
              const on = items.filter((i) => picked.includes(i.code)).length;
              return (
                <div key={cat} className="border-b border-zinc-200">
                  <button
                    type="button" onClick={() => setOpen((o) => ({ ...o, [cat]: !o[cat] }))}
                    aria-expanded={open[cat]}
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left transition-colors duration-200 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
                  >
                    <ChevronDown aria-hidden className={cn("size-4 text-zinc-500 transition-transform duration-200", !open[cat] && "-rotate-90")} />
                    <span className="font-display text-sm font-semibold text-zinc-800">{cat}</span>
                    <span className="ml-auto font-mono text-[11px] text-zinc-500">{on ? `${on}/` : ""}{items.length}</span>
                  </button>
                  {open[cat] ? (
                    <ul className="pb-2">
                      {items.map((e) => {
                        const checked = picked.includes(e.code);
                        return (
                          <li key={e.code}>
                            <label className="flex cursor-pointer items-start gap-2.5 px-4 py-2 transition-colors duration-200 hover:bg-zinc-100">
                              <input
                                type="checkbox" checked={checked} onChange={() => toggle(e.code)}
                                className="mt-0.5 size-4 cursor-pointer rounded border-zinc-400 accent-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
                              />
                              <span className="min-w-0">
                                <span className="font-mono text-[11px] font-semibold text-zinc-700">{e.code}</span>
                                <span className="block text-xs leading-snug text-zinc-600">{e.label}</span>
                              </span>
                              <a href={`#${e.code}`} onClick={(ev) => ev.stopPropagation()} aria-label={`Scroll to ${e.code}`} className="ml-auto shrink-0 cursor-pointer rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                                <Eye aria-hidden className="size-3.5" />
                              </a>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}

            {picked.length ? (
              <div className="p-4">
                <label htmlFor="prompt-out" className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Prompt</label>
                <textarea
                  id="prompt-out" readOnly value={buildPrompt(pickedEntries, swatch)} rows={8}
                  className="mt-2 w-full resize-y rounded-lg border border-zinc-300 bg-white p-2.5 font-mono text-[10px] leading-relaxed text-zinc-700 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none"
                />
              </div>
            ) : null}
          </aside>
        ) : null}

        {/* ── canvas ───────────────────────────────────────────────────────── */}
        <div className={cn("min-w-0 flex-1", view === "split" && "overflow-y-auto")} style={themeVars(swatch)}>
          {view === "browse" ? (
            <div>
              {CATALOG.map((e, i) => (
                <div key={e.code} className="py-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-dotted border-zinc-300 px-5 pt-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox" checked={picked.includes(e.code)} onChange={() => toggle(e.code)}
                        className="size-4 cursor-pointer rounded border-zinc-400 accent-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
                      />
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.1em] text-white">{e.code}</span>
                    </label>
                    <span className="rounded-md bg-zinc-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">{e.category}</span>
                    <h2 className="font-display text-sm font-semibold tracking-tight text-zinc-700">{e.label}</h2>
                    <span className="ml-auto font-mono text-[10px] text-zinc-400">{i + 1}/{CATALOG.length}</span>
                  </div>

                  {/*
                    No overflow-hidden: navbar dropdowns must be able to escape.
                    An overlay nav has zero layout height, so it needs a backdrop
                    here or the frame would render as an empty strip.
                  */}
                  <div id={e.code} className={cn(
                    "isolate relative z-0 scroll-mt-20 bg-background ring-1 ring-zinc-200",
                    e.overlay && "min-h-56 bg-linear-to-b from-muted to-background",
                  )}>
                    {e.node}
                    {e.overlay ? (
                      <p className="px-6 pb-8 pt-28 text-center text-sm text-zinc-500">
                        Floats over whatever follows. The next section gets top clearance automatically.
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-8 border-b-2 border-dotted border-zinc-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-background">
              {pickedEntries.length ? (
                pickedEntries.map((e, i) => {
                  // An overlay nav consumes no height, so whatever follows has to
                  // make room for it or the bar lands on top of the headline.
                  const needsClearance = i > 0 && pickedEntries[i - 1]?.overlay;
                  return (
                    <Unstick key={e.code} on={view === "split" && e.sticky}>
                      <div className={cn(needsClearance && "[&>section]:pt-28 [&>section>img:first-child]:mt-0")}>
                        {e.node}
                      </div>
                    </Unstick>
                  );
                })
              ) : (
                <div className="grid min-h-[70vh] place-items-center p-10 text-center">
                  <div>
                    <PanelRightClose aria-hidden className="mx-auto size-8 text-zinc-400" />
                    <p className="mt-4 font-display text-lg font-semibold text-zinc-700">Nothing picked yet</p>
                    <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
                      Tick sections in Browse or in the sidebar. They appear here in page order, and the
                      Copy prompt button hands the codes to Claude.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
