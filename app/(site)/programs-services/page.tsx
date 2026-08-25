import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero18 } from "@/components/sections/hero/hero-18";
import { CtaPhoto } from "@/components/sections/cta/cta-photo";
import { Icon } from "@/components/sections/icon";
import { Reveal } from "@/components/magic/reveal";
import { programsServices } from "@/content/programs-services";

export const metadata: Metadata = {
  title: programsServices.meta.title,
  description: programsServices.meta.description,
  alternates: { canonical: programsServices.meta.path },
};

export default function ProgramsServicesPage() {
  const { hero, heading, rows, customEvents, cta } = programsServices;

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

        {/* Four programs, alternating image and text rows */}
        <section className="border-b border-border bg-background py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                {heading.title}
              </h2>
            </Reveal>

            <div className="mt-16 space-y-16 lg:space-y-20">
              {rows.map((row, i) => (
                <Reveal key={row.title}>
                  <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className={`overflow-hidden rounded-2xl border border-border ${i % 2 ? "lg:order-2" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={row.image.src}
                        alt={row.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="aspect-4/3 w-full object-cover"
                      />
                    </div>
                    <div className={i % 2 ? "lg:order-1" : ""}>
                      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon name={row.icon} className="size-5.5" />
                      </span>
                      <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                        {row.title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{row.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Custom events note */}
        <section className="bg-secondary py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:items-center sm:p-10">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Handshake aria-hidden className="size-5.5" />
                </span>
                <div>
                  {customEvents.eyebrow ? <p className="eyebrow text-primary">{customEvents.eyebrow}</p> : null}
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-balance text-foreground">
                    {customEvents.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{customEvents.body}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <CtaPhoto image={cta.image} badge={cta.badge} title={cta.title} body={cta.body} ctas={cta.ctas} />
      </main>
      <SiteFooter />
    </>
  );
}
