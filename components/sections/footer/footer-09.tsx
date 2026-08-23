import { ArrowDown, ArrowRight } from "lucide-react";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Cta, Link } from "@/content/types";

type FooterColumn = { title: string; links: Link[] };

/**
 * Reveal footer. The page panel sits above on its own surface and slides over a
 * footer pinned to the bottom of this block, so the footer uncovers as you scroll.
 * Stickiness is scoped to the wrapper, so it stays contained inside a preview column.
 */
export function Footer09({
  brandName,
  preface,
  cta,
  columns = [],
  socials = [],
  copyright,
}: {
  brandName: string;
  preface?: { title: string; body?: string };
  cta?: Cta;
  columns?: FooterColumn[];
  socials?: Link[];
  copyright?: string;
}) {
  return (
    <div className="relative bg-accent">
      <div className="relative z-10 rounded-b-[2rem] border-b border-border bg-background shadow-2xl">
        <div className="mx-auto max-w-7xl px-6 py-16">
          {preface ? (
            <div className="grid items-center gap-8 md:grid-cols-[1.4fr_auto]">
              <div>
                <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground">
                  {preface.title}
                </h2>
                {preface.body ? (
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{preface.body}</p>
                ) : null}
              </div>
              {cta ? (
                <a
                  href={cta.href}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {cta.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </a>
              ) : null}
            </div>
          ) : null}
          <p className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowDown aria-hidden className="size-3.5" />
            Keep scrolling for the full directory
          </p>
        </div>
      </div>

      <footer className="sticky bottom-0 z-0 text-accent-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
            <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{brandName}</p>
            <div className="grid gap-8 sm:grid-cols-3">
              {columns.map((col) => (
                <div key={col.title}>
                  <p className="eyebrow opacity-70">{col.title}</p>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="cursor-pointer rounded-sm text-sm transition-opacity duration-200 ease-out hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-accent-foreground/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs opacity-80">{copyright ?? `${new Date().getFullYear()} ${brandName}`}</p>
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="cursor-pointer rounded-sm transition-opacity duration-200 ease-out hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <SocialIcon name={s.icon} label={s.label} className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
