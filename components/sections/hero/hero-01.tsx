import { ArrowRight, Star } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img, Stat } from "@/content/types";

/** Split hero. Copy left, single photo right, stat strip beneath. */
export function Hero01({ eyebrow, title, body, image, ctas = [], stats = [], rating }: {
  eyebrow?: string; title: string; body: string; image: Img; ctas?: Cta[]; stats?: Stat[]; rating?: string;
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal>
          {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {ctas.map((cta, i) => (
              <a key={cta.label} href={cta.href} className={i === 0
                ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                {cta.label}
                {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
            {rating ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star aria-hidden className="size-4 fill-current text-primary" /> {rating} from 1,900 guests
              </span>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="aspect-4/3 w-full rounded-2xl border border-border object-cover" />
        </Reveal>
      </div>

      {stats.length ? (
        <div className="border-t border-border">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-6 first:pl-0">
                <dt className="font-display text-3xl font-bold tracking-tight text-foreground">{s.value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}
