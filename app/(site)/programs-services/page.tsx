import type { Metadata } from "next";
import { ArrowRight, Handshake, MessageCircle, Phone } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero13 } from "@/components/sections/hero/hero-13";
import { Icon } from "@/components/sections/icon";
import { Reveal } from "@/components/magic/reveal";
import { brand } from "@/brand.config";
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
        <Hero13
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          image={hero.image!}
          ctas={hero.ctas}
        />

        {/* Four programs, alternating image and text rows */}
        <section className="border-b border-border bg-background py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-4 font-display text-5xl font-bold tracking-tight text-balance text-foreground sm:text-6xl">
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

        {/* CTA */}
        <section className="bg-navy py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-navy-foreground sm:text-4xl">
                {cta.heading.title}
              </h2>
              {cta.heading.body ? (
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-navy-foreground/80">
                  {cta.heading.body}
                </p>
              ) : null}
              <p className="mt-3 flex items-center justify-center gap-2 text-base text-navy-foreground/80">
                <Phone aria-hidden className="size-4" />
                {brand.contact.phone}
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={cta.primary.href}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <MessageCircle aria-hidden className="size-4" />
                  {cta.primary.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </a>
                <a
                  href={cta.secondary.href}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-navy-foreground/30 px-6 py-3.5 text-sm font-semibold text-navy-foreground transition-colors duration-200 ease-out hover:bg-navy-foreground/10 focus-visible:ring-2 focus-visible:ring-navy-foreground focus-visible:outline-none"
                >
                  {cta.secondary.label}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
