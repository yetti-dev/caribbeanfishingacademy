"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { SectionHeading } from "@/content/types";

/** Newsletter capture. One field, one button, one line of reassurance. */
export function Cta04({ heading, buttonLabel = "Subscribe", placeholder = "you@example.com", footnote, successNote = "Thanks. Check your inbox to confirm." }: {
  heading: SectionHeading; buttonLabel?: string; placeholder?: string; footnote?: string; successNote?: string;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="border-y border-border bg-card py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Mail aria-hidden className="size-5" />
          </span>
          {heading.eyebrow ? <p className="eyebrow mt-6 text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{heading.title}</h2>
          {heading.body ? <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          <form
            onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSent(true); }}
            className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="cta04-email" className="sr-only">Email address</label>
            <input
              id="cta04-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full flex-1 rounded-lg border border-border bg-background px-4 py-3.5 text-sm text-foreground transition duration-200 ease-out placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            />
            <button
              type="submit"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {buttonLabel}
              <Send aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </button>
          </form>
          <p aria-live="polite" className="mt-4 text-xs text-muted-foreground">{sent ? successNote : footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
