import type { Metadata } from "next";
import { ArrowRight, Camera, CalendarDays } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero18 } from "@/components/sections/hero/hero-18";
import { TrustStats } from "@/components/sections/hero/trust-stats";
import { Icon } from "@/components/sections/icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { home } from "@/content/home";

export const metadata: Metadata = {
  title: home.meta.title,
  description: home.meta.description,
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero18
          eyebrow={home.hero.eyebrow}
          title={home.hero.title}
          body={home.hero.body}
          images={home.hero.images}
          ctas={home.hero.ctas}
        />

        <TrustStats stats={home.hero.stats} />

        {/* Fishing tours + sunset cruise teasers */}
        <section className="border-b border-border bg-background pt-20 pb-24 lg:pt-24 lg:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="max-w-2xl">
              <p className="eyebrow text-primary">Go fishing or go cruising</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                Two ways to spend a day on San Juan Bay
              </h2>
            </Reveal>

            <RevealGroup className="mt-14 grid gap-8 lg:grid-cols-2">
              {[home.toursTeaser, home.sunsetTeaser].map((t) => (
                <RevealItem key={t.title}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-24px_rgba(0,0,0,0.28)]">
                    <div className="relative aspect-4/3 overflow-hidden">
                      <img
                        src={t.image.src}
                        alt={t.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <span className="absolute top-5 right-5 rounded-full bg-background px-4 py-2 text-sm font-bold text-foreground shadow-lg">
                        {t.price}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-8 lg:p-9">
                      <p className="eyebrow text-primary">{t.eyebrow}</p>
                      <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">{t.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{t.priceNote}</p>
                      <div className="mt-5 flex-1">
                        <p className="text-base leading-relaxed text-muted-foreground">{t.body}</p>
                        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                          {t.highlights.map((h) => (
                            <li key={h.label} className="flex items-start gap-2">
                              <Icon name={h.icon} className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span className="text-xs leading-snug text-foreground">{h.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a
                        href={t.cta.href}
                        className="group mt-7 inline-flex cursor-pointer items-center gap-2 self-start rounded-lg bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        {t.cta.label}
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Real guests, real fun: a masonry column gallery, not a moving marquee */}
        <section className="border-b border-border bg-secondary/40 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="mx-auto inline-flex w-fit items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Camera aria-hidden className="size-3.5" />
                {home.momentsGallery.eyebrow}
              </span>
              <h2 className="mt-4 text-balance font-display text-4xl font-bold sm:text-5xl">
                {home.momentsGallery.title}
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">{home.momentsGallery.body}</p>
            </Reveal>

            <Reveal className="mt-10">
              <div className="columns-2 gap-3 md:columns-3 [&>*]:mb-3">
                {home.momentsGallery.images.map((img) => (
                  <div key={img.src} className="group block w-full overflow-hidden rounded-xl border border-border">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Trusted-by strip: a real card, full colour, not a washed-out floater */}
        <section className="border-b border-border bg-secondary/30 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] sm:px-12 sm:py-14">
                <p className="eyebrow text-primary">{home.sponsors.title}</p>
                <img
                  src={home.sponsors.strip.src}
                  alt={home.sponsors.strip.alt}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto mt-8 h-auto w-full max-w-2xl object-contain transition-transform duration-300 hover:scale-[1.02]"
                />

                <div className="mx-auto mt-10 max-w-xs border-t border-border pt-8">
                  <p className="eyebrow text-muted-foreground">As recognized by</p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
                    {home.sponsors.badges.map((b) => (
                      <img
                        key={b.src}
                        src={b.src}
                        alt={b.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-14 w-auto object-contain transition-transform duration-300 hover:-translate-y-0.5"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Fishing with purpose: a full-photo CTA card, not a flat colour band */}
        <section className="container-px mx-auto max-w-6xl py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl px-6 py-24 text-center sm:px-12 sm:py-28">
              <img
                src="/ingested/caribbeanfishingacademy/img-011.webp"
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/50" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-primary uppercase ring-1 ring-primary/30">
                  {home.purpose.eyebrow}
                </span>
                <h2 className="mx-auto mt-5 max-w-xl text-balance font-display text-4xl font-bold text-navy-foreground sm:text-5xl">
                  {home.purpose.title}
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-pretty text-navy-foreground/85">{home.purpose.body}</p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={home.purpose.ctas[0].href}
                    className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-gradient px-7 text-base font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-navy focus-visible:outline-none"
                  >
                    {home.purpose.ctas[0].label}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href={home.purpose.ctas[1].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-navy-foreground/30 bg-transparent px-7 text-base font-medium text-navy-foreground transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-navy-foreground focus-visible:outline-none"
                  >
                    {home.purpose.ctas[1].label}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Proximo evento teaser: the flyer shown whole, never cropped */}
        <section className="border-b border-border bg-background py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <div className="grid overflow-hidden rounded-3xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] lg:grid-cols-2">
                <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-background to-navy/10 p-6 sm:p-10">
                  <div
                    aria-hidden
                    className="absolute -top-16 -left-16 size-64 rounded-full bg-primary/25 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="absolute -right-12 -bottom-16 size-64 rounded-full bg-navy/20 blur-3xl"
                  />
                  <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                    <CalendarDays aria-hidden className="size-3.5" />
                    Save the date
                  </span>
                  <img
                    src={home.proximoTeaser.image.src}
                    alt={home.proximoTeaser.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 w-full max-w-sm rounded-xl object-contain shadow-xl"
                  />
                </div>
                <div className="flex flex-col justify-center p-9 lg:p-12">
                  <p className="eyebrow text-primary">{home.proximoTeaser.eyebrow}</p>
                  <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {home.proximoTeaser.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{home.proximoTeaser.body}</p>

                  <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-5">
                    {home.proximoTeaser.facts.map((f) => (
                      <div key={f.label} className="flex items-center gap-2">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                          <Icon name={f.icon} className="size-4" />
                        </span>
                        <dd className="text-sm font-medium text-foreground">{f.label}</dd>
                      </div>
                    ))}
                  </dl>

                  <a
                    href={home.proximoTeaser.cta.href}
                    className="group mt-7 inline-flex cursor-pointer items-center gap-2 self-start rounded-lg bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {home.proximoTeaser.cta.label}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
