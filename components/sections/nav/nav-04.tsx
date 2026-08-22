"use client";
import { useState } from "react";
import { LifeBuoy, Menu, Star, X } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";

/** Mega-menu navbar. Tour dropdown shows a real panel with a rating badge. */
export function Nav04({ brand, items, cta, rating = "4.9" }: { brand: string; items: NavItem[]; cta?: Cta; rating?: string }) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex h-18 max-w-7xl items-center gap-8 px-6 py-3" onMouseLeave={() => setMega(null)}>
        <a href="#" className="flex cursor-pointer items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md">
          <LifeBuoy aria-hidden className="size-6 text-primary" />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">{brand}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((it) => (
            <li key={it.label}>
              <a
                href={it.href}
                onMouseEnter={() => setMega(it.children ? it.label : null)}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground sm:flex">
            <Star aria-hidden className="size-3.5 fill-current text-primary" /> {rating} rated
          </span>
          {cta ? (
            <a href={cta.href} className="hidden cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:block">
              {cta.label}
            </a>
          ) : null}
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="cursor-pointer rounded-lg p-2 text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none lg:hidden">
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </nav>

      {mega ? (
        <div className="hidden border-t border-border bg-card lg:block" onMouseEnter={() => setMega(mega)} onMouseLeave={() => setMega(null)}>
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {(items.find((i) => i.label === mega)?.children ?? []).map((ch) => (
              <a key={ch.label} href={ch.href} className="group cursor-pointer rounded-xl border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                <p className="font-display text-sm font-semibold text-foreground group-hover:text-primary">{ch.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Departs daily, small groups, gear supplied.</p>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="border-t border-border bg-card px-6 py-3 lg:hidden">
          {items.map((it) => (
            <a key={it.label} href={it.href} className="block cursor-pointer rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
              {it.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}
