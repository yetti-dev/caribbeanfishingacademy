import type { Metadata } from "next";
import { Quote as QuoteMark } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero15 } from "@/components/sections/hero/hero-15";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { Reveal } from "@/components/magic/reveal";
import { missionVision } from "@/content/mission-vision";

export const metadata: Metadata = {
  title: missionVision.meta.title,
  description: missionVision.meta.description,
  alternates: { canonical: missionVision.meta.path },
};

export default function MissionVisionPage() {
  const { hero, missionHeading, missionPoints, vision, cta } = missionVision;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero15
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          image={hero.image}
          ctas={hero.ctas}
          note={hero.note}
        />

        <Feature01 heading={missionHeading} features={missionPoints} />

        <section className="border-b border-border bg-navy py-20 text-navy-foreground lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <Reveal>
                <p className="eyebrow text-navy-foreground/70">{vision.eyebrow}</p>
                <QuoteMark aria-hidden className="mt-6 size-9 text-navy-foreground/40" />
                <blockquote className="mt-6">
                  <p className="font-display text-2xl leading-[1.3] font-medium tracking-tight text-balance sm:text-4xl">
                    {vision.text}
                  </p>
                </blockquote>
                <p className="mt-8 font-mono text-xs tracking-wide text-navy-foreground/70">
                  {vision.author}
                  {vision.role ? `, ${vision.role}` : ""}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="order-first lg:order-last">
                <div className="aspect-4/5 overflow-hidden rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vision.image.src}
                    alt={vision.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Cta01 heading={cta.heading} primary={cta.primary} secondary={cta.secondary} />
      </main>
      <SiteFooter />
    </>
  );
}
