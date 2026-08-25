import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, Img, SectionHeading } from "@/content/types";

/** Split panel: the ask sits on a solid surface, the photograph keeps its own half. */
export function Cta03({ heading, primary, secondary, image, points = [], footnote }: {
  heading: SectionHeading; primary?: CtaLink; secondary?: CtaLink; image?: Img; points?: string[]; footnote?: string;
}) {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-border lg:grid-cols-2">
            <div className="order-2 bg-card p-10 sm:p-14 lg:order-1">
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{heading.title}</h2>
              {heading.body ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
              {points.length ? (
                <ul className="mt-7 space-y-3">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                {primary ? (
                  <a href={primary.href} data-yetti-activity={primary.activityId} className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                    {primary.label}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </a>
                ) : null}
                {secondary ? (
                  <a href={secondary.href} className="inline-flex cursor-pointer items-center text-sm font-semibold text-foreground underline-offset-4 transition duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                    {secondary.label}
                  </a>
                ) : null}
              </div>
              {footnote ? <p className="mt-6 text-xs text-muted-foreground">{footnote}</p> : null}
            </div>
            {image ? (
              <div className="order-1 min-h-64 bg-muted lg:order-2">
                <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="size-full object-cover" />
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
