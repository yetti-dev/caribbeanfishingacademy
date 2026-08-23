import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Link } from "@/content/types";

type FooterContact = {
  address?: string;
  phone?: string;
  email?: string;
  mapQuery?: string;
  hours?: { day: string; time: string }[];
};

/** A full width map strip across the top, then the details bar underneath. */
export function Footer04({
  brandName,
  contact,
  links = [],
  socials = [],
  copyright,
}: {
  brandName: string;
  contact?: FooterContact;
  links?: Link[];
  socials?: Link[];
  copyright?: string;
}) {
  const query = contact?.mapQuery ?? contact?.address ?? "";
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;

  return (
    <footer className="border-t border-border bg-background">
      {query ? (
        <div className="relative h-64 w-full overflow-hidden border-b border-border bg-muted sm:h-80">
          <iframe
            src={src}
            title={`Map showing ${query}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full grayscale-[0.35] contrast-[1.05]"
          />
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-xl font-bold tracking-tight text-foreground">{brandName}</p>
            {contact?.address ? (
              <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                {contact.address}
              </p>
            ) : null}
          </div>

          <div className="space-y-3 md:col-span-1">
            {contact?.phone ? (
              <a
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="flex cursor-pointer items-center gap-2 rounded-sm text-sm text-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Phone aria-hidden className="size-4 text-primary" />
                {contact.phone}
              </a>
            ) : null}
            {contact?.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="flex cursor-pointer items-center gap-2 rounded-sm text-sm text-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Mail aria-hidden className="size-4 text-primary" />
                {contact.email}
              </a>
            ) : null}
          </div>

          <div className="md:col-span-1">
            {contact?.hours?.length ? (
              <>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock aria-hidden className="size-4 text-primary" />
                  Dock hours
                </p>
                <dl className="mt-3 space-y-1.5 text-sm">
                  {contact.hours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{h.day}</dt>
                      <dd className="font-mono text-xs text-foreground">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}
          </div>

          <nav aria-label="Footer" className="md:col-span-1">
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="cursor-pointer rounded-sm text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{copyright ?? `${new Date().getFullYear()} ${brandName}`}</p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="cursor-pointer rounded-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
