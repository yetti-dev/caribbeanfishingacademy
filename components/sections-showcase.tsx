"use client";

/**
 * Section picker.
 *
 * Everything lives in one sidebar behind an icon rail: Sections (with search),
 * Theme (colour, fonts, accent), JSON exchange, and the build prompt. The header
 * only carries what is global: the view mode and the selection count.
 *
 * Three details that are easy to get wrong:
 *
 * 1. STACKING. Several sections contain their own sticky navbar at z-50, so each
 *    is wrapped in an `isolate` element. That opens a new stacking context and
 *    scopes the child's z-50 to its own frame, keeping it under the chrome.
 *
 * 2. FONT VARIABLES must wrap the whole page, not just the preview. The font
 *    dropdown renders each option in its own face, and it lives in the sidebar.
 *
 * 3. BODY FONT has to be re-declared on the preview wrapper. globals.css sets
 *    `body { font-family: var(--font-sans) }`, which resolves once at body;
 *    children inherit the computed font, not the variable.
 */

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight, Eye, FileJson, LayoutList, Palette, PanelRightClose,
  PanelRightOpen, Save, Terminal,
} from "lucide-react";
import { CATALOG, type CatalogEntry } from "@/components/sections/catalog";
import { SectionsPanel } from "@/components/sections/sidebar/sections-panel";
import { ThemePanel } from "@/components/sections/sidebar/theme-panel";
import { JsonPanel } from "@/components/sections/sidebar/json-panel";
import { PromptPanel } from "@/components/sections/sidebar/prompt-panel";
import { SavePanel } from "@/components/sections/sidebar/save-panel";
import { DEFAULT_THEME, themeVars, type Theme } from "@/components/sections/theme";
import { showcaseFontClass } from "@/lib/showcase-fonts";
import { cn } from "@/lib/utils";

const STORE = "section-picker-v2";
type View = "browse" | "split" | "preview";
type Tool = "sections" | "theme" | "save" | "json" | "prompt";

const TOOLS: { id: Tool; label: string; icon: React.ReactNode }[] = [
  { id: "sections", label: "Sections", icon: <LayoutList aria-hidden className="size-4" /> },
  { id: "theme", label: "Theme", icon: <Palette aria-hidden className="size-4" /> },
  { id: "save", label: "Save", icon: <Save aria-hidden className="size-4" /> },
  { id: "json", label: "JSON", icon: <FileJson aria-hidden className="size-4" /> },
  { id: "prompt", label: "Prompt", icon: <Terminal aria-hidden className="size-4" /> },
];

/** Cancel sticky positioning so nav chrome does not float inside a preview column. */
function Unstick({ on, children }: { on?: boolean; children: React.ReactNode }) {
  return on ? <div className="[&_.sticky]:static [&_.sticky]:top-auto">{children}</div> : <>{children}</>;
}

