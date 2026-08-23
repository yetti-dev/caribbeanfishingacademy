"use client";

import * as React from "react";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { ContactDetails } from "@/components/sections/contact/contact-01";
import type { SectionHeading } from "@/content/types";

const FIELD =
  "mt-2 w-full rounded-lg border border-border bg-card px-3.5 py-3 text-sm text-card-foreground transition duration-200 ease-out focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive";
const LABEL = "block text-left text-sm font-medium text-foreground";
const ERROR = "mt-1.5 text-left text-xs font-medium text-destructive";

/**
 * Three fields, one button, nothing else. Below it, three direct routes to a
 * human as real tel, WhatsApp and mailto links rather than another form.
 */
export function Contact04({
  heading,
  contact,
  submitLabel = "Send it",
  successTitle = "Thanks, that reached the dock",
  successBody = "We read every message between charters and answer within a day.",
  whatsappText = "Hello Blue Water Sail, I have a question about a trip.",
}: {
  heading: SectionHeading;
  contact: ContactDetails;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  whatsappText?: string;
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

  const tiles = [
    contact.phone
      ? {
          key: "call",
          icon: Phone,
          label: "Call the slip",
          value: contact.phone,
          href: `tel:${contact.phone.replace(/\s+/g, "")}`,
        }
      : null,
    contact.whatsapp
      ? {
          key: "whatsapp",
          icon: MessageCircle,
          label: "WhatsApp the crew",
          value: contact.whatsapp,
          href: `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(whatsappText)}`,
        }
      : null,
    contact.email
      ? {
          key: "email",
          icon: Mail,
          label: "Email the office",
          value: contact.email,
          href: `mailto:${contact.email}`,
        }
      : null,
  ].filter(Boolean) as { key: string; icon: typeof Phone; label: string; value: string; href: string }[];

  return (
    <section className="border-b border-border bg-muted py-24">
      <div className="mx-auto max-w-xl px-6 text-center">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-foreground">{heading.body}</p>
          ) : null}
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          {sent ? (
            <div role="status" className="rounded-2xl border border-primary/30 bg-card p-8">
              <h3 className="font-display text-xl font-bold tracking-tight text-card-foreground">{successTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{successBody}</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-5 cursor-pointer border-b border-primary/50 pb-0.5 text-sm font-medium text-primary transition duration-200 ease-out hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                Write another
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-5">
              <div>
                <label htmlFor="c04-name" className={LABEL}>
                  Name
                </label>
                <input
                  id="c04-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "c04-name-error" : undefined}
                  className={FIELD}
                />
                {errors.name ? (
                  <p id="c04-name-error" role="alert" className={ERROR}>
                    Please add your name.
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="c04-email" className={LABEL}>
                  Email
                </label>
                <input
                  id="c04-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "c04-email-error" : undefined}
                  className={FIELD}
                />
                {errors.email ? (
                  <p id="c04-email-error" role="alert" className={ERROR}>
                    Please add an email we can reply to.
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="c04-message" className={LABEL}>
                  Message
                </label>
                <textarea
                  id="c04-message"
                  name="message"
                  rows={4}
                  required
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "c04-message-error" : undefined}
                  className={cn(FIELD, "resize-y")}
                />
                {errors.message ? (
                  <p id="c04-message-error" role="alert" className={ERROR}>
                    Say a little about what you are after.
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                className="mt-1 w-full cursor-pointer rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitLabel}
              </button>
            </form>
          )}
        </Reveal>

        {tiles.length ? (
          <Reveal delay={0.16} className="mt-14">
            <p className="text-xs font-medium tracking-wide text-foreground">Or skip the form entirely</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {tiles.map((t) => (
                <li key={t.key}>
                  <a
                    href={t.href}
                    className="flex h-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-border bg-card px-4 py-6 transition duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <t.icon aria-hidden className="size-5 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">{t.label}</span>
                    <span className="font-display text-sm font-semibold tracking-tight break-all text-card-foreground">
                      {t.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
