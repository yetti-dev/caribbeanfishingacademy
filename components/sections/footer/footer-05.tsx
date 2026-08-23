import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Link } from "@/content/types";

type FooterColumn = { title: string; links: Link[] };

/** A real sitemap: six narrow columns, small type, mono column headers, hairline grid. */
export function Footer05({
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
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-2 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">{brandName}</p>
          {tagline ? <p className="max-w-md text-sm text-muted-foreground">{tagline}</p> : null}
        </div>

        <div className="grid grid-cols-2 border-t border-border sm:grid-cols-3 lg:grid-cols-6">
          {columns.map((col) => (
            <div key={col.title} className="border-b border-r border-border px-4 py-6 first:pl-0 last:border-r-0">
              <p className="eyebrow text-primary">{col.title}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="cursor-pointer rounded-sm text-[13px] leading-6 text-muted-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>{copyright ?? `${new Date().getFullYear()} ${brandName}`}</span>
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
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="cursor-pointer rounded-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <SocialIcon name={s.icon} label={s.label} className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
