import { ArrowRight, MapPin } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/** Mosaic hero. Copy left, four-photo bento right. */
export function Hero05({ eyebrow, title, body, images, ctas = [], location }: {
  eyebrow?: string; title: string; body: string; images: Img[]; ctas?: Cta[]; location?: string;
}) {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_1.15fr] lg:py-24">
        <Reveal>
          {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{body}</p>
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
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-3">
          {images.slice(0, 4).map((im, i) => (
            <img key={im.src} src={im.src} alt={im.alt} loading="lazy" decoding="async"
              className={`w-full rounded-xl border border-border object-cover ${i === 0 ? "aspect-3/4 row-span-2" : "aspect-square"}`} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
