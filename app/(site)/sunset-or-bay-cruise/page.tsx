import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero08 } from "@/components/sections/hero/hero-08";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Fleet02 } from "@/components/sections/fleet/fleet-02";
import { Cta03 } from "@/components/sections/cta/cta-03";
import { Reveal } from "@/components/magic/reveal";
import { BookButton } from "@/components/widget/book-button";
import { ACTIVITIES } from "@/content/activities";
import { sunsetOrBayCruise } from "@/content/sunset-or-bay-cruise";

export const metadata: Metadata = {
  title: sunsetOrBayCruise.meta.title,
  description: sunsetOrBayCruise.meta.description,
  alternates: { canonical: sunsetOrBayCruise.meta.path },
};

export default function SunsetOrBayCruisePage() {
  const { hero, priceNote, experience, fleet, included, policy, cta } = sunsetOrBayCruise;

  return (
    <>
      <SiteHeader />
      <main>
        <Hero08
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          image={hero.image}
          price={hero.price}
          duration={hero.duration}
          ctas={hero.ctas}
        />

        {/* The price card in Hero08 covers the number; the fine print that
            explains it sits just below, on its own line, still above the fold. */}
        <div className="mx-auto max-w-7xl px-6">
          <p className="-mt-6 pb-2 text-sm text-muted-foreground sm:text-right">{priceNote}</p>
        </div>

        <Feature04 heading={experience.heading} features={experience.features} />

        <Fleet02 heading={fleet.heading} boats={fleet.boats} />

        <Cta03
          heading={included.heading}
          image={included.image}
          points={included.points}
          primary={included.primary}
          footnote={included.footnote}
        />

        {/* Fine print: a compact card, not a hero moment. */}
        <section className="bg-muted/40 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="flex gap-4 rounded-2xl bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] sm:p-7">
                <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
                    {policy.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{policy.body}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-primary py-20 text-primary-foreground">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
            <Reveal>
              <p className="eyebrow text-primary-foreground/75">{cta.eyebrow}</p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                {cta.title}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">{cta.body}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <BookButton
                  activityId={ACTIVITIES.sunsetCruise.id}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-7 py-4 text-sm font-semibold text-primary transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
                >
                  {cta.primary.label}
                </BookButton>
                {cta.secondary ? (
                  <a
                    href={cta.secondary.href}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary-foreground/30 px-7 py-4 text-sm font-semibold transition-colors duration-200 hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
                  >
                    {cta.secondary.label}
                  </a>
                ) : null}
              </div>
              <p className="mt-6 text-sm text-primary-foreground/75">USCG certified pro captains. Immediate confirmation.</p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
