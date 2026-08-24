import type { Metadata } from "next";
import { Anchor, CalendarCheck, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero14 } from "@/components/sections/hero/hero-14";
import { ImageCard } from "@/components/magic/image-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { fishCookBeachDay } from "@/content/fish-cook-beach-day";

export const metadata: Metadata = {
  title: fishCookBeachDay.meta.title,
  description: fishCookBeachDay.meta.description,
  alternates: { canonical: fishCookBeachDay.meta.path },
};

const highlightIcons = [Anchor, CalendarCheck];

export default function FishCookBeachDayPage() {
  const { hero, highlights, beachMoment, cta } = fishCookBeachDay;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero14
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          image={hero.image}
          ctas={hero.ctas}
        />

        {/* Highlights */}
        <section className="bg-background py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <p className="eyebrow text-primary">{highlights.eyebrow}</p>
              <h2 className="mt-4 font-display text-5xl font-bold tracking-tight text-balance text-foreground sm:text-6xl">
                {highlights.title}
              </h2>
            </Reveal>

            <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2">
              {highlights.items.map((item, i) => {
                const Icon = highlightIcons[i] ?? MapPin;
                return (
                  <RevealItem key={item.title}>
                    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <span className="flex size-11 items-center justify-center rounded-full bg-primary/10">
                        <Icon aria-hidden className="size-5 text-primary" />
                      </span>
                      <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </section>

        {/* Beach moment */}
        <section className="bg-secondary py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <Reveal>
                <p className="eyebrow text-primary">Fishtorical moment</p>
                <h2 className="mt-4 font-display text-5xl font-bold tracking-tight text-balance text-foreground sm:text-6xl">
                  Catch it, then cook it
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  There is no set menu and no fixed price for this part of the day. Your captain helps you land the
                  fish, then it is yours to bring ashore and cook however your group likes it, on the sand, in good
                  company.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <ImageCard
                  src={beachMoment.image.src}
                  alt={beachMoment.image.alt}
                  eyebrow={beachMoment.eyebrow}
                  title={beachMoment.title}
                  description={beachMoment.description}
                  ratio="aspect-4/3"
                />
              </Reveal>
            </div>
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
                {cta.phone}
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
