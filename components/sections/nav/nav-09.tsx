"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import type { Cta, NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

type Logo = { src: string; alt: string } | string;

/**
 * Auto hide navbar. Slides out of the way when you scroll down and comes
 * back the moment you scroll up, with a reading progress hairline along the
 * bottom edge. Child links open an inline tray that pushes the page rather
 * than an absolute dropdown. Mobile gets a right side drawer.
 */
export function Nav09({
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
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tray, setTray] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const lastY = useRef(0);
  const logoSrc = typeof logo === "string" ? logo : logo?.src;
  const logoAlt = typeof logo === "string" ? brandName : logo?.alt;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
      const goingDown = y > lastY.current;
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(goingDown && y > 120);
        if (goingDown) setTray(null);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeAll = useCallback(() => {
    setDrawer(false);
    setTray(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll]);

  const active = items.find((i) => i.label === tray);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background transition-transform duration-300 ease-out motion-reduce:transition-none",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6">
        <a
          href="#"
          className="flex cursor-pointer items-center gap-2.5 rounded-md transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {logoSrc ? (
            <img src={logoSrc} alt={logoAlt ?? brandName} loading="lazy" decoding="async" className="h-7 w-auto" />
          ) : null}
          <span className="font-display text-lg font-bold tracking-tight text-foreground">{brandName}</span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {items.map((it) =>
            it.children ? (
              <li key={it.label}>
                <button
                  type="button"
                  onClick={() => setTray((t) => (t === it.label ? null : it.label))}
                  aria-expanded={tray === it.label}
                  aria-label={tray === it.label ? `Hide ${it.label} links` : `Show ${it.label} links`}
                  className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {it.label}
                  <ChevronDown
                    aria-hidden
                    className={cn("size-3.5 transition-transform duration-200", tray === it.label && "rotate-180")}
                  />
                </button>
              </li>
            ) : (
              <li key={it.label}>
                <a
                  href={it.href}
                  onClick={() => setTray(null)}
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {it.label}
                </a>
              </li>
            ),
          )}
        </ul>

        {cta ? (
          <a
            href={cta.href}
            className="hidden cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none md:block"
          >
            {cta.label}
          </a>
        ) : null}

        <button
          type="button"
          onClick={() => setDrawer(true)}
          aria-label="Open menu"
          aria-expanded={drawer}
          className="ml-auto cursor-pointer rounded-lg p-2 text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none md:hidden"
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </nav>

      <div
        className={cn(
          "hidden overflow-hidden border-t border-border bg-muted transition-[max-height,opacity] duration-300 ease-out md:block",
          active ? "max-h-48 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
          <p className="eyebrow text-muted-foreground">{active?.label ?? ""}</p>
          {(active?.children ?? []).map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              onClick={() => setTray(null)}
              className="cursor-pointer rounded text-sm font-medium text-foreground underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {ch.label}
            </a>
          ))}
        </div>
      </div>

      <div aria-hidden className="h-px w-full bg-border">
        <div className="h-px bg-primary transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeAll}
            className="absolute inset-0 cursor-pointer bg-foreground/40 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col border-l border-border bg-card shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <span className="font-display text-base font-bold tracking-tight text-foreground">{brandName}</span>
              <button
                type="button"
                onClick={closeAll}
                aria-label="Close menu"
                aria-expanded={drawer}
                className="cursor-pointer rounded-lg p-2 text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {items.map((it) => (
                <div key={it.label} className="border-b border-border last:border-0">
                  <a
                    href={it.href}
                    onClick={closeAll}
                    className="block cursor-pointer rounded-lg px-2 py-3 text-base font-medium text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    {it.label}
                  </a>
                  {it.children?.map((ch) => (
                    <a
                      key={ch.label}
                      href={ch.href}
                      onClick={closeAll}
                      className="block cursor-pointer rounded-lg py-2 pl-5 pr-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      {ch.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
            {cta ? (
              <a
                href={cta.href}
                onClick={closeAll}
                className="m-3 cursor-pointer rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
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
