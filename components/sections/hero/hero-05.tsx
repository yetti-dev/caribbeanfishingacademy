import { ArrowRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img, Stat } from "@/content/types";

/**
 * Mosaic hero. Copy left, a flush four-photo bento right.
 *
 * The mosaic has no gaps: the photos butt together inside one rounded, clipped
 * container so it reads as a single composed block rather than four cards. Fixed
 * column and row starts keep the arrangement stable instead of relying on
 * auto-placement, which reflowed unpredictably when an image was missing.
 *
 * The block is tall, so the copy column takes more than one paragraph. A single
 * short line beside a tall mosaic leaves an obvious hole.
 */
export function Hero05({ eyebrow, title, body, paragraphs = [], image, images, ctas = [], location, stats = [] }: {
  eyebrow?: string;
  title: string;
  body: string;
  /** Additional paragraphs after `body`. The mosaic is tall; fill the column. */
  paragraphs?: string[];
  image?: Img;
  images: Img[];
  ctas?: Cta[];
  location?: string;
  stats?: Stat[];
}) {
  const [a, b, c, d] = images;
  return (
    <section className="bg-muted/40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_1.05fr] lg:py-24">
        <Reveal>
          {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>

          <div className="mt-6 space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">{body}</p>
            {paragraphs.map((para) => (
              <p key={para.slice(0, 24)} className="text-base leading-relaxed text-muted-foreground">{para}</p>
            ))}
          </div>

          {location ? (
            <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
              <MapPin aria-hidden className="size-4 text-primary" /> {location}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((cta, i) => (
              <a key={cta.label} href={cta.href} className={i === 0
                ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                {cta.label}
                {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
          </div>

          {stats.length ? (
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-7 sm:grid-cols-4 lg:grid-cols-2">
              {stats.slice(0, 4).map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-bold tracking-tight text-foreground">{s.value}</dt>
                  <dd className="mt-0.5 text-xs leading-snug text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Reveal>

        {/* Flush mosaic: no gap, one clipped container, explicit placement. */}
        <Reveal delay={0.1}>
          <div className="grid aspect-4/5 grid-cols-2 grid-rows-3 overflow-hidden rounded-2xl border border-border sm:aspect-square lg:aspect-4/5">
            {a ? <img src={a.src} alt={a.alt} loading="lazy" decoding="async" className="col-start-1 row-start-1 row-span-2 size-full object-cover" /> : null}
            {b ? <img src={b.src} alt={b.alt} loading="lazy" decoding="async" className="col-start-2 row-start-1 size-full object-cover" /> : null}
            {c ? <img src={c.src} alt={c.alt} loading="lazy" decoding="async" className="col-start-2 row-start-2 size-full object-cover" /> : null}
            {d ? <img src={d.src} alt={d.alt} loading="lazy" decoding="async" className="col-span-2 row-start-3 size-full object-cover" /> : null}
          </div>
          {image?.caption ? <p className="mt-3 text-xs text-muted-foreground">{image.caption}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
