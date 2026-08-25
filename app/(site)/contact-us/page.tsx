import type { Metadata } from "next";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/sections/site-chrome";
import { Hero18 } from "@/components/sections/hero/hero-18";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { Reveal } from "@/components/magic/reveal";
import { FacebookIcon } from "@/components/icons";
import { brand } from "@/brand.config";
import { contactUs } from "@/content/contact-us";

export const metadata: Metadata = {
  title: contactUs.meta.title,
  description: contactUs.meta.description,
  alternates: { canonical: contactUs.meta.path },
};

const FIELD =
  "mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition duration-200 ease-out placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none";
const LABEL = "block text-sm font-medium text-foreground";

export default function ContactUsPage() {
  const { hero, form, location, cta } = contactUs;
  const phoneHref = `tel:${brand.contact.phone.replace(/[^\d+]/g, "")}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(brand.contact.mapQuery)}&z=15&output=embed`;

  return (
    <>
      <SiteHeader />
      <main>
        <Hero18
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          images={hero.images}
          ctas={hero.ctas}
          compact
        />

        {/* Contact form + direct details, side by side. */}
        <section className="bg-background py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <p className="eyebrow text-primary">{form.eyebrow}</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                {form.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{form.body}</p>
            </Reveal>

            <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
              <Reveal>
                <form className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={LABEL}>
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={LABEL}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={FIELD}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-subject" className={LABEL}>
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="What is this about?"
                      className={FIELD}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-message" className={LABEL}>
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Trip dates, group size, questions about the boat..."
                      className={`${FIELD} resize-y`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {form.submitLabel}
                      <Send aria-hidden className="size-4" />
                    </button>
                    <p className="mt-4 text-sm text-muted-foreground">{form.note}</p>
                  </div>
                </form>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="rounded-3xl bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)]">
                  <p className="eyebrow text-primary">Reach the dock directly</p>
                  <dl className="mt-6 space-y-6">
                    <div className="flex gap-4">
                      <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                      <div>
                        <dt className="text-xs font-medium tracking-wide text-muted-foreground">Call or text</dt>
                        <dd className="mt-1 text-sm">
                          <a
                            href={phoneHref}
                            className="cursor-pointer font-medium text-card-foreground underline-offset-4 transition duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                          >
                            {brand.contact.phone}
                          </a>
                        </dd>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                      <div>
                        <dt className="text-xs font-medium tracking-wide text-muted-foreground">Email</dt>
                        <dd className="mt-1 text-sm">
                          <a
                            href={`mailto:${brand.contact.email}`}
                            className="cursor-pointer font-medium break-all text-card-foreground underline-offset-4 transition duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                          >
                            {brand.contact.email}
                          </a>
                        </dd>
                      </div>
                    </div>

                    {brand.social.facebook ? (
                      <div className="flex gap-4">
                        <FacebookIcon className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div>
                          <dt className="text-xs font-medium tracking-wide text-muted-foreground">Facebook</dt>
                          <dd className="mt-1 text-sm">
                            <a
                              href={brand.social.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer font-medium break-all text-card-foreground underline-offset-4 transition duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                            >
                              Caribbean Fishing Academy
                            </a>
                          </dd>
                        </div>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Location, with driving notes on one side and the live map on the other. */}
        <section className="bg-muted py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
              <Reveal>
                <p className="eyebrow text-primary">{location.eyebrow}</p>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                  {location.title}
                </h2>
                <p className="mt-5 flex items-start gap-3 text-base leading-relaxed text-foreground">
                  <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-primary" />
                  <span>{location.body}</span>
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="h-[420px] w-full overflow-hidden rounded-3xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)]">
                  <iframe
                    src={mapSrc}
                    title="Caribbean Fishing Academy Charters location"
                    loading="lazy"
                    className="h-full w-full border-0"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Cta01
          heading={{ eyebrow: cta.eyebrow, title: cta.title, body: cta.body }}
          primary={cta.primary}
          secondary={cta.secondary}
          footnote="No hassle booking. Immediate confirmation."
        />
      </main>
      <SiteFooter />
    </>
  );
}
