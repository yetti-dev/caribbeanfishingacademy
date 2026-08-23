import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, SectionHeading } from "@/content/types";

/** Full-bleed brand colour band. Centered, generous, nothing else competing. */
export function Cta01({ heading, primary, secondary, footnote }: {
  heading: SectionHeading; primary?: CtaLink; secondary?: CtaLink; footnote?: string;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-primary-foreground/75">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-tight text-balance sm:text-6xl">{heading.title}</h2>
          {heading.body ? <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">{heading.body}</p> : null}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {primary ? (
              <a href={primary.href} className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-foreground px-7 py-4 text-sm font-semibold text-primary transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none">
                {primary.label}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </a>
            ) : null}
            {secondary ? (
              <a href={secondary.href} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary-foreground/40 px-7 py-4 text-sm font-semibold transition duration-200 ease-out hover:bg-primary-foreground/15 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none">
                {secondary.label}
              </a>
            ) : null}
          </div>
          {footnote ? <p className="mt-6 text-xs text-primary-foreground/75">{footnote}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
