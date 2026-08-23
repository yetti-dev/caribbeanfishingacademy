"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { ContactDetails } from "@/components/sections/contact/contact-01";
import type { SectionHeading } from "@/content/types";

/** A "read this first" note. Answers the question before the visitor types it. */
export type PreflightNote = { q: string; a: string };

const FIELD =
  "mt-2 w-full rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-2.5 text-sm text-primary-foreground transition duration-200 ease-out focus-visible:border-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none aria-[invalid=true]:border-destructive-foreground aria-[invalid=true]:ring-destructive-foreground";
const LABEL = "block text-sm font-medium text-primary-foreground";
const ERROR = "mt-1.5 text-xs font-semibold text-destructive-foreground";

/**
 * Two panels butted against each other. The left half inverts to the brand
 * colour and carries the form. The right half answers the questions that
 * usually arrive by email, so half the visitors never need to send one.
 */
export function Contact05({
  heading,
  notes,
  contact,
  formTitle = "Ask the crew",
  submitLabel = "Send to the dock",
  successTitle = "Sent",
  successBody = "One of the skippers will come back to you between charters.",
}: {
  heading: SectionHeading;
  notes: PreflightNote[];
  contact: ContactDetails;
  formTitle?: string;
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
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}
        </Reveal>

        <div className="mt-14 grid overflow-hidden rounded-3xl border border-border lg:grid-cols-2">
          <Reveal className="bg-primary p-8 text-primary-foreground sm:p-12">
            <h3 className="font-display text-2xl font-bold tracking-tight">{formTitle}</h3>

            {sent ? (
              <div role="status" className="mt-8 border-t border-primary-foreground/25 pt-8">
                <p className="font-display text-xl font-semibold tracking-tight">{successTitle}</p>
                <p className="mt-2 text-sm leading-relaxed opacity-90">{successBody}</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 cursor-pointer border-b border-primary-foreground/50 pb-0.5 text-sm font-medium transition duration-200 ease-out hover:border-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
                >
                  Write another
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-5">
                <div>
                  <label htmlFor="c05-name" className={LABEL}>
                    Name
                  </label>
                  <input
                    id="c05-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "c05-name-error" : undefined}
                    className={FIELD}
                  />
                  {errors.name ? (
                    <p id="c05-name-error" role="alert" className={ERROR}>
                      Please add your name.
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="c05-email" className={LABEL}>
                    Email
                  </label>
                  <input
                    id="c05-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "c05-email-error" : undefined}
                    className={FIELD}
                  />
                  {errors.email ? (
                    <p id="c05-email-error" role="alert" className={ERROR}>
                      We need somewhere to reply.
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="c05-phone" className={LABEL}>
                    Phone (optional)
                  </label>
                  <input
                    id="c05-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="c05-message" className={LABEL}>
                    Your question
                  </label>
                  <textarea
                    id="c05-message"
                    name="message"
                    rows={5}
                    required
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "c05-message-error" : undefined}
                    className={cn(FIELD, "resize-y")}
                  />
                  {errors.message ? (
                    <p id="c05-message-error" role="alert" className={ERROR}>
                      Ask us anything, even the small stuff.
                    </p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="group mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitLabel}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                  />
                </button>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.1} className="bg-card p-8 sm:p-12">
            <p className="eyebrow text-primary">Before you write</p>
            <dl className="mt-8">
              {notes.map((n) => (
                <div key={n.q} className="border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0">
                  <dt className="font-display text-base font-semibold tracking-tight text-card-foreground">{n.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{n.a}</dd>
                </div>
              ))}
            </dl>
            {contact.address ? (
              <p className="mt-8 font-mono text-xs leading-relaxed text-muted-foreground">
                {contact.address}
              </p>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
