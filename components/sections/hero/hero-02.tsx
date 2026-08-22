import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/**
 * Full-bleed photo with the copy on a solid card BELOW it.
 * Deliberately not text-over-photo behind a scrim: that is unreadable and reads
 * as a template. The image gets its own area, the words get theirs.
 */
export function Hero02({ eyebrow, title, body, image, ctas = [] }: {
  eyebrow?: string; title: string; body: string; image: Img; ctas?: Cta[];
}) {
  return (
    <section className="relative isolate bg-background">
      {/*
        The photo and the card share a stacking context. Reveal renders a
        motion.div, which opens its own context at z-index auto, so the card's
        paint order against the image it overlaps was ambiguous. Both are given
        an explicit z-index instead of relying on document order.
      */}
      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="relative z-0 h-[46vh] min-h-[320px] w-full object-cover sm:h-[58vh]" />
      <div className="relative z-10 mx-auto -mt-16 max-w-5xl px-6">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl sm:p-12">
            {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta, i) => (
                <a key={cta.label} href={cta.href} className={i === 0
                  ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                  {cta.label}
                  {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
