import type { Metadata } from "next";
import { Waves } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero18 } from "@/components/sections/hero/hero-18";
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
        <Hero18
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          images={hero.images}
          ctas={hero.ctas}
          compact
        />

        {hero.footnote ? (
          <section className="border-b border-border bg-navy py-4 text-center text-navy-foreground">
            <p className="text-xs">{hero.footnote}</p>
          </section>
        ) : null}

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
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
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
