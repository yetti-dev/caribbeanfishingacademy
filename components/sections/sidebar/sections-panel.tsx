"use client";

/** Section browser: search, category accordions, checkboxes, page order. */
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Eye, Search, Trash2, X } from "lucide-react";
import { CATALOG, CATEGORIES, type CatalogEntry } from "@/components/sections/catalog";
import { cn } from "@/lib/utils";

export function SectionsPanel({
  picked, onToggle, onMove, onClear,
}: {
  picked: string[];
  onToggle: (code: string) => void;
  onMove: (i: number, dir: -1 | 1) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [onlyPicked, setOnlyPicked] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c, true])),
  );

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      CATALOG.filter(
        (e) =>
          (!onlyPicked || picked.includes(e.code)) &&
          (!q ||
            e.code.toLowerCase().includes(q) ||
            e.label.toLowerCase().includes(q) ||
            e.category.toLowerCase().includes(q) ||
            e.component.toLowerCase().includes(q)),
      ),
    [q, onlyPicked, picked],
  );

  const pickedEntries = picked
    .map((c) => CATALOG.find((e) => e.code === c))
    .filter(Boolean) as CatalogEntry[];

  // A search should open the groups that still have hits, not leave them shut.
  const isOpen = (cat: string) => (q ? true : open[cat]);

  return (
    <div className="flex h-full flex-col">
      {/* search */}
      <div className="border-b border-zinc-200 p-3">
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search code, name, category" aria-label="Search sections"
            className="h-9 w-full rounded-lg border border-zinc-300 bg-white pl-8 pr-7 text-xs text-zinc-800 placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
              <X aria-hidden className="size-3" />
            </button>
          ) : null}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-zinc-600">
            <input type="checkbox" checked={onlyPicked} onChange={(e) => setOnlyPicked(e.target.checked)}
              className="size-3.5 cursor-pointer rounded border-zinc-400 accent-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none" />
            Selected only
          </label>
          <span className="font-mono text-[10px] text-zinc-500">
            {matches.length} of {CATALOG.length}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* page order */}
        {pickedEntries.length ? (
          <div className="border-b border-zinc-200 p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                Page order ({pickedEntries.length})
              </h3>
              <button type="button" onClick={onClear}
                className="flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                <Trash2 aria-hidden className="size-3" /> Clear
              </button>
            </div>
            <ol className="mt-2 space-y-1">
              {pickedEntries.map((e, i) => (
                <li key={e.code} className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1.5 ring-1 ring-zinc-200">
                  <span className="font-mono text-[10px] text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate font-mono text-[11px] font-semibold text-zinc-700">{e.code}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-0.5">
                    <button type="button" onClick={() => onMove(i, -1)} disabled={i === 0} aria-label={`Move ${e.code} up`}
                      className="cursor-pointer rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                      <ArrowUp aria-hidden className="size-3" />
                    </button>
                    <button type="button" onClick={() => onMove(i, 1)} disabled={i === pickedEntries.length - 1} aria-label={`Move ${e.code} down`}
                      className="cursor-pointer rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                      <ArrowDown aria-hidden className="size-3" />
                    </button>
                    <button type="button" onClick={() => onToggle(e.code)} aria-label={`Remove ${e.code}`}
                      className="cursor-pointer rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                      <X aria-hidden className="size-3" />
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {/* catalogue */}
        {CATEGORIES.map((cat) => {
          const items = matches.filter((e) => e.category === cat);
          if (!items.length) return null;
          const on = items.filter((i) => picked.includes(i.code)).length;
          return (
            <div key={cat} className="border-b border-zinc-200">
              <button type="button" onClick={() => setOpen((o) => ({ ...o, [cat]: !o[cat] }))} aria-expanded={isOpen(cat)}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left transition-colors duration-200 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                <ChevronDown aria-hidden className={cn("size-3.5 text-zinc-500 transition-transform duration-200", !isOpen(cat) && "-rotate-90")} />
                <span className="font-display text-xs font-semibold text-zinc-800">{cat}</span>
                <span className="ml-auto font-mono text-[10px] text-zinc-500">{on ? `${on}/` : ""}{items.length}</span>
              </button>
              {isOpen(cat) ? (
                <ul className="pb-1.5">
                  {items.map((e) => (
                    <li key={e.code} className="flex items-start gap-2 px-3 py-1.5 transition-colors duration-150 hover:bg-zinc-100">
                      <input
                        id={`pick-${e.code}`} type="checkbox" checked={picked.includes(e.code)} onChange={() => onToggle(e.code)}
                        className="mt-0.5 size-3.5 shrink-0 cursor-pointer rounded border-zinc-400 accent-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
                      />
                      <label htmlFor={`pick-${e.code}`} className="min-w-0 flex-1 cursor-pointer">
                        <span className="font-mono text-[10px] font-semibold text-zinc-700">{e.code}</span>
                        <span className="block text-[11px] leading-snug text-zinc-600">{e.label}</span>
                      </label>
                      <a href={`#${e.code}`} aria-label={`Scroll to ${e.code}`}
                        className="shrink-0 cursor-pointer rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                        <Eye aria-hidden className="size-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}

        {!matches.length ? (
          <p className="p-6 text-center text-xs text-zinc-500">Nothing matches that search.</p>
        ) : null}
      </div>
    </div>
  );
}
