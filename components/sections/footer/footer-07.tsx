import { Mail, MapPin, Phone } from "lucide-react";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Img, Link } from "@/content/types";

type FooterContact = {
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  hours?: { day: string; time: string }[];
};

/** Contact first: the dock details and an hours table, with a small photo card alongside. */
export function Footer07({
  brandName,
  tagline,
  contact,
  image,
  links = [],
  socials = [],
  copyright,
}: {
  brandName: string;
  tagline?: string;
  contact?: FooterContact;
  image?: Img;
  links?: Link[];
  socials?: Link[];
  copyright?: string;
}) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr_auto]">
          <div>
            <p className="eyebrow text-primary">Find us</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-card-foreground">{brandName}</h2>
            {tagline ? <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{tagline}</p> : null}

            <ul className="mt-7 space-y-4 text-sm">
              {contact?.address ? (
                <li className="flex items-start gap-3">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-card-foreground">{contact.address}</span>
                </li>
              ) : null}
              {contact?.phone ? (
                <li className="flex items-start gap-3">
                  <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="cursor-pointer rounded-sm text-card-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact?.email ? (
                <li className="flex items-start gap-3">
                  <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="cursor-pointer rounded-sm text-card-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>

            <div className="mt-7 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-9 cursor-pointer place-items-center rounded-lg bg-muted text-muted-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <SocialIcon name={s.icon} label={s.label} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            {contact?.hours?.length ? (
              <>
                <p className="eyebrow text-muted-foreground">Sailing hours</p>
                <table className="mt-5 w-full max-w-sm text-sm">
                  <caption className="sr-only">Opening hours at the dock</caption>
                  <tbody>
                    {contact.hours.map((h) => (
                      <tr key={h.day} className="border-b border-border last:border-b-0">
                        <th scope="row" className="py-3 text-left font-normal text-muted-foreground">
                          {h.day}
                        </th>
                        <td className="py-3 text-right font-mono text-xs text-card-foreground">{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : null}

            <nav aria-label="Footer" className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="cursor-pointer rounded-sm text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {image ? (
            <figure className="w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-background">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              {image.caption ? (
                <figcaption className="px-4 py-3 text-xs leading-relaxed text-muted-foreground">{image.caption}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>

        <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          {copyright ?? `${new Date().getFullYear()} ${brandName}`}
        </p>
      </div>
    </footer>
  );
}
