import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero09 } from "@/components/sections/hero/hero-09";
import { Team01 } from "@/components/sections/about/team-01";
import { Cta03 } from "@/components/sections/cta/cta-03";
import { Quote02 } from "@/components/sections/quote/quote-02";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { Reveal } from "@/components/magic/reveal";
import { aboutUs } from "@/content/about-us";

export const metadata: Metadata = {
  title: aboutUs.meta.title,
  description: aboutUs.meta.description,
  alternates: { canonical: aboutUs.meta.path },
};

export default function AboutUsPage() {
  const { hero, founders, whatIsCfa, quote, programsTeaser, cta } = aboutUs;

  return (
    <>
      <SiteHeader />
      <main>
        <Hero09
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          images={hero.images}
          ctas={hero.ctas}
          highlights={hero.highlights}
        />

        <Team01 heading={founders.heading} members={founders.members} />

        <Cta03
          heading={{ eyebrow: whatIsCfa.heading.eyebrow, title: whatIsCfa.heading.title, body: whatIsCfa.heading.body }}
          primary={whatIsCfa.cta}
          image={whatIsCfa.image}
          points={whatIsCfa.points}
          footnote={whatIsCfa.footnote}
        />

        <Quote02 quote={quote} since="Founded 2013" />

        {/* Programs teaser: the one deliberately saturated navy block on this page. */}
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="grid items-center gap-8 rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-8 sm:p-10 md:grid-cols-[1fr_auto] md:gap-12">
                <div>
                  <p className="eyebrow text-navy-foreground/70">{programsTeaser.eyebrow}</p>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-navy-foreground sm:text-4xl">
                    {programsTeaser.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-foreground/85">
                    {programsTeaser.body}
                  </p>
                  <div className="mt-6 flex items-center gap-5">
                    {programsTeaser.badges.map((badge) => (
                      <img
                        key={badge.src}
                        src={badge.src}
                        alt={badge.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-10 w-auto rounded-md bg-navy-foreground/90 p-1 object-contain"
                      />
                    ))}
                  </div>
                </div>
                <a
                  href={programsTeaser.cta.href}
                  className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-navy focus-visible:outline-none"
                >
                  {programsTeaser.cta.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <Cta01
          heading={{ eyebrow: cta.eyebrow, title: cta.title, body: cta.body }}
          primary={cta.primary}
          secondary={cta.secondary}
          footnote="USCG certified pro captains. Immediate confirmation."
        />
      </main>
      <SiteFooter />
    </>
  );
}
