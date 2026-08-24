"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Clock, Menu, Phone, X } from "lucide-react";
import type { Cta, Img, Link as NavLink, NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

type Logo = { src: string; alt: string } | string;

/**
 * Two row navbar with a utility strip. Phone, hours and socials sit on top
 * and roll away as you scroll, leaving a compact bar stuck to the viewport.
 * A nav item with children opens a wide panel: grouped links on the left,
 * a featured card with a real photo on the right, caption under the image.
 */
export function Nav10({
  items,
  cta,
  logo,
  brandName = "Blue Water Sail",
  phone,
  hours,
  socials,
  featured,
}: {
  items: NavItem[];
  cta?: Cta;
  logo?: Logo;
  brandName?: string;
  phone?: string;
  hours?: string;
  socials?: NavLink[];
  featured?: { image: Img; eyebrow?: string; title: string; body: string; href: string };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const logoSrc = typeof logo === "string" ? logo : logo?.src;
  const logoAlt = typeof logo === "string" ? brandName : logo?.alt;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeAll = useCallback(() => {
    setPanel(null);
    setOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll]);

  const active = items.find((i) => i.label === panel && i.children);

  /* Phone alone does not earn the two-row utility bar, it moves inline next to
     the CTA instead, that's what keeps this "minimal" rather than two decks. */
  const hasUtilityBar = Boolean(hours || socials?.length);

  return (
    <header className="sticky top-0 z-50 bg-background" onMouseLeave={() => setPanel(null)}>
      {hasUtilityBar ? (
      <div
        className={cn(
          "overflow-hidden bg-foreground text-background transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2 text-xs">
          <div className="flex items-center gap-5">
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex cursor-pointer items-center gap-1.5 rounded font-medium underline-offset-4 transition-opacity duration-200 hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"
              >
                <Phone aria-hidden className="size-3.5" />
                {phone}
              </a>
            ) : null}
            {hours ? (
              <span className="hidden items-center gap-1.5 sm:flex">
                <Clock aria-hidden className="size-3.5" />
                {hours}
              </span>
            ) : null}
          </div>
          {socials?.length ? (
            <div className="flex items-center gap-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="cursor-pointer rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-background/15 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"
                >
                  {s.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      ) : null}

      <nav
        aria-label="Primary"
        className={cn(
          "border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-out",
          scrolled && "shadow-sm",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ease-out",
            scrolled ? "h-14" : "h-20",
          )}
        >
          <a
            href="#"
            className="flex cursor-pointer items-center gap-3 rounded-md transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={logoAlt ?? brandName}
                loading="lazy"
                decoding="async"
                className={cn("w-auto transition-all duration-300 ease-out", scrolled ? "h-7" : "h-9")}
              />
            ) : null}
            <span
              className={cn(
                "font-display font-bold tracking-tight text-foreground transition-all duration-300 ease-out",
                scrolled ? "text-lg" : "text-2xl",
              )}
            >
              {brandName}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {items.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  onMouseEnter={() => setPanel(it.children ? it.label : null)}
                  onFocus={() => setPanel(it.children ? it.label : null)}
                  aria-expanded={it.children ? panel === it.label : undefined}
                  className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {it.label}
                  {it.children ? (
                    <ChevronDown
                      aria-hidden
                      className={cn("size-3.5 transition-transform duration-200", panel === it.label && "rotate-180")}
                    />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {phone && !hasUtilityBar ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="hidden cursor-pointer items-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none lg:flex"
              >
                <Phone aria-hidden className="size-3.5" />
                {phone}
              </a>
            ) : null}
            {cta ? (
              <a
                href={cta.href}
                className="hidden cursor-pointer rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:block"
              >
                {cta.label}
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="cursor-pointer rounded-md p-2 text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none lg:hidden"
            >
              {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>
      </nav>

      {active ? (
        <div className="hidden border-b border-border bg-card shadow-xl lg:block">
          <div className={cn("mx-auto grid max-w-7xl gap-10 px-6 py-8", featured ? "lg:grid-cols-[1.4fr_1fr]" : "max-w-md")}>
            <div>
              <p className="eyebrow text-muted-foreground">{active.label}</p>
              <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
                {(active.children ?? []).map((ch) => (
                  <li key={ch.label} className="border-b border-border last:border-0 sm:[&:nth-last-child(2)]:border-0">
                    <a
                      href={ch.href}
                      onClick={closeAll}
                      className="group flex cursor-pointer items-center justify-between gap-4 py-3 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <span className="font-display text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                        {ch.label}
                      </span>
                      <ChevronDown
                        aria-hidden
                        className="size-4 -rotate-90 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {featured ? (
              <a
                href={featured.href}
                onClick={closeAll}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <img
                  src={featured.image.src}
                  alt={featured.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-40 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="p-5">
                  {featured.eyebrow ? <p className="eyebrow text-primary">{featured.eyebrow}</p> : null}
                  <p className="mt-2 font-display text-lg font-bold tracking-tight text-foreground">{featured.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{featured.body}</p>
                </div>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="max-h-[70vh] overflow-y-auto border-b border-border bg-card px-4 py-3 lg:hidden">
          {items.map((it) => (
            <div key={it.label} className="border-b border-border last:border-0">
              <div className="flex items-center">
                <a
                  href={it.href}
                  onClick={closeAll}
                  className="flex-1 cursor-pointer rounded-lg px-2 py-3 text-base font-medium text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {it.label}
                </a>
                {it.children ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => (e === it.label ? null : it.label))}
                    aria-label={expanded === it.label ? `Hide ${it.label} links` : `Show ${it.label} links`}
                    aria-expanded={expanded === it.label}
                    className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    <ChevronDown
                      aria-hidden
                      className={cn("size-4 transition-transform duration-200", expanded === it.label && "rotate-180")}
                    />
                  </button>
                ) : null}
              </div>
              {it.children && expanded === it.label ? (
                <div className="pb-2 pl-4">
                  {it.children.map((ch) => (
                    <a
                      key={ch.label}
                      href={ch.href}
                      onClick={closeAll}
                      className="block cursor-pointer rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      {ch.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {cta ? (
            <a
              href={cta.href}
              onClick={closeAll}
              className="mt-3 block cursor-pointer rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {cta.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
