"use client";

/** Theme controls: colour, three fonts, accent treatment. */
import { useState } from "react";
import { Check, PaintBucket, Type } from "lucide-react";
import { ACCENT_FONTS, BODY_FONTS, DISPLAY_FONTS } from "@/lib/showcase-fonts";
import { FontSelect } from "@/components/sections/font-select";
import { resolvePrimary, type AccentSize, type Theme } from "@/components/sections/theme";
import { cn } from "@/lib/utils";

const PRESETS = ["#3b6beb", "#0078c9", "#008186", "#008539", "#4b8100", "#b55900", "#d03e00", "#d73240", "#c13b9f", "#715ce6"];

export function ThemeControls({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(theme.hex);
  const resolved = resolvePrimary(theme.hex);
  const set = (patch: Partial<Theme>) => onChange({ ...theme, ...patch });

  const commitHex = (v: string) => {
    setDraft(v);
    const withHash = v.startsWith("#") ? v : `#${v}`;
    if (resolvePrimary(withHash)) set({ hex: withHash.toLowerCase() });
  };

  const label = "block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500";

  return (
    <div className="relative">
      <button
        type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
      >
        <PaintBucket aria-hidden className="size-4" />
        <span className="size-4 rounded-full ring-1 ring-zinc-300" style={{ backgroundColor: theme.hex }} />
        <Type aria-hidden className="size-3.5 text-zinc-500" />
        Theme
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-100 mt-2 max-h-[calc(100vh-6rem)] w-84 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-2xl">
          {/* ── colour ── */}
          <p className={label}>Primary colour</p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color" value={theme.hex} onChange={(e) => commitHex(e.target.value)}
              aria-label="Pick a primary colour"
              className="size-9 cursor-pointer rounded-lg border border-zinc-300 bg-white p-0.5"
            />
            <input
              type="text" value={draft} onChange={(e) => commitHex(e.target.value)}
              spellCheck={false} aria-label="Primary colour hex value" placeholder="#0078c9"
              className="h-9 w-24 rounded-lg border border-zinc-300 px-2 font-mono text-xs text-zinc-800 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none"
            />
            {resolved ? (
              <span className="flex-1 text-right font-mono text-[10px] leading-tight text-zinc-500">
                hue {resolved.hue}
                <br />
                label {resolved.ratio}:1
              </span>
            ) : null}
          </div>
          {resolved ? (
            <p className="mt-2 text-[10px] leading-snug text-zinc-500">
              Rendered as <span className="font-mono text-zinc-700">{resolved.hex}</span> so the button label clears
              4.5:1. Your hex sets the hue; lightness is solved for contrast.
            </p>
          ) : null}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p} type="button" onClick={() => commitHex(p)} title={p}
                style={{ backgroundColor: p }}
                className={cn(
                  "grid size-6 cursor-pointer place-items-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:outline-none",
                  theme.hex.toLowerCase() === p && "ring-2 ring-zinc-800 ring-offset-2",
                )}
              >
                {theme.hex.toLowerCase() === p ? <Check aria-hidden className="size-3 text-white" /> : null}
                <span className="sr-only">{p}</span>
              </button>
            ))}
          </div>

          {/* ── fonts, each option previewed in its own face ── */}
          <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4">
            <FontSelect
              id="f-display" label={`Headings (${DISPLAY_FONTS.length})`} options={DISPLAY_FONTS}
              value={theme.displayFont} onChange={(v) => set({ displayFont: v })}
              sample="Sail the leeward coast"
            />
            <FontSelect
              id="f-body" label={`Body text (${BODY_FONTS.length})`} options={BODY_FONTS}
              value={theme.bodyFont} onChange={(v) => set({ bodyFont: v })}
              sample="Half day trips from Slip 14, lunch aboard."
            />
            <FontSelect
              id="f-accent" label={`Accent labels (${ACCENT_FONTS.length})`} options={ACCENT_FONTS}
              value={theme.accentFont} onChange={(v) => set({ accentFont: v })}
              sample="SMALL GROUP SAILING"
            />
          </div>

          {/* ── accent treatment ── */}
          <div className="mt-4 border-t border-zinc-200 pt-4">
            <p className={label}>Accent treatment</p>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-zinc-700">
              <input
                type="checkbox" checked={theme.accentUpper} onChange={(e) => set({ accentUpper: e.target.checked })}
                className="size-4 cursor-pointer rounded border-zinc-400 accent-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
              />
              All capital letters
            </label>
            <div className="mt-2.5 flex gap-1">
              {(["xs", "sm", "md"] as AccentSize[]).map((s) => (
                <button
                  key={s} type="button" onClick={() => set({ accentSize: s })} aria-pressed={theme.accentSize === s}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg border px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none",
                    theme.accentSize === s ? "border-zinc-800 bg-zinc-800 text-white" : "border-zinc-300 text-zinc-600 hover:bg-zinc-100",
                  )}
                >
                  {s === "xs" ? "Subtle" : s === "sm" ? "Normal" : "Large"}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
