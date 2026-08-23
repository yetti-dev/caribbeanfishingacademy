"use client";

/** Theme tools as tabs: Colour, Fonts, Accent. */
import { useState } from "react";
import { Check } from "lucide-react";
import { ACCENT_FONTS, BODY_FONTS, DISPLAY_FONTS } from "@/lib/showcase-fonts";
import { FontSelect } from "@/components/sections/font-select";
import { resolvePrimary, type AccentSize, type Theme } from "@/components/sections/theme";
import { cn } from "@/lib/utils";

const PRESETS = [
  "#3b6beb", "#0078c9", "#008186", "#008539", "#4b8100",
  "#b55900", "#d03e00", "#d73240", "#c13b9f", "#715ce6",
  "#1f2937", "#0f766e",
];

type Tab = "colour" | "fonts" | "accent";

export function ThemePanel({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  const [tab, setTab] = useState<Tab>("colour");
  const [draft, setDraft] = useState(theme.hex);
  const resolved = resolvePrimary(theme.hex);
  const set = (patch: Partial<Theme>) => onChange({ ...theme, ...patch });

  const commitHex = (v: string) => {
    setDraft(v);
    const withHash = v.startsWith("#") ? v : `#${v}`;
    if (resolvePrimary(withHash)) set({ hex: withHash.toLowerCase() });
  };

  const tabBtn = (t: Tab, label: string) => (
    <button
      key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
      className={cn(
        "flex-1 cursor-pointer rounded-md px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none",
        tab === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800",
      )}
    >
      {label}
    </button>
  );

  const label = "block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500";

  return (
    <div className="flex h-full flex-col">
      <div role="tablist" aria-label="Theme tools" className="m-3 flex gap-1 rounded-lg bg-zinc-200/70 p-1">
        {tabBtn("colour", "Colour")}
        {tabBtn("fonts", "Fonts")}
        {tabBtn("accent", "Accent")}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {tab === "colour" ? (
          <div>
            <p className={label}>Primary</p>
            <div className="mt-2 flex items-center gap-2">
              <input type="color" value={theme.hex} onChange={(e) => commitHex(e.target.value)} aria-label="Pick a primary colour"
                className="size-10 shrink-0 cursor-pointer rounded-lg border border-zinc-300 bg-white p-0.5" />
              <input type="text" value={draft} onChange={(e) => commitHex(e.target.value)} spellCheck={false}
                aria-label="Primary colour hex value" placeholder="#0078c9"
                className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-300 px-2 font-mono text-xs text-zinc-800 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none" />
            </div>

            {resolved ? (
              <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-8 shrink-0 rounded-md ring-1 ring-zinc-300" style={{ backgroundColor: resolved.hex }} />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-zinc-800">{resolved.hex}</p>
                    <p className="font-mono text-[10px] text-zinc-500">hue {resolved.hue} · label {resolved.ratio}:1</p>
                  </div>
                </div>
                <p className="mt-2 text-[10px] leading-snug text-zinc-500">
                  Your hex sets the hue. Lightness is solved so the button label clears 4.5:1, which a fixed
                  lightness fails for most hues.
                </p>
              </div>
            ) : null}

            <p className={cn(label, "mt-4")}>Presets</p>
            <div className="mt-2 grid grid-cols-6 gap-1.5">
              {PRESETS.map((p) => (
                <button key={p} type="button" onClick={() => commitHex(p)} title={p} style={{ backgroundColor: p }}
                  className={cn(
                    "grid aspect-square cursor-pointer place-items-center rounded-md transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-1 focus-visible:outline-none",
                    theme.hex.toLowerCase() === p && "ring-2 ring-zinc-800 ring-offset-1",
                  )}>
                  {theme.hex.toLowerCase() === p ? <Check aria-hidden className="size-3 text-white" /> : null}
                  <span className="sr-only">{p}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "fonts" ? (
          <div className="space-y-3">
            <FontSelect id="f-display" label={`Headings (${DISPLAY_FONTS.length})`} options={DISPLAY_FONTS}
              value={theme.displayFont} onChange={(v) => set({ displayFont: v })} sample="Sail the leeward coast" />
            <FontSelect id="f-body" label={`Body (${BODY_FONTS.length})`} options={BODY_FONTS}
              value={theme.bodyFont} onChange={(v) => set({ bodyFont: v })} sample="Half day trips from Slip 14." />
            <FontSelect id="f-accent" label={`Accent (${ACCENT_FONTS.length})`} options={ACCENT_FONTS}
              value={theme.accentFont} onChange={(v) => set({ accentFont: v })} sample="SMALL GROUP SAILING" />
            <p className="pt-1 text-[10px] leading-snug text-zinc-500">
              Each option is rendered in its own face. A native select cannot do that, since option text is
              drawn by the operating system.
            </p>
          </div>
        ) : null}

        {tab === "accent" ? (
          <div>
            <p className={label}>Casing</p>
            <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2.5 text-xs text-zinc-700">
              <input type="checkbox" checked={theme.accentUpper} onChange={(e) => set({ accentUpper: e.target.checked })}
                className="size-4 cursor-pointer rounded border-zinc-400 accent-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none" />
              All capital letters
            </label>

            <p className={cn(label, "mt-4")}>Size and tracking</p>
            <div className="mt-2 flex gap-1">
              {(["xs", "sm", "md"] as AccentSize[]).map((s) => (
                <button key={s} type="button" onClick={() => set({ accentSize: s })} aria-pressed={theme.accentSize === s}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg border px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none",
                    theme.accentSize === s ? "border-zinc-800 bg-zinc-800 text-white" : "border-zinc-300 text-zinc-600 hover:bg-zinc-100",
                  )}>
                  {s === "xs" ? "Subtle" : s === "sm" ? "Normal" : "Large"}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3">
              <p className={label}>Preview</p>
              <p className="eyebrow mt-2 text-zinc-800">Small group sailing</p>
              <p className="mt-1 text-[10px] text-zinc-500">
                Applies to every eyebrow label in the library, driven by one utility class.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
