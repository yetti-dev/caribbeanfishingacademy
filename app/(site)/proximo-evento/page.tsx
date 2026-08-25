import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero18 } from "@/components/sections/hero/hero-18";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { Faq01 } from "@/components/sections/faq/faq-01";
import { Reveal } from "@/components/magic/reveal";
import { proximoEvento } from "@/content/proximo-evento";

export const metadata: Metadata = {
  title: proximoEvento.meta.title,
  description: proximoEvento.meta.description,
  alternates: { canonical: proximoEvento.meta.path },
};

const FACT_ICON = { pin: MapPin, clock: Clock, users: Users } as const;

export default function ProximoEventoPage() {
  const { hero, flyer, detailsHeading, eventFacts, registration, faqHeading, faqs, closingNote } =
    proximoEvento;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero18
          eyebrow={hero.eyebrow}
          title={hero.title}
          body="Torneo de pesca de muelle para ninos en Marina Puerto del Rey."
          images={hero.images}
          ctas={hero.ctas}
          compact
        />

        {/* Flyer shown whole, never cropped or stretched full-bleed */}
        <section className="border-b border-border bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <div className="grid overflow-hidden rounded-3xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] lg:grid-cols-2">
                <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-background to-navy/10 p-6 sm:p-10">
                  <div aria-hidden className="absolute -top-16 -left-16 size-64 rounded-full bg-primary/25 blur-3xl" />
                  <div aria-hidden className="absolute -right-12 -bottom-16 size-64 rounded-full bg-navy/20 blur-3xl" />
                  <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                    <CalendarDays aria-hidden className="size-3.5" />
                    Save the date
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={flyer.src}
                    alt={flyer.alt}
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 w-full max-w-sm rounded-xl object-contain shadow-xl"
                  />
                </div>
                <div className="flex flex-col justify-center p-9 lg:p-12">
                  <p className="eyebrow text-primary">Volante oficial</p>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Torneo de Pesca Infantil
                  </h2>
                  <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-4 border-y border-border py-5">
                    {hero.facts.map((f) => {
                      const FactIcon = FACT_ICON[f.icon];
                      return (
                        <div key={f.label} className="flex items-center gap-2.5">
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                            <FactIcon aria-hidden className="size-4" />
                          </span>
                          <div>
                            <dt className="eyebrow text-[10px] text-muted-foreground">{f.label}</dt>
                            <dd className="text-sm font-medium text-foreground">{f.value}</dd>
                          </div>
                        </div>
                      );
                    })}
                  </dl>
                  <div className="mt-7 flex flex-wrap gap-3">
                    {hero.ctas.map((c, i) => (
                      <a
                        key={c.label}
                        href={c.href}
                        className={
                          i === 0
                            ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                            : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                        }
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Feature01 heading={detailsHeading} features={eventFacts} />

        <Cta01 heading={registration.heading} primary={registration.primary} />

        <div id="preguntas">
          <Faq01 heading={faqHeading} items={faqs} groupName="proximo-evento-faq" />
        </div>

        <section className="border-b border-border bg-background py-14">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <p className="text-base leading-relaxed text-muted-foreground">{closingNote}</p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
