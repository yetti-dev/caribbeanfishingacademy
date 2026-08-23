import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Link } from "@/content/types";

type FooterColumn = { title: string; links: Link[] };

/** Editorial: link columns on top, an oversized wordmark bleeding off the bottom edge. */
export function Footer02({
  brandName,
  tagline,
  columns = [],
  socials = [],
  legal = [],
  copyright,
}: {
  brandName: string;
  tagline?: string;
  columns?: FooterColumn[];
  socials?: Link[];
  legal?: Link[];
  copyright?: string;
}) {
  return (
    <footer className="overflow-hidden border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-20">
        <Reveal className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div>
            {tagline ? (
              <p className="max-w-sm font-display text-2xl leading-snug tracking-tight text-foreground">{tagline}</p>
            ) : null}
            <div className="mt-8 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-10 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <SocialIcon name={s.icon} label={s.label} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-muted-foreground">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="group inline-flex cursor-pointer items-center gap-1 rounded-sm text-sm text-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {l.label}
                        <ArrowUpRight aria-hidden className="size-3 opacity-0 transition duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright ?? `${new Date().getFullYear()} ${brandName}`}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="cursor-pointer rounded-sm transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="select-none whitespace-nowrap px-6 font-display text-[18vw] font-bold leading-[0.72] tracking-tighter text-foreground/10"
        style={{ marginBottom: "-0.16em" }}
      >
        {brandName}
      </p>
      <span className="sr-only">{brandName}</span>
    </footer>
  );
}
