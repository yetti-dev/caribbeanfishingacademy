"use client";

/**
 * Font picker that renders each option IN that font.
 *
 * A native <select> cannot do this: option text is drawn by the OS, which
 * ignores font-family in most browsers. So this is a button plus a listbox, with
 * the keyboard behaviour a select would have given for free.
 */
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { FontOption } from "@/lib/showcase-fonts";
import { cn } from "@/lib/utils";

export function FontSelect({
  id, label, options, value, onChange, sample = "Sail the leeward coast",
}: {
  id: string; label: string; options: FontOption[]; value: string;
  onChange: (id: string) => void; sample?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.id === value)));
    const onDoc = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, options, value]);

  const commit = (i: number) => {
    onChange(options[i].id);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault(); setOpen(true); return;
    }
    if (!open) return;
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % options.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i - 1 + options.length) % options.length); }
    else if (e.key === "Enter") { e.preventDefault(); commit(active); }
  };

  return (
    <div ref={box} className="relative">
      <label htmlFor={id} className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">{label}</label>
      <button
        id={id} type="button" onClick={() => setOpen((v) => !v)} onKeyDown={onKey}
        aria-haspopup="listbox" aria-expanded={open}
        className="mt-1 flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-zinc-300 bg-white px-2.5 text-left transition-colors duration-200 hover:bg-zinc-50 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none"
      >
        <span className="min-w-0 truncate text-sm text-zinc-800" style={{ fontFamily: current.stack }}>
          {current.name}
        </span>
        <ChevronDown aria-hidden className={cn("size-4 shrink-0 text-zinc-500 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open ? (
        <ul
          role="listbox" aria-label={label} tabIndex={-1} onKeyDown={onKey}
          className="absolute left-0 right-0 top-full z-110 mt-1 max-h-80 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-2xl"
        >
          {options.map((o, i) => {
            const selected = o.id === value;
            return (
              <li key={o.id} role="option" aria-selected={selected}>
                <button
                  type="button" onClick={() => commit(i)} onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors duration-150",
                    i === active ? "bg-zinc-100" : "hover:bg-zinc-50",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    {/* The preview is the point: rendered in the font itself. */}
                    <span className="block truncate text-[15px] leading-tight text-zinc-900" style={{ fontFamily: o.stack }}>
                      {sample}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-zinc-500">{o.name}</span>
                      {o.note ? <span className="rounded bg-zinc-100 px-1 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-500">{o.note}</span> : null}
                    </span>
                  </span>
                  {selected ? <Check aria-hidden className="size-3.5 shrink-0 text-zinc-800" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
