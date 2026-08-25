import type { Metadata } from "next";
import { ShieldCheck, Tag } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero18 } from "@/components/sections/hero/hero-18";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Fleet02 } from "@/components/sections/fleet/fleet-02";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { Cta03 } from "@/components/sections/cta/cta-03";
import { Reveal } from "@/components/magic/reveal";
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
        <Hero18
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          images={hero.images}
          ctas={hero.ctas}
          compact
          badge={
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pr-5 pl-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                <Tag aria-hidden className="size-3.5" />
              </span>
              <p className="text-sm font-semibold text-white">
                From {hero.price}
                {hero.duration ? <span className="ml-1 font-normal text-white/75">/ {hero.duration}</span> : null}
              </p>
            </div>
          }
        />

        <div className="mx-auto max-w-7xl px-6 pt-6">
          <p className="pb-2 text-sm text-muted-foreground sm:text-right">{priceNote}</p>
        </div>

        <Feature04 heading={experience.heading} features={experience.features} />

        <Fleet02 heading={fleet.heading} boats={fleet.boats} activityId={ACTIVITIES.sunsetCruise.id} />

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
              <div className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] sm:p-8">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck aria-hidden className="size-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {policy.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{policy.body}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Cta01
          heading={{ eyebrow: cta.eyebrow, title: cta.title, body: cta.body }}
          primary={cta.primary}
          secondary={cta.secondary}
          footnote={cta.footnote}
        />
      </main>
      <SiteFooter />
    </>
  );
}
