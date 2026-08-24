import type { Metadata } from "next";
import {
  Anchor,
  Check,
  Fish,
  Info,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero08 } from "@/components/sections/hero/hero-08";
import { ImageCard } from "@/components/magic/image-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { BookButton } from "@/components/widget/book-button";
import { ACTIVITIES } from "@/content/activities";
import { fishingTours } from "@/content/fishing-tours";

/** Maps each fare card to its real Yetti activity ID. */
const TIER_ACTIVITY: Record<string, string> = {
  "Reef Fishing": ACTIVITIES.reef.id,
  "1/2 Day Inshore": ACTIVITIES.inshore.id,
  "1/2 Day Offshore": ACTIVITIES.offshore.id,
  "3/4 Day Inshore": ACTIVITIES.inshore.id,
  "3/4 Day Offshore": ACTIVITIES.offshore.id,
  "Full Day Offshore": ACTIVITIES.offshore.id,
};

export const metadata: Metadata = {
  title: fishingTours.meta.title,
  description: fishingTours.meta.description,
  alternates: { canonical: fishingTours.meta.path },
};

export default function FishingToursPage() {
  const { hero, pricing, vessel, goodToKnow, cta } = fishingTours;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero08
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          image={hero.image}
          price={hero.price}
          period={hero.period}
          duration={hero.duration}
          ctas={hero.ctas}
        />

        {/* Pricing */}
        <section id="fares" className="bg-background py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <p className="eyebrow text-primary">{pricing.eyebrow}</p>
              <h2 className="mt-4 font-display text-5xl font-bold tracking-tight text-balance text-foreground sm:text-6xl">
                {pricing.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{pricing.body}</p>
            </Reveal>

            <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {pricing.tiers.map((tier) => (
                <RevealItem key={tier.name}>
                  <article
                    className={
                      tier.featured
                        ? "flex h-full flex-col rounded-3xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                        : "flex h-full flex-col rounded-3xl bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-24px_rgba(0,0,0,0.28)]"
                    }
                  >
                    {tier.featured ? (
                      <span className="eyebrow inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-primary-foreground">
                        Most booked
                      </span>
                    ) : (
                      <span className="eyebrow text-muted-foreground">Fishing charter</span>
                    )}

                    <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground">
                      {tier.name}
                    </h3>

                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                        {tier.price}
                      </span>
                      {tier.period ? (
                        <span className="text-sm text-muted-foreground">{tier.period}</span>
                      ) : null}
                    </div>

                    {tier.body ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tier.body}</p>
                    ) : null}

                    <ul className="mt-5 flex-1 space-y-3">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
                          <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {tier.cta ? (
                      <BookButton
                        activityId={TIER_ACTIVITY[tier.name] ?? ""}
                        className={
                          tier.featured
                            ? "mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            : "mt-6 inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        }
                      >
                        {tier.cta.label}
                      </BookButton>
                    ) : null}
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Vessel */}
        <section className="bg-secondary py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <Reveal>
                <p className="eyebrow text-primary">{vessel.eyebrow}</p>
                <h2 className="mt-4 font-display text-5xl font-bold tracking-tight text-balance text-foreground sm:text-6xl">
                  {vessel.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{vessel.body}</p>
                <ul className="mt-6 space-y-3">
                  {vessel.specs.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
                      <Anchor aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vessel.image.src}
                  alt={vessel.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-4/3 w-full rounded-2xl border border-border object-cover"
                />
              </Reveal>
            </div>

            {/* Reservation info */}
            <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
              <Reveal>
                <div className="rounded-3xl bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)]">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    {vessel.reservation.title}
                  </h3>

                  <div className="mt-5 flex items-start gap-3">
                    <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{vessel.reservation.included.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {vessel.reservation.included.body}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-start gap-3">
                    <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{vessel.reservation.notIncluded.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {vessel.reservation.notIncluded.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <ImageCard
                  src={vessel.reservation.image.src}
                  alt={vessel.reservation.image.alt}
                  eyebrow="Fishtorical moment"
                  title="Reeled in with the fort behind her"
                  description="Every trip is a private charter for your group, run by a pro USCG certified captain who knows San Juan Bay."
                  ratio="aspect-4/3"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Good to know */}
        <section className="bg-background py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="rounded-3xl bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] sm:p-10">
                <div className="flex items-center gap-3">
                  <Sun aria-hidden className="size-6 text-primary" />
                  <p className="eyebrow text-primary">{goodToKnow.eyebrow}</p>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                  {goodToKnow.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{goodToKnow.body}</p>
                <a
                  href={goodToKnow.cta.href}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Fish aria-hidden className="size-4 text-primary" />
                  {goodToKnow.cta.label}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-navy-foreground sm:text-4xl">
                {cta.title}
              </h2>
              <p className="mt-3 flex items-center justify-center gap-2 text-lg text-navy-foreground/80">
                <Phone aria-hidden className="size-5" />
                {cta.body}
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                {cta.ctas.map((c, i) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className={
                      i === 0
                        ? "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                        : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-navy-foreground/30 px-6 py-3.5 text-sm font-semibold text-navy-foreground transition-colors duration-200 ease-out hover:bg-navy-foreground/10 focus-visible:ring-2 focus-visible:ring-navy-foreground focus-visible:outline-none"
                    }
                  >
                    {i === 0 ? <MessageCircle aria-hidden className="size-4" /> : null}
                    {c.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
