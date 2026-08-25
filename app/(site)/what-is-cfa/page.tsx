import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero18 } from "@/components/sections/hero/hero-18";
import { Faq02 } from "@/components/sections/faq/faq-02";
import { Quote03 } from "@/components/sections/quote/quote-03";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { whatIsCfa } from "@/content/what-is-cfa";

export const metadata: Metadata = {
  title: whatIsCfa.meta.title,
  description: whatIsCfa.meta.description,
  alternates: { canonical: whatIsCfa.meta.path },
};

export default function WhatIsCfaPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero18
          eyebrow={whatIsCfa.hero.eyebrow}
          title={whatIsCfa.hero.title}
          body={whatIsCfa.hero.body}
          images={whatIsCfa.hero.images}
          ctas={whatIsCfa.hero.ctas}
          compact
        />

        <Faq02 heading={whatIsCfa.faq.heading} items={whatIsCfa.faq.items} />

        <Quote03 quote={whatIsCfa.story} />

        <Cta01
          heading={whatIsCfa.cta.heading}
          primary={whatIsCfa.cta.primary}
          secondary={whatIsCfa.cta.secondary}
        />
      </main>
      <SiteFooter />
    </>
  );
}
