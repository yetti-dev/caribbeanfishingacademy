import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero16 } from "@/components/sections/hero/hero-16";
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

export default function ProximoEventoPage() {
  const { hero, detailsHeading, eventFacts, registration, faqHeading, faqs, closingNote } =
    proximoEvento;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero16
          eyebrow={hero.eyebrow}
          title={hero.title}
          image={hero.image}
          ctas={hero.ctas}
          facts={hero.facts}
        />

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
