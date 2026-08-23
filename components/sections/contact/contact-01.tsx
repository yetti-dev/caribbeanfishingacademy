"use client";

import * as React from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import { cn } from "@/lib/utils";
import type { SectionHeading } from "@/content/types";

/** The contact block shape. Matches `demoContact` in content/demo.ts. */
export type ContactDetails = {
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  hours?: { day: string; time: string }[];
  mapQuery?: string;
  socials?: { label: string; href: string; icon?: string }[];
};

const FIELD =
  "mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition duration-200 ease-out placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive";
const LABEL = "block text-sm font-medium text-foreground";
const ERROR = "mt-1.5 text-xs font-medium text-destructive";

/**
 * Split layout: the form takes the wide left column, the marina details and
 * opening hours sit on a raised card to the right.
 */
export function Contact01({
  heading,
  contact,
  submitLabel = "Send message",
  successTitle = "Message received",
  successBody = "We answer every enquiry within one working day, usually the same morning.",
}: {
  heading: SectionHeading;
  contact: ContactDetails;
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

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <Reveal>
            {sent ? (
              <div role="status" className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
                <Send aria-hidden className="size-6 text-primary" />
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground">{successTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{successBody}</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 cursor-pointer border-b border-primary/50 pb-0.5 text-sm font-medium text-primary transition duration-200 ease-out hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Write another message
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="c01-name" className={LABEL}>
                    Your name
                  </label>
                  <input
                    id="c01-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "c01-name-error" : undefined}
                    className={FIELD}
                  />
                  {errors.name ? (
                    <p id="c01-name-error" role="alert" className={ERROR}>
                      Tell us who to reply to.
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="c01-email" className={LABEL}>
                    Email address
                  </label>
                  <input
                    id="c01-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "c01-email-error" : undefined}
                    className={FIELD}
                  />
                  {errors.email ? (
                    <p id="c01-email-error" role="alert" className={ERROR}>
                      We need an address to send the answer to.
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="c01-phone" className={LABEL}>
                    Phone number (optional)
                  </label>
                  <input
                    id="c01-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={FIELD}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="c01-message" className={LABEL}>
                    What would you like to know?
                  </label>
                  <textarea
                    id="c01-message"
                    name="message"
                    rows={5}
                    required
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "c01-message-error" : undefined}
                    className={cn(FIELD, "resize-y")}
                  />
                  {errors.message ? (
                    <p id="c01-message-error" role="alert" className={ERROR}>
                      Add a line or two so we can answer properly.
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitLabel}
                    <Send aria-hidden className="size-4" />
                  </button>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <p className="eyebrow text-primary">Find us</p>
              <dl className="mt-6 space-y-6">
                {contact.address ? (
                  <div className="flex gap-4">
                    <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground">Marina</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-card-foreground">{contact.address}</dd>
                    </div>
                  </div>
                ) : null}
                {contact.phone ? (
                  <div className="flex gap-4">
                    <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground">Call the dock</dt>
                      <dd className="mt-1 text-sm">
                        <a
                          href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                          className="cursor-pointer font-medium text-card-foreground underline-offset-4 transition duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                        >
                          {contact.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
                {contact.email ? (
                  <div className="flex gap-4">
                    <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground">Email</dt>
                      <dd className="mt-1 text-sm">
                        <a
                          href={`mailto:${contact.email}`}
                          className="cursor-pointer font-medium break-all text-card-foreground underline-offset-4 transition duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                        >
                          {contact.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
              </dl>

              {contact.hours?.length ? (
                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex items-center gap-2">
                    <Clock aria-hidden className="size-4 text-primary" />
                    <h3 className="font-display text-sm font-semibold tracking-tight text-card-foreground">
                      Office hours at the slip
                    </h3>
                  </div>
                  <dl className="mt-4 space-y-0">
                    {contact.hours.map((h) => (
                      <div
                        key={h.day}
                        className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0"
                      >
                        <dt className="text-sm text-card-foreground">{h.day}</dt>
                        <dd className="font-mono text-xs text-muted-foreground">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {contact.socials?.length ? (
                <div className="mt-8 flex gap-2 border-t border-border pt-6">
                  {contact.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="grid size-10 cursor-pointer place-items-center rounded-lg border border-border text-card-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <Icon name={s.icon} className="size-4" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
