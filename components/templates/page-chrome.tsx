import {
  Anchor,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/icons";
import { demoContact, demoNav } from "@/content/demo";
import type { Cta, NavItem } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Chrome shared by the whole page templates in this folder.
 *
 * The templates are self contained on purpose: a build agent copies one file
 * plus this one and gets a page that already looks finished. Nothing here
 * imports from components/sections, and nothing uses position fixed, because
 * these render inside a preview column on /sections.
 */

const linkBase =
  "cursor-pointer rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export type NavVariant = "editorial" | "plain" | "compact";

export function PageNav({
  brand = "Blue Water Sail",
  items = demoNav,
  cta,
  variant = "plain",
  className,
}: {
  brand?: string;
  items?: NavItem[];
  cta?: Cta;
  variant?: NavVariant;
  className?: string;
}) {
  if (variant === "editorial") {
    return (
      <nav
        aria-label="Primary"
        className={cn("border-b border-border bg-background", className)}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between py-5">
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Slip 14, Oranjestad
            </p>
            <a
              href="#top"
              className="cursor-pointer font-display text-xl font-semibold tracking-tight text-foreground transition-opacity duration-200 ease-out hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {brand}
            </a>
            <a
              href={cta?.href ?? "#book"}
              className="hidden cursor-pointer text-sm font-medium text-primary underline-offset-4 transition-colors duration-200 ease-out hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:inline"
            >
              {cta?.label ?? "Check availability"}
            </a>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border py-3">
            {items.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={linkBase}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  if (variant === "compact") {
    return (
      <nav
        aria-label="Primary"
        className={cn("border-b border-border bg-background", className)}
      >
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-6 py-3">
          <a
            href="#top"
            className="flex cursor-pointer items-center gap-2 text-primary transition-opacity duration-200 ease-out hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Anchor aria-hidden className="size-5" />
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              {brand}
            </span>
          </a>
          <button
            type="button"
            className="mx-auto hidden cursor-pointer items-center gap-3 rounded-full border border-border bg-card py-2 pr-2 pl-5 text-sm shadow-sm transition-shadow duration-200 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:flex"
          >
            <span className="font-medium text-foreground">Anywhere on the coast</span>
            <span aria-hidden className="h-4 w-px bg-border" />
            <span className="text-muted-foreground">Any week</span>
            <span aria-hidden className="h-4 w-px bg-border" />
            <span className="text-muted-foreground">Add guests</span>
            <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
              <Search aria-hidden className="size-3.5" />
            </span>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <a href="#charters" className={cn(linkBase, "hidden lg:inline-block")}>
              Charter your own boat
            </a>
            <button
              type="button"
              aria-label="Open menu"
              className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 transition-shadow duration-200 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Menu aria-hidden className="size-4 text-muted-foreground" />
              <span className="grid size-6 place-items-center rounded-full bg-muted font-mono text-[10px] text-foreground">
                RO
              </span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Primary"
      className={cn("border-b border-border bg-background", className)}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <a
          href="#top"
          className="flex cursor-pointer items-center gap-2 transition-opacity duration-200 ease-out hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Anchor aria-hidden className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            {brand}
          </span>
        </a>
        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={linkBase}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={cta?.href ?? "#book"}
          className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {cta?.label ?? "Check availability"}
        </a>
      </div>
    </nav>
  );
}

const socialIcons = { Instagram: InstagramIcon, Facebook: FacebookIcon, Youtube: YouTubeIcon } as const;

export function PageFooter({
  brand = "Blue Water Sail",
  blurb = "Twelve guests maximum, local skippers, and a weather promise that actually refunds you.",
  variant = "plain",
  className,
}: {
  brand?: string;
  blurb?: string;
  variant?: "plain" | "editorial" | "compact";
  className?: string;
}) {
  const year = 2026;

  if (variant === "compact") {
    return (
      <footer className={cn("border-t border-border bg-background", className)}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {year} {brand}. Slip 14, Renaissance Marina, Oranjestad.
          </p>
          <ul className="flex flex-wrap items-center gap-4 sm:ml-auto">
            {["Privacy", "Terms", "Cancellation policy", "Safety"].map((l) => (
              <li key={l}>
                <a
                  href="#legal"
                  className="cursor-pointer underline-offset-4 transition-colors duration-200 ease-out hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    );
  }

  if (variant === "editorial") {
    return (
      <footer className={cn("border-t border-border bg-background", className)}>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col gap-8 border-b border-border pb-10 md:flex-row md:items-end">
            <div className="max-w-md">
              <p className="font-display text-3xl font-semibold tracking-tight text-foreground">
                {brand}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
            </div>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 md:ml-auto">
              {demoNav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={cn(linkBase, "px-0")}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <p>
              &copy; {year} {brand}. {demoContact.address}.
            </p>
            <div className="flex items-center gap-3 sm:ml-auto">
              {demoContact.socials.map((s) => {
                const Cmp = socialIcons[s.icon as keyof typeof socialIcons] ?? InstagramIcon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-8 cursor-pointer place-items-center rounded-full border border-border transition-colors duration-200 ease-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Cmp aria-hidden className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={cn("border-t border-border bg-card", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Anchor aria-hidden className="size-4" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              {brand}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{blurb}</p>
          <div className="mt-5 flex items-center gap-3">
            {demoContact.socials.map((s) => {
              const Cmp = socialIcons[s.icon as keyof typeof socialIcons] ?? InstagramIcon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Cmp aria-hidden className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <p className="eyebrow text-foreground">Explore</p>
          <ul className="mt-4 space-y-2">
            {demoNav.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={cn(linkBase, "px-0")}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-foreground">Find us</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              {demoContact.address}
            </li>
            <li className="flex gap-2">
              <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              <a
                href={`tel:${demoContact.phone.replace(/\s/g, "")}`}
                className="cursor-pointer underline-offset-4 transition-colors duration-200 ease-out hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {demoContact.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              <a
                href={`mailto:${demoContact.email}`}
                className="cursor-pointer underline-offset-4 transition-colors duration-200 ease-out hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {demoContact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground">
          &copy; {year} {brand}. Coast guard certified, reef safe since 2013.
        </p>
      </div>
    </footer>
  );
}
