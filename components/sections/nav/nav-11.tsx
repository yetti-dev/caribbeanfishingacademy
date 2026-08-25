"use client";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import type { Cta, Img, NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Glass pill navbar. Matches arubaflagship.getyetti.com's chrome exactly: a
 * fixed header with a small top offset, a floating rounded-full bar with a
 * hairline border, backdrop blur and a soft shadow, pill-shaped hover states
 * on every link, and a solid accent-colour pill for the booking CTA.
 */
export function Nav11({
  items,
  cta,
  logo,
  homeHref = "/",
}: {
  items: NavItem[];
  cta?: Cta;
  logo: Img;
  homeHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full pt-3">
      <div className="container-px mx-auto max-w-7xl">
        <nav
          aria-label="Primary"
          className="flex h-16 items-center justify-between gap-3 rounded-full border border-navy-foreground/10 bg-navy/95 px-4 shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 sm:px-5"
          onMouseLeave={() => setPanel(null)}
        >
          <a href={homeHref} className="flex shrink-0 cursor-pointer items-center gap-2">
            <img src={logo.src} alt={logo.alt} className="h-10 w-auto object-contain" />
          </a>

          <div className="hidden items-center lg:flex">
            {items.map((it) => (
              <div key={it.label} className="relative" onMouseEnter={() => setPanel(it.children ? it.label : null)}>
                <a
                  href={it.href}
                  aria-expanded={it.children ? panel === it.label : undefined}
                  className="flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-navy-foreground/75 transition-colors duration-200 hover:bg-navy-foreground/10 hover:text-navy-foreground"
                >
                  {it.label}
                  {it.children ? (
                    <ChevronDown
                      aria-hidden
                      className={cn("size-3.5 transition-transform duration-200", panel === it.label && "rotate-180")}
                    />
                  ) : null}
                </a>
                {it.children ? (
                  <div
                    className={cn(
                      "absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 transition-all duration-200",
                      panel === it.label ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
                    )}
                  >
                    <div className="rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/[0.08]">
                      <div className="flex flex-col gap-1">
                        {it.children.map((ch) => (
                          <a
                            key={ch.label}
                            href={ch.href}
                            className="cursor-pointer rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
                          >
                            {ch.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {cta ? (
              <a
                href={cta.href}
                data-yetti-activity={cta.activityId}
                className="hidden cursor-pointer items-center justify-center rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] sm:inline-flex"
              >
                {cta.label}
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-10 cursor-pointer place-items-center rounded-full text-navy-foreground/80 transition-colors duration-200 hover:bg-navy-foreground/10 hover:text-navy-foreground lg:hidden"
            >
              {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </nav>

        {open ? (
          <div className="mt-2 max-h-[75vh] overflow-y-auto rounded-3xl border border-navy-foreground/10 bg-navy p-3 shadow-xl lg:hidden">
            {items.map((it) => (
              <div key={it.label} className="border-b border-navy-foreground/10 last:border-0">
                <div className="flex items-center">
                  <a
                    href={it.href}
                    onClick={() => !it.children && setOpen(false)}
                    className="flex-1 cursor-pointer rounded-lg px-3 py-3 text-base font-medium text-navy-foreground transition-colors duration-200 hover:bg-navy-foreground/10"
                  >
                    {it.label}
                  </a>
                  {it.children ? (
                    <button
                      type="button"
                      onClick={() => setExpanded((e) => (e === it.label ? null : it.label))}
                      aria-label={expanded === it.label ? `Hide ${it.label} links` : `Show ${it.label} links`}
                      aria-expanded={expanded === it.label}
                      className="cursor-pointer rounded-full p-2 text-navy-foreground/70 transition-colors duration-200 hover:bg-navy-foreground/10"
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
                        onClick={() => setOpen(false)}
                        className="block cursor-pointer rounded-lg px-3 py-2 text-sm text-navy-foreground/75 transition-colors duration-200 hover:bg-navy-foreground/10"
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
                data-yetti-activity={cta.activityId}
                onClick={() => setOpen(false)}
                className="mt-2 block cursor-pointer rounded-full bg-brand-gradient px-4 py-3 text-center text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
              >
                {cta.label}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
