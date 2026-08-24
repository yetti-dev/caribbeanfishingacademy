import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/**
 * Content left, photo right, bleeding to the full height and the right edge with
 * no padding or radius. The grid is the only thing holding the two apart.
 */
export function Hero13({ eyebrow, title, body, image, ctas = [], bullets = [] }: {
  eyebrow?: string; title: string; body: string; image: Img; ctas?: Cta[]; bullets?: string[];
}) {
  return (
    <section className="bg-background">
      <div className="grid lg:grid-cols-2">
        <Reveal className="flex items-center px-6 py-16 sm:px-10 lg:py-24 lg:pl-[max(1.5rem,calc((100vw-80rem)/2))]">
          <div className="max-w-xl">
            {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-6xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-7xl">{title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{body}</p>
            {bullets.length ? (
              <ul className="mt-7 space-y-2.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> {b}
                  </li>
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
          </div>
        </Reveal>

        {/* Full bleed: no padding, no radius, min height so it never collapses. */}
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async"
          className="h-64 w-full object-cover sm:h-96 lg:h-full lg:min-h-[42rem]" />
      </div>
    </section>
  );
}
