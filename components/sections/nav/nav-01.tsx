"use client";
import { useEffect, useState } from "react";
import { Menu, X, Anchor, ChevronDown } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

/** Pill navbar. Floats, shrinks on scroll, real mobile sheet. */
export function Nav01({ brand, items, cta }: { brand: string; items: NavItem[]; cta?: Cta }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-4">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center gap-6 rounded-full border border-border px-5 transition-all duration-300 ease-out",
          scrolled ? "h-14 bg-background/90 shadow-lg backdrop-blur-md" : "h-16 bg-card",
        )}
      >
        <a href="#" className="flex cursor-pointer items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md">
          <Anchor aria-hidden className="size-5 text-primary" />
          <span className="font-display text-base font-bold tracking-tight text-foreground">{brand}</span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <li key={it.label} className="relative group">
              <a
                href={it.href}
                className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                {it.label}
                {it.children ? <ChevronDown aria-hidden className="size-3.5 transition-transform duration-200 group-hover:rotate-180" /> : null}
              </a>
              {it.children ? (
                <div className="invisible absolute left-0 top-full w-56 translate-y-1 rounded-xl border border-border bg-card p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {it.children.map((ch) => (
                    <a key={ch.label} href={ch.href} className="block cursor-pointer rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                      {ch.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        {cta ? (
          <a href={cta.href} className="hidden cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none md:block">
            {cta.label}
          </a>
        ) : null}

        <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="ml-auto cursor-pointer rounded-lg p-2 text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none md:hidden">
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-card p-3 shadow-xl md:hidden">
          {items.map((it) => (
            <a key={it.label} href={it.href} className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
              {it.label}
            </a>
          ))}
          {cta ? (
            <a href={cta.href} className="mt-2 block cursor-pointer rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground">
              {cta.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
