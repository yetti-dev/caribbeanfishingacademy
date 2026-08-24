import type { Metadata } from "next";
import { ArrowUpRight, Waves } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Reveal } from "@/components/magic/reveal";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { seaLifeResearchExpeditions } from "@/content/sea-life-research-expeditions";

export const metadata: Metadata = {
  title: seaLifeResearchExpeditions.meta.title,
  description: seaLifeResearchExpeditions.meta.description,
  alternates: { canonical: seaLifeResearchExpeditions.meta.path },
};

export default function SeaLifeResearchExpeditionsPage() {
  const { hero, connection, honestPoints, cta } = seaLifeResearchExpeditions;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Saturated navy colour block. No photograph: the source has almost no
            visual material for this page, so the type carries the conviction. */}
        <section className="bg-navy text-navy-foreground">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32">
            <Reveal>
              <p className="eyebrow text-navy-foreground/70">{hero.eyebrow}</p>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.92] tracking-tight text-balance sm:text-7xl lg:text-8xl">
                {hero.title}
              </h1>
              <div className="mt-10 grid gap-8 border-t border-navy-foreground/25 pt-8 lg:grid-cols-[1.4fr_1fr]">
                <p className="max-w-2xl text-lg leading-relaxed text-navy-foreground/90">{hero.body}</p>
                <div className="flex flex-col items-start gap-3">
                  {hero.ctas.map((c, i) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className={
                        i === 0
                          ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-navy-foreground px-6 py-3.5 text-sm font-semibold text-navy transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                          : "group inline-flex cursor-pointer items-center gap-1.5 border-b border-navy-foreground/50 pb-0.5 text-sm font-medium transition-colors hover:border-navy-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-foreground"
                      }
                    >
                      {c.label}
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ))}
                  {hero.footnote ? (
                    <p className="mt-1 text-xs text-navy-foreground/70">{hero.footnote}</p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Honest mission tie in: a photo of real diving/research work alongside
            the one paragraph of mission copy that genuinely supports this page. */}
        <section className="border-b border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal className="order-last lg:order-first">
                <div className="aspect-4/5 overflow-hidden rounded-2xl border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={connection.image.src}
                    alt={connection.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="eyebrow text-primary">{connection.eyebrow}</p>
                <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                  {connection.title}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{connection.body}</p>
                <div className="mt-8 flex items-center gap-3 rounded-2xl bg-card px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Waves aria-hidden className="size-5" />
                  </span>
                  <p className="text-sm leading-snug text-muted-foreground">
                    Fewer guessed details, more of the real thing: this page tells you exactly what we know
                    and points you to a phone number for the rest.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Feature01 heading={honestPoints.heading} features={honestPoints.items} />

        <Cta01 heading={cta.heading} primary={cta.primary} secondary={cta.secondary} />
      </main>
      <SiteFooter />
    </>
  );
}
