import { Reveal, RevealGroup } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/** Editorial hero. Hairline rules, wide tracking, three-photo strip. */
export function Hero04({ eyebrow, title, body, images, ctas = [], meta = [] }: {
  eyebrow?: string; title: string; body: string; images: Img[]; ctas?: Cta[]; meta?: string[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-5">
            {eyebrow ? <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p> : null}
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {meta.map((m) => (
                <span key={m} className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{m}</span>
              ))}
            </div>
          </div>
          <h1 className="mt-8 max-w-5xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-7xl">{title}</h1>
          <div className="mt-8 grid gap-6 border-t border-border pt-6 lg:grid-cols-[1fr_auto]">
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{body}</p>
            <div className="flex items-start gap-3">
              {ctas.map((cta) => (
                <a key={cta.label} href={cta.href} className="cursor-pointer rounded-lg bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                  {cta.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-3">
          {images.slice(0, 3).map((im, i) => (
            <figure key={im.src} className={i === 0 ? "sm:col-span-2" : ""}>
              <img src={im.src} alt={im.alt} loading="lazy" decoding="async" className={`w-full rounded-xl border border-border object-cover ${i === 0 ? "aspect-16/9" : "aspect-3/4 sm:aspect-auto sm:h-full"}`} />
            </figure>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
