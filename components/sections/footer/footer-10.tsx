import { Asterisk } from "lucide-react";
import { Marquee } from "@/components/magic/marquee";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Link } from "@/content/types";

/** A ticker of the trips running above a compact one line bar. */
export function Footer10({
  brandName,
  ticker = [],
  links = [],
  socials = [],
  copyright,
}: {
  brandName: string;
  ticker?: string[];
  links?: Link[];
  socials?: Link[];
  copyright?: string;
}) {
  const items = ticker.length ? ticker : [brandName];

  return (
    <footer className="border-t border-border bg-background">
      <div className="border-b border-border bg-primary py-4 text-primary-foreground">
        <Marquee pauseOnHover className="[--marquee-duration:32s] [--marquee-gap:3rem]">
          {items.map((t) => (
            <span key={t} className="flex items-center gap-12 font-display text-2xl font-semibold tracking-tight whitespace-nowrap sm:text-3xl">
              {t}
              <Asterisk aria-hidden className="size-5 opacity-70" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">{brandName}</span>
          <span className="font-mono text-xs text-muted-foreground">{copyright ?? `${new Date().getFullYear()}`}</span>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="cursor-pointer rounded-sm text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <SocialIcon name={s.icon} label={s.label} className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
