import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { FacebookIcon } from "@/components/icons";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero01 } from "@/components/sections/hero/hero-01";
import { Gallery01 } from "@/components/sections/gallery/gallery-01";
import { Cta01 } from "@/components/sections/cta/cta-01";
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
        <Hero01
          eyebrow={home.hero.eyebrow}
          title={home.hero.title}
          body={home.hero.body}
          image={home.hero.image!}
          ctas={home.hero.ctas}
          stats={home.hero.stats}
        />

        {/* Fishing tours + sunset cruise teasers */}
        <section className="border-b border-border bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="max-w-2xl">
              <p className="eyebrow text-primary">Go fishing or go cruising</p>
              <h2 className="mt-4 font-display text-5xl font-bold tracking-tight text-balance text-foreground sm:text-6xl">
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
                      <p className="mt-5 flex-1 text-base leading-relaxed text-muted-foreground">{t.body}</p>
                      <a
                        href={t.cta.href}
                        className="group mt-7 inline-flex cursor-pointer items-center gap-2 self-start rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
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

        <Gallery01
          heading={{ eyebrow: home.momentsGallery.eyebrow, title: home.momentsGallery.title }}
          images={home.momentsGallery.images}
        />

        {/* Trusted-by strip, quiet and small, not a boxed poster */}
        <section className="border-b border-border bg-background py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <Reveal>
              <p className="eyebrow text-muted-foreground">{home.sponsors.title}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <img
                src={home.sponsors.strip.src}
                alt={home.sponsors.strip.alt}
                loading="lazy"
                decoding="async"
                className="mx-auto mt-8 h-auto w-full max-w-2xl object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </Reveal>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              {home.sponsors.badges.map((b) => (
                <img key={b.src} src={b.src} alt={b.alt} loading="lazy" decoding="async" className="h-14 w-auto object-contain opacity-90" />
              ))}
            </div>
          </div>
        </section>

        <Cta01
          heading={{ eyebrow: home.purpose.eyebrow, title: home.purpose.title, body: home.purpose.body }}
          primary={home.purpose.ctas[0]}
          secondary={home.purpose.ctas[1]}
        />

        {/* Proximo evento teaser, editorial split card */}
        <section className="border-b border-border bg-background py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <div className="group grid overflow-hidden rounded-3xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-24px_rgba(0,0,0,0.28)] lg:grid-cols-2">
                <div className="relative aspect-4/3 overflow-hidden lg:aspect-auto">
                  <img
                    src={home.proximoTeaser.image.src}
                    alt={home.proximoTeaser.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-9 lg:p-12">
                  <p className="eyebrow text-primary">{home.proximoTeaser.eyebrow}</p>
                  <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {home.proximoTeaser.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{home.proximoTeaser.body}</p>
                  <a
                    href={home.proximoTeaser.cta.href}
                    className="group mt-7 inline-flex cursor-pointer items-center gap-2 self-start rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {home.proximoTeaser.cta.label}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-navy py-16 text-navy-foreground">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="font-display text-2xl font-semibold tracking-tight">Keep informed on Facebook</p>
            <a
              href="https://www.facebook.com/CFA-Caribbean-Fishing-Academy-708696695823502/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-navy-foreground/25 bg-navy-foreground/10 px-6 py-3.5 text-sm font-semibold transition-colors duration-200 hover:bg-navy-foreground/20 focus-visible:ring-2 focus-visible:ring-navy-foreground focus-visible:outline-none"
            >
              <FacebookIcon className="size-4" />
              Follow Caribbean Fishing Academy
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
