"use client";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

type Logo = { src: string; alt: string } | string;

/**
 * Overlay navbar. A slim hairline bar with a word button that opens a
 * full screen panel: oversized numbered links, staggered in, contact rail
 * on the right. Nothing drops down, everything takes over.
 */
export function Nav06({
  items,
  cta,
  logo,
  brandName = "Blue Water Sail",
  meta,
}: {
  items: NavItem[];
  cta?: Cta;
  logo?: Logo;
  brandName?: string;
  meta?: { label: string; value: string; href?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const logoSrc = typeof logo === "string" ? logo : logo?.src;
  const logoAlt = typeof logo === "string" ? brandName : logo?.alt;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a
          href="#"
          className="flex cursor-pointer items-center gap-2.5 rounded-md transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {logoSrc ? (
            <img src={logoSrc} alt={logoAlt ?? brandName} loading="lazy" decoding="async" className="h-7 w-auto" />
          ) : null}
          <span className="font-display text-base font-bold tracking-tight text-foreground">{brandName}</span>
        </a>

        <div className="flex items-center gap-4">
          {cta ? (
            <a
              href={cta.href}
              className="hidden cursor-pointer items-center gap-1 border-b border-primary pb-0.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:inline-flex"
            >
              {cta.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <span className="eyebrow">Menu</span>
            <Menu aria-hidden className="size-4" />
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background transition-opacity duration-300 ease-out",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <span className="font-display text-base font-bold tracking-tight text-foreground">{brandName}</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            aria-expanded={open}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <span className="eyebrow">Close</span>
            <X aria-hidden className="size-4" />
          </button>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[1.6fr_1fr] lg:py-16">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((it, i) => (
              <li
                key={it.label}
                style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
                className={cn(
                  "transition-all duration-500 ease-out motion-reduce:transition-none",
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
              >
                <a
                  href={it.href}
                  onClick={close}
                  className="group flex cursor-pointer items-baseline gap-5 py-4 transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-4xl font-bold tracking-tight text-foreground transition-transform duration-300 ease-out group-hover:translate-x-2 sm:text-5xl">
                    {it.label}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="ml-auto mr-4 size-6 self-center text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                </a>
                {it.children ? (
                  <div className="flex flex-wrap gap-x-5 gap-y-2 pb-4 pl-11">
                    {it.children.map((ch) => (
                      <a
                        key={ch.label}
                        href={ch.href}
                        onClick={close}
                        className="cursor-pointer rounded text-sm text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      >
                        {ch.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-6">
            {meta?.length ? (
              <dl className="space-y-4">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="eyebrow text-muted-foreground">{m.label}</dt>
                    <dd className="mt-1 text-base text-foreground">
                      {m.href ? (
                        <a
                          href={m.href}
                          className="cursor-pointer underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                        >
                          {m.value}
                        </a>
                      ) : (
                        m.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {cta ? (
              <a
                href={cta.href}
                onClick={close}
                className="mt-auto inline-flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-primary px-6 py-5 text-base font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {cta.label}
                <ArrowUpRight aria-hidden className="size-5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
