"use client";
import { useState } from "react";
import { Menu, Sailboat, X } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";

/** Dark bar navbar. High contrast, works over a bright hero photo. */
export function Nav05({ brand, items, cta }: { brand: string; items: NavItem[]; cta?: Cta }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-foreground text-background">
      <nav className="mx-auto flex h-18 max-w-7xl items-center gap-8 px-6 py-3">
        <a href="#" className="flex cursor-pointer items-center gap-2 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none rounded-md">
          <Sailboat aria-hidden className="size-6" />
          <span className="font-display text-lg font-bold tracking-tight">{brand}</span>
        </a>
        <ul className="ml-auto hidden items-center gap-2 md:flex">
          {items.map((it) => (
            <li key={it.label}>
              <a href={it.href} className="cursor-pointer rounded-full px-3.5 py-2 text-sm text-background/70 transition-colors duration-200 hover:bg-background/10 hover:text-background focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none">
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        {cta ? (
          <a href={cta.href} className="hidden cursor-pointer rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none md:block">
            {cta.label}
          </a>
        ) : null}
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="ml-auto cursor-pointer rounded-lg p-2 hover:bg-background/10 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none md:hidden">
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </nav>
      {open ? (
        <div className="border-t border-background/15 px-6 py-3 md:hidden">
          {items.map((it) => (
            <a key={it.label} href={it.href} className="block cursor-pointer rounded-lg px-2 py-2.5 text-sm text-background/80 hover:bg-background/10 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none">
              {it.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}
