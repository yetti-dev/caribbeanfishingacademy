import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Cta, Link } from "@/content/types";

/** A brand colour booking panel riding on top of a compact link bar. */
export function Footer06({
  brandName,
  ctaTitle,
  ctaBody,
  cta,
  ctaSecondary,
  links = [],
  socials = [],
  copyright,
}: {
  brandName: string;
  ctaTitle: string;
  ctaBody?: string;
  cta?: Cta;
  ctaSecondary?: Cta;
  links?: Link[];
  socials?: Link[];
  copyright?: string;
}) {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="rounded-2xl bg-primary px-8 py-14 text-primary-foreground sm:px-12 lg:px-16">
          <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance sm:text-5xl">
                {ctaTitle}
              </h2>
              {ctaBody ? <p className="mt-4 max-w-xl text-base leading-relaxed opacity-90">{ctaBody}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:justify-end">
              {cta ? (
                <a
                  href={cta.href}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
                >
                  {cta.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </a>
              ) : null}
              {ctaSecondary ? (
                <a
                  href={ctaSecondary.href}
                  className="inline-flex cursor-pointer items-center border-b border-primary-foreground/50 pb-0.5 text-sm font-medium transition-colors duration-200 ease-out hover:border-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
                >
                  {ctaSecondary.label}
                </a>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-5 border-t border-border px-6 py-6 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-sm font-semibold tracking-tight text-foreground">{brandName}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="cursor-pointer rounded-sm text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
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
          <p className="text-xs text-muted-foreground">{copyright ?? `${new Date().getFullYear()} ${brandName}`}</p>
        </div>
      </div>
    </footer>
  );
}
