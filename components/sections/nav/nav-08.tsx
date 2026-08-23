"use client";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";
import { Icon } from "@/components/sections/icon";
import { cn } from "@/lib/utils";

type Logo = { src: string; alt: string } | string;

/**
 * Rail navbar. On desktop a slim vertical bar floats down the left edge and
 * widens on hover to show labels. On small screens it becomes a squared top
 * bar with a slide down drawer. Floats over the section below, so that
 * section needs its own left and top clearance.
 */
export function Nav08({
  items,
  cta,
  logo,
  brandName = "Blue Water Sail",
}: {
  items: NavItem[];
  cta?: Cta;
  logo?: Logo;
  brandName?: string;
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
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="pointer-events-none sticky top-0 z-50 h-0 w-full">
      <nav
        aria-label="Primary"
        className="pointer-events-auto group absolute left-4 top-4 hidden w-16 flex-col items-stretch overflow-hidden rounded-2xl border border-border bg-card/95 py-3 shadow-xl backdrop-blur-md transition-[width] duration-300 ease-out hover:w-60 lg:flex"
      >
        <a
          href="#"
          className="mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {logoSrc ? (
            <img src={logoSrc} alt={logoAlt ?? brandName} loading="lazy" decoding="async" className="size-7 shrink-0 rounded-md object-contain" />
          ) : (
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary font-mono text-[11px] font-bold text-primary-foreground">
              {initials}
            </span>
          )}
          <span className="whitespace-nowrap font-display text-sm font-bold tracking-tight text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {brandName}
          </span>
        </a>

        <span aria-hidden className="mx-4 my-3 h-px bg-border" />

        <ul className="flex flex-col gap-1">
          {items.map((it) => (
            <li key={it.label} className="mx-2">
              <a
                href={it.href}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <Icon name={it.icon} className="size-5 shrink-0" />
                <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {it.label}
                </span>
              </a>
              {it.children ? (
                <div className="hidden flex-col pl-10 group-hover:flex">
                  {it.children.map((ch) => (
                    <a
                      key={ch.label}
                      href={ch.href}
                      className="cursor-pointer whitespace-nowrap rounded py-1 text-xs text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      {ch.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        {cta ? (
          <a
            href={cta.href}
            className="mx-2 mt-4 flex cursor-pointer items-center gap-3 rounded-xl bg-primary px-2.5 py-2.5 text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Icon name={cta.icon ?? "CalendarCheck"} className="size-5 shrink-0" />
            <span className="whitespace-nowrap text-sm font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {cta.label}
            </span>
          </a>
        ) : null}
      </nav>

      <div className="pointer-events-auto lg:hidden">
        <nav aria-label="Primary" className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md">
          <a
            href="#"
            className="flex cursor-pointer items-center gap-2 rounded-md transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <span className="grid size-7 place-items-center rounded-md bg-primary font-mono text-[11px] font-bold text-primary-foreground">
              {initials}
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-foreground">{brandName}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="cursor-pointer rounded-md border border-border p-2 text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {open ? <X aria-hidden className="size-4" /> : <Menu aria-hidden className="size-4" />}
          </button>
        </nav>

        <div
          className={cn(
            "overflow-hidden border-b border-border bg-card transition-[max-height,opacity] duration-300 ease-out",
            open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <ul className="px-3 py-2">
            {items.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  onClick={close}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Icon name={it.icon} className="size-4 text-primary" />
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
          {cta ? (
            <a
              href={cta.href}
              onClick={close}
              className="block cursor-pointer bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {cta.label}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
