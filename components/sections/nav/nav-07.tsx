"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Menu, Search, X } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

type Logo = { src: string; alt: string } | string;
type Flat = { label: string; href: string; group?: string };

/**
 * Search first navbar. The centre of the bar is a command trigger rather
 * than a link list. Cmd K or the slash key opens a filterable palette of
 * every page and every child link. Escape closes it.
 */
export function Nav07({
  items,
  cta,
  logo,
  brandName = "Blue Water Sail",
  placeholder = "Search tours, boats and pages",
}: {
  items: NavItem[];
  cta?: Cta;
  logo?: Logo;
  brandName?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logoSrc = typeof logo === "string" ? logo : logo?.src;
  const logoAlt = typeof logo === "string" ? brandName : logo?.alt;

  const flat = useMemo<Flat[]>(() => {
    const out: Flat[] = [];
    for (const it of items) {
      out.push({ label: it.label, href: it.href });
      for (const ch of it.children ?? []) out.push({ label: ch.label, href: ch.href, group: it.label });
    }
    return out;
  }, [items]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return flat;
    return flat.filter((f) => f.label.toLowerCase().includes(needle) || (f.group ?? "").toLowerCase().includes(needle));
  }, [flat, q]);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);
      if (typing) return;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6">
        <a
          href="#"
          className="flex cursor-pointer items-center gap-2.5 rounded-md transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {logoSrc ? (
            <img src={logoSrc} alt={logoAlt ?? brandName} loading="lazy" decoding="async" className="h-7 w-auto" />
          ) : null}
          <span className="font-display text-base font-bold tracking-tight text-foreground">{brandName}</span>
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open the site search"
          aria-expanded={open}
          className="mx-auto hidden w-full max-w-md cursor-pointer items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-left text-sm text-muted-foreground transition-colors duration-200 hover:border-primary/50 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none md:flex"
        >
          <Search aria-hidden className="size-4" />
          <span className="truncate">{placeholder}</span>
          <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            Cmd K
          </kbd>
        </button>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open the site search"
            aria-expanded={open}
            className="cursor-pointer rounded-full border border-border p-2 text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none md:hidden"
          >
            <Search aria-hidden className="size-4" />
          </button>
          {cta ? (
            <a
              href={cta.href}
              className="hidden cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:block"
            >
              {cta.label}
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            className="cursor-pointer rounded-full border border-border p-2 text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none md:hidden"
          >
            {menu ? <X aria-hidden className="size-4" /> : <Menu aria-hidden className="size-4" />}
          </button>
        </div>
      </nav>

      {menu ? (
        <div className="border-t border-border bg-card px-6 py-3 md:hidden">
          {items.map((it) => (
            <div key={it.label}>
              <a
                href={it.href}
                onClick={() => setMenu(false)}
                className="block cursor-pointer rounded-lg px-2 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                {it.label}
              </a>
              {it.children?.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  onClick={() => setMenu(false)}
                  className="block cursor-pointer rounded-lg py-2 pl-6 pr-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {ch.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 px-4 pt-24 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close the site search"
            onClick={close}
            className="absolute inset-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search aria-hidden className="size-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                aria-label={placeholder}
                placeholder={placeholder}
                className="h-14 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close the site search"
                className="cursor-pointer rounded p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nothing matches that. Try tours, fleet or contact.
                </li>
              ) : (
                results.map((r) => (
                  <li key={`${r.group ?? "top"}-${r.label}`}>
                    <a
                      href={r.href}
                      onClick={close}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <span className={cn("truncate", r.group && "text-muted-foreground group-hover:text-foreground")}>
                        {r.label}
                      </span>
                      {r.group ? <span className="eyebrow text-muted-foreground">{r.group}</span> : null}
                      <CornerDownLeft
                        aria-hidden
                        className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))
              )}
            </ul>

            {cta ? (
              <a
                href={cta.href}
                onClick={close}
                className="block cursor-pointer border-t border-border bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                {cta.label}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
