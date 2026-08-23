"use client";

import * as React from "react";
import { CalendarDays, CheckCircle2, Phone, Ship, Users } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { ContactDetails } from "@/components/sections/contact/contact-01";
import type { SectionHeading } from "@/content/types";

/** Minimum shape a bookable trip needs here. `Tour` from content/demo satisfies it. */
export type BookableTour = { title: string; duration?: string; price?: string };

const FIELD =
  "mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition duration-200 ease-out focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive";
const LABEL = "block text-sm font-medium text-foreground";
const HINT = "mt-1.5 text-xs text-muted-foreground";
const ERROR = "mt-1.5 text-xs font-medium text-destructive";

/**
 * The full booking enquiry: date, party size, which boat trip, and the notes
 * the crew actually needs. Laid out as a numbered two step sheet rather than a
 * flat stack, with a summary rail that keeps the phone number in reach.
 */
export function Contact03({
  heading,
  tours,
  contact,
  submitLabel = "Request these dates",
  successTitle = "Enquiry logged",
  successBody = "Nothing is charged yet. We will confirm the boat and the tide window, then send a payment link.",
  reassurance = [
    "No deposit taken on an enquiry",
    "Free reschedule if the crew calls the weather",
    "Answered by a person, not an autoresponder",
  ],
}: {
  heading: SectionHeading;
  tours: BookableTour[];
  contact: ContactDetails;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  reassurance?: string[];
}) {
  const [sent, setSent] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, boolean> = {};
    for (const key of ["name", "email", "date", "guests", "tour"]) {
      if (!String(data.get(key) ?? "").trim()) next[key] = true;
    }
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}
        </Reveal>

        {sent ? (
          <Reveal className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-10 text-center">
            <CheckCircle2 aria-hidden className="mx-auto size-8 text-primary" />
            <h3 role="status" className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
              {successTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{successBody}</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-7 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Enquire about another date
            </button>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <Reveal>
              <form noValidate onSubmit={onSubmit}>
                <fieldset className="border-t border-border pt-6">
                  <legend className="flex items-center gap-3 pr-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
                      1
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight text-foreground">
                      The trip you want
                    </span>
                  </legend>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="c03-tour" className={LABEL}>
                        <Ship aria-hidden className="mr-1.5 inline size-4 align-[-3px] text-primary" />
                        Which trip
                      </label>
                      <select
                        id="c03-tour"
                        name="tour"
                        required
                        defaultValue=""
                        aria-invalid={errors.tour ? true : undefined}
                        aria-describedby={errors.tour ? "c03-tour-error" : undefined}
                        className={cn(FIELD, "cursor-pointer")}
                      >
                        <option value="" disabled>
                          Choose a trip
                        </option>
                        {tours.map((t) => (
                          <option key={t.title} value={t.title}>
                            {[t.title, t.duration, t.price].filter(Boolean).join(", ")}
                          </option>
                        ))}
                        <option value="Not sure yet">Not sure yet, advise me</option>
                      </select>
                      {errors.tour ? (
                        <p id="c03-tour-error" role="alert" className={ERROR}>
                          Pick a trip, or choose the last option and we will advise.
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="c03-date" className={LABEL}>
                        <CalendarDays aria-hidden className="mr-1.5 inline size-4 align-[-3px] text-primary" />
                        Preferred date
                      </label>
                      <input
                        id="c03-date"
                        name="date"
                        type="date"
                        required
                        aria-invalid={errors.date ? true : undefined}
                        aria-describedby={errors.date ? "c03-date-error" : "c03-date-hint"}
                        className={cn(FIELD, "cursor-pointer")}
                      />
                      {errors.date ? (
                        <p id="c03-date-error" role="alert" className={ERROR}>
                          Give us a date to check the tide against.
                        </p>
                      ) : (
                        <p id="c03-date-hint" className={HINT}>
                          We will offer the nearest window if it is booked.
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="c03-guests" className={LABEL}>
                        <Users aria-hidden className="mr-1.5 inline size-4 align-[-3px] text-primary" />
                        Guests aboard
                      </label>
                      <input
                        id="c03-guests"
                        name="guests"
                        type="number"
                        min={1}
                        max={16}
                        step={1}
                        required
                        defaultValue={2}
                        aria-invalid={errors.guests ? true : undefined}
                        aria-describedby={errors.guests ? "c03-guests-error" : "c03-guests-hint"}
                        className={FIELD}
                      />
                      {errors.guests ? (
                        <p id="c03-guests-error" role="alert" className={ERROR}>
                          How many people are sailing?
                        </p>
                      ) : (
                        <p id="c03-guests-hint" className={HINT}>
                          Sixteen is the largest party we carry.
                        </p>
                      )}
                    </div>
                  </div>
                </fieldset>

                <fieldset className="mt-12 border-t border-border pt-6">
                  <legend className="flex items-center gap-3 pr-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
                      2
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight text-foreground">
                      How we reach you
                    </span>
                  </legend>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c03-name" className={LABEL}>
                        Lead guest name
                      </label>
                      <input
                        id="c03-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? "c03-name-error" : undefined}
                        className={FIELD}
                      />
                      {errors.name ? (
                        <p id="c03-name-error" role="alert" className={ERROR}>
                          We put this name on the slip list.
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="c03-email" className={LABEL}>
                        Email
                      </label>
                      <input
                        id="c03-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? "c03-email-error" : undefined}
                        className={FIELD}
                      />
                      {errors.email ? (
                        <p id="c03-email-error" role="alert" className={ERROR}>
                          The confirmation goes here.
                        </p>
                      ) : null}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="c03-phone" className={LABEL}>
                        Mobile for the morning of (optional)
                      </label>
                      <input
                        id="c03-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className={FIELD}
                      />
                      <p className={HINT}>Only used if the weather changes the departure time.</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="c03-message" className={LABEL}>
                        Anything the crew should know
                      </label>
                      <textarea
                        id="c03-message"
                        name="message"
                        rows={4}
                        className={cn(FIELD, "resize-y")}
                      />
                      <p className={HINT}>Non swimmers, allergies, birthdays, mobility, a favourite reef.</p>
                    </div>
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="mt-10 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
                >
                  {submitLabel}
                </button>
              </form>
            </Reveal>

            <Reveal delay={0.1}>
              <aside className="rounded-2xl border border-border bg-muted p-7 lg:sticky lg:top-24">
                <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
                  What happens next
                </h3>
                <ul className="mt-5 space-y-4">
                  {reassurance.map((line) => (
                    <li key={line} className="flex gap-3 text-sm leading-relaxed text-foreground">
                      <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {contact.phone ? (
                  <div className="mt-7 border-t border-border pt-6">
                    <p className="text-xs text-foreground">Sailing in the next 48 hours? Call instead.</p>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-card-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <Phone aria-hidden className="size-4" />
                      {contact.phone}
                    </a>
                  </div>
                ) : null}
              </aside>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
