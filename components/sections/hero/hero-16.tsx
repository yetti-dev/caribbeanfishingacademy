import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/**
 * Full-bleed photo with a solid booking strip anchored at the bottom. The photo
 * gets the whole frame; every word sits on an opaque surface.
 */
export function Hero16({ eyebrow, title, image, ctas = [], facts = [] }: {
  eyebrow?: string; title: string; image: Img; ctas?: Cta[];
  facts?: { icon: "clock" | "users" | "pin"; label: string; value: string }[];
}) {
  const iconFor = (k: string) =>
    k === "clock" ? <Clock aria-hidden className="size-4 text-primary" />
      : k === "users" ? <Users aria-hidden className="size-4 text-primary" />
        : <MapPin aria-hidden className="size-4 text-primary" />;

  return (
    <section className="relative isolate bg-foreground">
      <div className="relative">
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-[72vh] min-h-[26rem] w-full object-cover" />
        <Reveal className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl rounded-2xl bg-background p-6 shadow-2xl sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
                <h1 className="mt-3 font-display text-3xl font-bold leading-[1] tracking-tight text-balance text-foreground sm:text-5xl">{title}</h1>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
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
            {facts.length ? (
              <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5">
                    {iconFor(f.icon)}
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{f.label}</dt>
                      <dd className="text-sm font-medium text-foreground">{f.value}</dd>
                    </div>
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
