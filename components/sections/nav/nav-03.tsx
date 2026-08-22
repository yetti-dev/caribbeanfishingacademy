"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";

/** Editorial navbar. Centred wordmark, links either side, bordered and typographic. */
export function Nav03({ brand, items, cta }: { brand: string; items: NavItem[]; cta?: Cta }) {
  const [open, setOpen] = useState(false);
  const half = Math.ceil(items.length / 2);
  const link =
    "cursor-pointer eyebrow text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-6">
        <ul className="hidden items-center gap-6 md:flex">
          {items.slice(0, half).map((it) => (
            <li key={it.label}><a href={it.href} className={link}>{it.label}</a></li>
          ))}
        </ul>
        <a href="#" className="cursor-pointer justify-self-start text-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none md:justify-self-center">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">{brand}</span>
          <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Est. 2013</span>
        </a>
        <div className="flex items-center justify-end gap-6">
          <ul className="hidden items-center gap-6 md:flex">
            {items.slice(half).map((it) => (
              <li key={it.label}><a href={it.href} className={link}>{it.label}</a></li>
            ))}
          </ul>
          {cta ? (
            <a href={cta.href} className="hidden cursor-pointer border-b-2 border-primary pb-0.5 eyebrow text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none lg:block">
              {cta.label}
            </a>
          ) : null}
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="cursor-pointer rounded p-2 text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none md:hidden">
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </nav>
      {open ? (
        <div className="border-t border-border px-6 py-4 md:hidden">
          {items.map((it) => (
            <a key={it.label} href={it.href} className="block cursor-pointer py-2 eyebrow text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
              {it.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}
