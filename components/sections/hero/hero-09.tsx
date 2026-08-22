import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/** Overlapping-frame hero. Two photos, offset, with a rule-lined heading. */
export function Hero09({ eyebrow, title, body, images, ctas = [], highlights = [] }: {
  eyebrow?: string; title: string; body: string; images: Img[]; ctas?: Cta[]; highlights?: string[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-24">
        <Reveal className="relative">
          <img src={images[0]?.src} alt={images[0]?.alt ?? ""} loading="lazy" decoding="async" className="aspect-3/4 w-4/5 rounded-2xl border border-border object-cover" />
          {images[1] ? (
            <img src={images[1].src} alt={images[1].alt} loading="lazy" decoding="async" className="absolute bottom-0 right-0 aspect-square w-1/2 translate-y-6 rounded-2xl border-4 border-background object-cover shadow-xl" />
          ) : null}
        </Reveal>

        <Reveal delay={0.1}>
          {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p> : null}
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{body}</p>
          {highlights.length ? (
            <ul className="mt-7 divide-y divide-border border-y border-border">
              {highlights.map((h) => (
                <li key={h} className="py-3 text-sm text-foreground">{h}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((cta, i) => (
              <a key={cta.label} href={cta.href} className={i === 0
                ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                {cta.label}
                {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
