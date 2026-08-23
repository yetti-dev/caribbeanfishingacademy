import { Icon } from "@/components/sections/icon";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Img, Link } from "@/content/types";

/** One hairline, one row. Wordmark left, links centred, copyright right. */
export function Footer01({
  brandName,
  logo,
  links = [],
  socials = [],
  copyright,
}: {
  brandName: string;
  logo?: Img;
  links?: Link[];
  socials?: Link[];
  copyright?: string;
}) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-8 md:flex-row md:justify-between">
        <a
          href="/"
          className="flex cursor-pointer items-center gap-2.5 rounded-md transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {logo ? (
            <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" className="h-7 w-auto rounded-sm object-cover" />
          ) : (
            <span aria-hidden className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Icon name="Anchor" className="size-4" />
            </span>
          )}
          <span className="font-display text-base font-semibold tracking-tight text-foreground">{brandName}</span>
        </a>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="cursor-pointer rounded-sm text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
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
          <p className="text-xs text-muted-foreground">
            {copyright ?? `${new Date().getFullYear()} ${brandName}`}
          </p>
        </div>
      </div>
    </footer>
  );
}
