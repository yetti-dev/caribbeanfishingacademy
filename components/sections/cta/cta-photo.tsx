import { ArrowRight, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, Img } from "@/content/types";

/**
 * A full-photo CTA card, inset on the page rather than a flat colour band
 * that runs edge to edge. Keeps clear light space above and below so it
 * never reads as fused to the section (or the footer) that follows it.
 */
export function CtaPhoto({ image, badge, title, body, ctas }: {
  image: Img; badge?: string; title: string; body?: string; ctas: CtaLink[];
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl px-6 py-20 text-center shadow-2xl shadow-navy/20 sm:px-12 sm:py-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/50" />
            <div className="relative z-10">
              {badge ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-primary uppercase ring-1 ring-primary/30">
                  {badge}
                </span>
              ) : null}
              <h2 className="mx-auto mt-5 max-w-xl text-balance font-display text-4xl font-bold text-navy-foreground sm:text-5xl">
                {title}
              </h2>
              {body ? <p className="mx-auto mt-4 max-w-lg text-pretty text-navy-foreground/85">{body}</p> : null}
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {ctas.map((c, i) => (
                  <a
                    key={c.label}
                    href={c.href}
                    data-yetti-activity={c.activityId}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className={
                      i === 0
                        ? "group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-gradient px-7 text-base font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-navy focus-visible:outline-none"
                        : "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-navy-foreground/30 bg-transparent px-7 text-base font-medium text-navy-foreground transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-navy-foreground focus-visible:outline-none"
                    }
                  >
                    {i === 0 ? <MessageCircle aria-hidden className="size-4" /> : null}
                    {c.label}
                    {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" /> : null}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
