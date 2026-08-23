"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Link } from "@/content/types";

type FooterColumn = { title: string; links: Link[] };

/** Inverted dark panel: newsletter sign up on the left, four link columns on the right. */
export function Footer03({
  brandName,
  newsletterTitle = "Trip openings, first",
  newsletterBody,
  buttonLabel = "Subscribe",
  columns = [],
  socials = [],
  copyright,
}: {
  brandName: string;
  newsletterTitle?: string;
  newsletterBody?: string;
  buttonLabel?: string;
  columns?: FooterColumn[];
  socials?: Link[];
  copyright?: string;
}) {
  const [sent, setSent] = React.useState(false);

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.35fr]">
          <div>
            <h2 className="max-w-sm font-display text-3xl font-bold tracking-tight text-background">{newsletterTitle}</h2>
            {newsletterBody ? <p className="mt-3 max-w-sm text-sm leading-relaxed text-background/70">{newsletterBody}</p> : null}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1">
                <label htmlFor="footer03-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer03-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-background/25 bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 transition duration-200 ease-out focus-visible:border-background/60 focus-visible:ring-2 focus-visible:ring-background/40 focus-visible:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"
              >
                {buttonLabel}
                <Send aria-hidden className="size-4" />
              </button>
            </form>
            <p aria-live="polite" className="mt-3 h-5 text-xs text-background/70">
              {sent ? "Thanks. Watch your inbox for the next openings." : ""}
            </p>

            <div className="mt-8 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-background/25 text-background/80 transition duration-200 ease-out hover:border-background hover:text-background focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"
                >
                  <SocialIcon name={s.icon} label={s.label} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-background/60">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="cursor-pointer rounded-sm text-sm text-background/85 transition-colors duration-200 ease-out hover:text-background focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-14 border-t border-background/20 pt-6 text-xs text-background/60">
          {copyright ?? `${new Date().getFullYear()} ${brandName}`}
        </p>
      </div>
    </footer>
  );
}
