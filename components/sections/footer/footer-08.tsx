import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Link } from "@/content/types";

type FooterColumn = { title: string; links: Link[] };
type FooterContact = { address?: string; phone?: string; email?: string; whatsapp?: string };

/** Split down the middle: navigation on a card half, contact on a saturated brand half. */
export function Footer08({
  brandName,
  tagline,
  columns = [],
  contact,
  socials = [],
  copyright,
}: {
  brandName: string;
  tagline?: string;
  columns?: FooterColumn[];
  contact?: FooterContact;
  socials?: Link[];
  copyright?: string;
}) {
  return (
    <footer className="grid border-t border-border lg:grid-cols-2">
      <div className="bg-card px-6 py-16 lg:px-14">
        <div className="ml-auto max-w-lg lg:mr-10">
          <p className="font-display text-2xl font-bold tracking-tight text-card-foreground">{brandName}</p>
          {tagline ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tagline}</p> : null}

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-primary">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="cursor-pointer rounded-sm text-sm text-card-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 text-xs text-muted-foreground">{copyright ?? `${new Date().getFullYear()} ${brandName}`}</p>
        </div>
      </div>

      <div className="bg-primary px-6 py-16 text-primary-foreground lg:px-14">
        <div className="max-w-lg">
          <p className="eyebrow opacity-75">Talk to the crew</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight">Call the dock, we answer</h2>
          {contact?.address ? <p className="mt-4 text-sm leading-relaxed opacity-90">{contact.address}</p> : null}

          <ul className="mt-8 space-y-3">
            {contact?.phone ? (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="group inline-flex cursor-pointer items-center gap-3 rounded-md text-lg font-semibold transition-opacity duration-200 ease-out hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
                >
                  <Phone aria-hidden className="size-4" />
                  {contact.phone}
                  <ArrowUpRight aria-hidden className="size-4 opacity-0 transition duration-200 ease-out group-hover:opacity-100" />
                </a>
              </li>
            ) : null}
            {contact?.whatsapp ? (
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  className="inline-flex cursor-pointer items-center gap-3 rounded-md text-sm transition-opacity duration-200 ease-out hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
                >
                  <MessageCircle aria-hidden className="size-4" />
                  WhatsApp {contact.whatsapp}
                </a>
              </li>
            ) : null}
            {contact?.email ? (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex cursor-pointer items-center gap-3 rounded-md text-sm transition-opacity duration-200 ease-out hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
                >
                  <Mail aria-hidden className="size-4" />
                  {contact.email}
                </a>
              </li>
            ) : null}
          </ul>

          <div className="mt-10 flex items-center gap-3 border-t border-primary-foreground/25 pt-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-primary-foreground/40 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
              >
                <SocialIcon name={s.icon} label={s.label} className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
