import { Mail, MapPin, Phone } from "lucide-react";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Cta, Img, Link } from "@/content/types";

type FooterColumn = { title: string; links: Link[] };
type FooterContact = { address?: string; phone?: string; email?: string };
type FooterSocial = { label: string; href: string; icon?: string };

/**
 * Four column footer on a saturated navy band: brand + contact, two link
 * columns, socials + booking CTA, then a hairline and a copyright bar.
 * Matches arubaflagship.getyetti.com's footer structure exactly.
 */
export function Footer11({
  logo,
  blurb,
  contact,
  columns,
  socials = [],
  cta,
  copyright,
}: {
  logo: Img;
  blurb?: string;
  contact?: FooterContact;
  columns: FooterColumn[];
  socials?: FooterSocial[];
  cta?: Cta;
  copyright?: string;
}) {
  return (
    <footer className="mt-auto bg-navy text-navy-foreground">
      <div className="container-px mx-auto grid max-w-6xl gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <a href="/" className="flex cursor-pointer items-center gap-2">
            <img src={logo.src} alt={logo.alt} className="h-11 w-auto object-contain" />
          </a>
          {blurb ? <p className="mt-4 max-w-xs text-sm text-navy-foreground/75">{blurb}</p> : null}
          <div className="mt-5 space-y-2.5 text-sm text-navy-foreground/80">
            {contact?.address ? (
              <p className="flex items-center gap-2">
                <MapPin aria-hidden className="size-4 shrink-0 text-primary" />
                {contact.address}
              </p>
            ) : null}
            {contact?.phone ? (
              <a
                href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                className="flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-navy-foreground"
              >
                <Phone aria-hidden className="size-4 shrink-0 text-primary" />
                {contact.phone}
              </a>
            ) : null}
            {contact?.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-navy-foreground"
              >
                <Mail aria-hidden className="size-4 shrink-0 text-primary" />
                {contact.email}
              </a>
            ) : null}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold tracking-wide uppercase">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="cursor-pointer text-sm text-navy-foreground/80 transition-colors duration-200 hover:text-navy-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-display text-sm font-semibold tracking-wide uppercase">Follow Us</h4>
          {socials.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-navy-foreground/20 text-navy-foreground/80 transition-colors duration-200 hover:border-primary/60 hover:bg-primary/15 hover:text-primary"
                >
                  <SocialIcon name={s.icon} label={s.label} className="size-4" />
                </a>
              ))}
            </div>
          ) : null}
          {cta ? (
            <a
              href={cta.href}
              className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-navy focus-visible:outline-none"
            >
              {cta.label}
            </a>
          ) : null}
        </div>
      </div>

      <div className="border-t border-navy-foreground/15">
        <div className="container-px mx-auto max-w-6xl py-6 text-center text-xs text-navy-foreground/70 sm:text-left">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
