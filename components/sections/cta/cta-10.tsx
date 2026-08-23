import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, Img, SectionHeading } from "@/content/types";

/** Offset composition: the photo column crosses the edge of the colour block. */
export function Cta10({ heading, primary, secondary, image, footnote }: {
  heading: SectionHeading; primary?: CtaLink; secondary?: CtaLink; image?: Img; footnote?: string;
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-0">
            <div className="rounded-3xl bg-primary p-10 text-primary-foreground sm:p-14 lg:col-span-8 lg:py-20 lg:pr-32">
              {heading.eyebrow ? <p className="eyebrow text-primary-foreground/75">{heading.eyebrow}</p> : null}
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">{heading.title}</h2>
              {heading.body ? <p className="mt-5 max-w-lg text-base leading-relaxed text-primary-foreground/90">{heading.body}</p> : null}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                {primary ? (
                  <a href={primary.href} className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none">
                    {primary.label}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </a>
                ) : null}
                {secondary ? (
                  <a href={secondary.href} className="inline-flex cursor-pointer items-center border-b border-primary-foreground/50 pb-0.5 text-sm font-semibold transition duration-200 ease-out hover:border-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none">
                    {secondary.label}
                  </a>
                ) : null}
              </div>
            </div>
            {image ? (
              <div className="lg:col-span-5 lg:col-start-8 lg:-ml-16">
                <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-xl">
                  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                </div>
              </div>
            ) : null}
          </div>
          {footnote ? <p className="mt-8 max-w-xl font-mono text-xs leading-relaxed tracking-wide text-muted-foreground lg:mt-6">{footnote}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
