import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, SectionHeading } from "@/content/types";

/**
 * A brand-gradient card, inset on the page rather than a full-bleed band, so
 * it reads as one more designed element on the page instead of a colour
 * strip cutting across it. The card itself carries the diagonal
 * primary-to-navy gradient with a couple of soft glows behind the copy for
 * depth; the primary button flips to solid white so it still pops against a
 * coloured backdrop instead of blending into another gradient.
 */
export function Cta01({ heading, primary, secondary, footnote }: {
  heading: SectionHeading; primary?: CtaLink; secondary?: CtaLink; footnote?: string;
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-brand-gradient text-white shadow-2xl shadow-primary/25">
            <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 size-72 rounded-full bg-white/10 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -right-20 -bottom-20 size-72 rounded-full bg-navy/50 blur-3xl" />
            <div className="relative mx-auto max-w-2xl px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24">
              {heading.eyebrow ? <p className="eyebrow text-white/75">{heading.eyebrow}</p> : null}
              <h2 className="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-tight text-balance sm:text-5xl lg:text-6xl">{heading.title}</h2>
              {heading.body ? <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90">{heading.body}</p> : null}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {primary ? (
                  <a href={primary.href} data-yetti-activity={primary.activityId} className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-7 py-4 text-sm font-semibold text-primary shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none">
                    {primary.label}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </a>
                ) : null}
                {secondary ? (
                  <a href={secondary.href} data-yetti-activity={secondary.activityId} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/40 px-7 py-4 text-sm font-semibold transition duration-200 ease-out hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none">
                    {secondary.label}
                  </a>
                ) : null}
              </div>
              {footnote ? <p className="mt-6 text-sm text-white/75">{footnote}</p> : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
