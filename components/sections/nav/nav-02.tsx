"use client";
import { useState } from "react";
import { Menu, Phone, Ship, X } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";

/** Split navbar with a utility bar above. Phone number always visible. */
export function Nav02({ brand, items, cta, phone }: { brand: string; items: NavItem[]; cta?: Cta; phone?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <p className="font-mono uppercase tracking-[0.16em]">Daily departures from Slip 14</p>
          {phone ? (
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex cursor-pointer items-center gap-1.5 font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none">
              <Phone aria-hidden className="size-3.5" /> {phone}
            </a>
          ) : null}
        </div>
      </div>

      <nav className="border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-3">
          <a href="#" className="flex cursor-pointer items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Ship aria-hidden className="size-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">{brand}</span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {items.map((it) => (
              <li key={it.label}>
                <a href={it.href} className="relative cursor-pointer py-1 text-sm font-medium text-muted-foreground transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                  {it.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {cta ? (
              <a href={cta.href} className="hidden cursor-pointer rounded-lg border-2 border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-transparent hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:block">
                {cta.label}
              </a>
            ) : null}
            <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="cursor-pointer rounded-lg p-2 text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none lg:hidden">
              {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border bg-card px-6 py-3 lg:hidden">
            {items.map((it) => (
              <a key={it.label} href={it.href} className="block cursor-pointer rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                {it.label}
              </a>
            ))}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