export function SectionsShowcase() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [picked, setPicked] = useState<string[]>([]);
  const [view, setView] = useState<View>("browse");
  const [tool, setTool] = useState<Tool>("sections");
  const [railOpen, setRailOpen] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const st = JSON.parse(raw) as { picked?: string[]; theme?: Theme; railOpen?: boolean; tool?: Tool };
      if (Array.isArray(st.picked)) setPicked(st.picked.filter((c) => CATALOG.some((e) => e.code === c)));
      if (st.theme) setTheme({ ...DEFAULT_THEME, ...st.theme });
      if (typeof st.railOpen === "boolean") setRailOpen(st.railOpen);
      if (st.tool) setTool(st.tool);
    } catch { /* ignore a corrupt entry */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ picked, theme, railOpen, tool })); } catch { /* quota */ }
  }, [picked, theme, railOpen, tool]);

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

  const viewBtn = (v: View, label: string, icon: React.ReactNode) => (
    <button
      key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none",
        view === v ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800",
      )}
    >
      {icon}{label}
    </button>
  );

  return (
    <div className={cn("min-h-screen bg-zinc-100", showcaseFontClass)}>
      <header className="sticky top-0 z-90 flex h-[52px] items-center gap-4 border-b border-zinc-300 bg-zinc-50/95 px-4 backdrop-blur-md">
        <span className="font-display text-sm font-bold tracking-tight text-zinc-800">Section picker</span>
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600">
          {picked.length}/{CATALOG.length}
        </span>
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-zinc-200/70 p-1">
          {viewBtn("browse", "Browse", <LayoutList aria-hidden className="size-3.5" />)}
          {viewBtn("split", "Split", <PanelRightOpen aria-hidden className="size-3.5" />)}
          {viewBtn("preview", "Preview", <Eye aria-hidden className="size-3.5" />)}
        </div>
      </header>

      <div className="flex">
        {/* ── icon rail ─────────────────────────────────────────────────────── */}
        <nav aria-label="Tools" className="sticky top-[52px] z-80 flex h-[calc(100vh-52px)] w-12 shrink-0 flex-col items-center gap-1 border-r border-zinc-300 bg-zinc-50 py-2">
          {TOOLS.map((t) => (
            <button
              key={t.id} type="button" title={t.label} aria-label={t.label}
              aria-pressed={railOpen && tool === t.id}
              onClick={() => { if (tool === t.id && railOpen) setRailOpen(false); else { setTool(t.id); setRailOpen(true); } }}
              className={cn(
                "grid size-9 cursor-pointer place-items-center rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none",
                railOpen && tool === t.id ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800",
              )}
            >
              {t.icon}
            </button>
          ))}
          <button
            type="button" onClick={() => setRailOpen((v) => !v)}
            aria-label={railOpen ? "Collapse the panel" : "Expand the panel"}
            className="mt-auto grid size-9 cursor-pointer place-items-center rounded-lg text-zinc-500 transition-colors duration-200 hover:bg-zinc-200 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            {railOpen ? <ChevronLeft aria-hidden className="size-4" /> : <ChevronRight aria-hidden className="size-4" />}
          </button>
        </nav>

        {/* ── tool panel ────────────────────────────────────────────────────── */}
        {railOpen ? (
          <aside className="sticky top-[52px] hidden h-[calc(100vh-52px)] w-80 shrink-0 border-r border-zinc-300 bg-zinc-50 md:block">
            <div className="flex h-9 items-center border-b border-zinc-200 px-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                {TOOLS.find((t) => t.id === tool)?.label}
              </span>
            </div>
            <div className="h-[calc(100%-2.25rem)]">
              {tool === "sections" ? (
                <SectionsPanel picked={picked} onToggle={toggle} onMove={move} onClear={() => setPicked([])} />
              ) : null}
              {tool === "theme" ? <ThemePanel theme={theme} onChange={setTheme} /> : null}
              {tool === "save" ? <SavePanel theme={theme} sections={picked} /> : null}
              {tool === "json" ? (
                <JsonPanel theme={theme} picked={picked}
                  onApply={(t, s) => { setTheme(t); setPicked(s); setView("preview"); }} />
              ) : null}
              {tool === "prompt" ? <PromptPanel picked={pickedEntries} theme={theme} /> : null}
            </div>
          </aside>
        ) : null}

        {/* ── canvas ────────────────────────────────────────────────────────── */}
        <div
          className={cn("min-w-0 flex-1 font-sans", view === "split" && "h-[calc(100vh-52px)] overflow-y-auto")}
          style={{ ...themeVars(theme), fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif" }}
        >
          {view === "browse" ? (
            CATALOG.map((e, i) => (
              <div key={e.code} className="py-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-dotted border-zinc-300 px-5 pt-3">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={picked.includes(e.code)} onChange={() => toggle(e.code)}
                      className="size-4 cursor-pointer rounded border-zinc-400 accent-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none" />
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.1em] text-white">{e.code}</span>
                  </label>
                  <span className="rounded-md bg-zinc-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">{e.category}</span>
                  <h2 className="font-display text-sm font-semibold tracking-tight text-zinc-700">{e.label}</h2>
                  <span className="ml-auto font-mono text-[10px] text-zinc-400">{i + 1}/{CATALOG.length}</span>
                </div>
                <div id={e.code} className={cn(
                  "isolate relative z-0 scroll-mt-20 bg-background ring-1 ring-zinc-200",
                  e.overlay && "min-h-56 bg-linear-to-b from-muted to-background",
                  e.tallPreview && "min-h-screen",
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
            ))
          ) : (
            <div className="bg-background">
              {pickedEntries.length ? (
                pickedEntries.map((e, i) => {
                  /*
                   * An overlay nav consumes no height, so whatever follows has to
                   * make room. A section opening with a full-bleed photo is the
                   * exception: padding it would insert a blank strip for the bar
                   * to float over instead of the image.
                   */
                  const prev = pickedEntries[i - 1];
                  const needsClearance = Boolean(prev?.overlay) && !e.leadsWithMedia;
                  return (
                    <Unstick key={e.code} on={view === "split" && e.sticky}>
                      <div className={cn(needsClearance && "[&>section]:pt-28")}>{e.node}</div>
                    </Unstick>
                  );
                })
              ) : (
                <div className="grid min-h-[70vh] place-items-center p-10 text-center">
                  <div>
                    <PanelRightClose aria-hidden className="mx-auto size-8 text-zinc-400" />
                    <p className="mt-4 font-display text-lg font-semibold text-zinc-700">Nothing picked yet</p>
                    <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
                      Tick sections in the sidebar. They appear here in page order, and the Prompt tool hands
                      the codes to Claude.
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
