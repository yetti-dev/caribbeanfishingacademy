import type { Metadata } from "next";
import { ArrowRight, HeartHandshake, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Marquee } from "@/components/magic/marquee";
import { Reveal } from "@/components/magic/reveal";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { community } from "@/content/community";

export const metadata: Metadata = {
  title: community.meta.title,
  description: community.meta.description,
  alternates: { canonical: community.meta.path },
};

export default function CommunityPage() {
  const { hero, founder, sponsors, cta } = community;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero: centred copy over a horizontally scrolling photo band */}
        <section className="overflow-hidden border-b border-border bg-background">
          <div className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
            <Reveal>
              <p className="eyebrow inline-flex items-center gap-2 text-primary">
                <Users aria-hidden className="size-3.5" /> {hero.eyebrow}
              </p>
              <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">
                {hero.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {hero.body}
              </p>
            </Reveal>
          </div>
          <Marquee pauseOnHover className="[--duration:38s] pb-16">
            {hero.images.map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={im.src}
                src={im.src}
                alt={im.alt}
                loading="lazy"
                decoding="async"
                className="mx-2 aspect-4/3 h-56 rounded-xl border border-border object-cover"
              />
            ))}
          </Marquee>
        </section>

        {/* Founder tie-in */}
        <section className="border-b border-border bg-card py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal className="order-first lg:order-first">
                <div className="aspect-4/5 overflow-hidden rounded-2xl border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={founder.image.src}
                    alt={founder.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="eyebrow inline-flex items-center gap-2 text-primary">
                  <HeartHandshake aria-hidden className="size-3.5" /> {founder.eyebrow}
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold leading-[1.02] tracking-tight text-balance text-foreground sm:text-4xl">
                  {founder.title}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  {founder.body}
                </p>
                <a
                  href={founder.cta.href}
                  className="group mt-7 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {founder.cta.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Sponsor wall: real logo strips, moving, not static */}
        <section className="border-b border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <p className="eyebrow text-primary">{sponsors.eyebrow}</p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-[1.02] tracking-tight text-balance text-foreground sm:text-4xl">
                {sponsors.title}
              </h2>
              <p className="mx-auto mt-5 text-lg leading-relaxed text-muted-foreground">
                {sponsors.body}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-12 flex flex-col gap-6">
            <Marquee pauseOnHover className="[--duration:44s]">
              {[0, 1, 2].map((i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`row1-${i}`}
                  src={sponsors.rowOne.src}
                  alt={sponsors.rowOne.alt}
                  loading="lazy"
                  decoding="async"
                  className="mx-3 h-28 w-auto rounded-xl border border-border bg-card object-contain p-4 sm:h-36"
                />
              ))}
            </Marquee>
            <Marquee pauseOnHover reverse className="[--duration:48s]">
              {[0, 1, 2].map((i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`row2-${i}`}
                  src={sponsors.rowTwo.src}
                  alt={sponsors.rowTwo.alt}
                  loading="lazy"
                  decoding="async"
                  className="mx-3 h-28 w-auto rounded-xl border border-border bg-card object-contain p-4 sm:h-36"
                />
              ))}
            </Marquee>
          </Reveal>
        </section>

        <Cta01 heading={cta.heading} primary={cta.primary} secondary={cta.secondary} />
      </main>
      <SiteFooter />
    </>
  );
}
