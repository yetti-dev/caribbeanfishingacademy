import { ArrowRight, Star } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img, Stat } from "@/content/types";

/** Mirror of Hero13: photo bleeds off the LEFT edge, copy sits right. */
export function Hero14({ eyebrow, title, body, image, ctas = [], stats = [], rating }: {
  eyebrow?: string; title: string; body: string; image: Img; ctas?: Cta[]; stats?: Stat[]; rating?: string;
}) {
  return (
    <section className="bg-muted/30">
      <div className="grid lg:grid-cols-2">
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async"
          className="h-64 w-full object-cover sm:h-96 lg:order-1 lg:h-full lg:min-h-[42rem]" />

        <Reveal className="flex items-center px-6 py-16 sm:px-10 lg:order-2 lg:py-24 lg:pr-[max(1.5rem,calc((100vw-80rem)/2))]">
          <div className="max-w-xl">
            {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{body}</p>
            {rating ? (
              <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star aria-hidden className="size-4 fill-current text-primary" /> {rating} from 1,900 guests
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta, i) => (
                <a key={cta.label} href={cta.href} className={i === 0
                  ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
