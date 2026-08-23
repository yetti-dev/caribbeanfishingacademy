"use client";

import * as React from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { ContactDetails } from "@/components/sections/contact/contact-01";
import type { SectionHeading } from "@/content/types";

const FIELD =
  "mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition duration-200 ease-out focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive";
const LABEL = "block text-sm font-medium text-card-foreground";
const ERROR = "mt-1.5 text-xs font-medium text-destructive";

/**
 * A full width OpenStreetMap strip with the enquiry card overlapping its lower
 * edge. No API key and no tile provider account: the embed export endpoint
 * takes a bounding box and renders a static, pannable mapnik view.
 */
export function Contact02({
  heading,
  contact,
  bbox = "-70.0560,12.5100,-70.0180,12.5320",
  marker = "12.5210,-70.0370",
  mapTitle = "Map showing Renaissance Marina in Oranjestad",
  submitLabel = "Send enquiry",
  successTitle = "On its way",
  successBody = "Ilse picks up the inbox from the office at the top of the dock. Expect a reply the same day.",
}: {
  heading: SectionHeading;
  contact: ContactDetails;
  bbox?: string;
  marker?: string;
  mapTitle?: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
}) {
  const [sent, setSent] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, boolean> = {};
    for (const key of ["name", "email", "message"]) {
      if (!String(data.get(key) ?? "").trim()) next[key] = true;
    }
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(marker)}`;
  const directions = contact.mapQuery
    ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(contact.mapQuery)}`
    : undefined;

  return (
    <section className="border-b border-border bg-muted">
      <div className="relative">
        <div className="h-[22rem] w-full overflow-hidden bg-background sm:h-[26rem]">
          <iframe
            title={mapTitle}
            src={embed}
            loading="lazy"
            className="size-full border-0"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-muted"
        />
      </div>

      <div className="mx-auto -mt-24 max-w-7xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end">
          <Reveal className="relative z-10 rounded-2xl border border-border bg-card p-8 shadow-lg">
            {sent ? (
              <div role="status">
                <h3 className="font-display text-2xl font-bold tracking-tight text-card-foreground">{successTitle}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{successBody}</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground transition duration-200 ease-out hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-card-foreground">
                  {heading.title}
                </h2>
                <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-5">
                  <div>
                    <label htmlFor="c02-name" className={LABEL}>
                      Name
                    </label>
                    <input
                      id="c02-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "c02-name-error" : undefined}
                      className={FIELD}
                    />
                    {errors.name ? (
                      <p id="c02-name-error" role="alert" className={ERROR}>
                        Please add your name.
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="c02-email" className={LABEL}>
                      Email
                    </label>
                    <input
                      id="c02-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "c02-email-error" : undefined}
                      className={FIELD}
                    />
                    {errors.email ? (
                      <p id="c02-email-error" role="alert" className={ERROR}>
                        Please add an email we can reply to.
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="c02-message" className={LABEL}>
                      Your message
                    </label>
                    <textarea
                      id="c02-message"
                      name="message"
                      rows={4}
                      required
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? "c02-message-error" : undefined}
                      className={cn(FIELD, "resize-y")}
                    />
                    {errors.message ? (
                      <p id="c02-message-error" role="alert" className={ERROR}>
                        Tell us what you are planning.
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitLabel}
                  </button>
                </form>
              </>
            )}
          </Reveal>

          <Reveal delay={0.1} className="lg:pb-4">
            {heading.body ? (
              <p className="max-w-md text-lg leading-relaxed text-foreground">{heading.body}</p>
            ) : null}
            {contact.address ? (
              <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>{contact.address}</span>
              </p>
            ) : null}
            {directions ? (
              <a
                href={directions}
                className="group mt-5 inline-flex cursor-pointer items-center gap-1.5 border-b border-primary/40 pb-0.5 text-sm font-semibold text-primary transition duration-200 ease-out hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                Open directions
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
