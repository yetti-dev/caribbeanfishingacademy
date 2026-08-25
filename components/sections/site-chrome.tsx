import { Nav11 } from "@/components/sections/nav/nav-11";
import { Footer11 } from "@/components/sections/footer/footer-11";
import { brand } from "@/brand.config";
import { site } from "@/content/site";

/**
 * Shared chrome for every route. One navbar, one footer, wired once so the
 * real logo, the exact source nav order and the real contact details stay
 * consistent across all thirteen pages instead of being re-typed per page.
 *
 * Nav11 is `fixed`, floating translucent over whatever sits at the top of
 * the page (a full-bleed hero, by design on every route), so it never
 * pushes content down and never needs a solid "scrolled" state.
 */
export function SiteHeader() {
  return <Nav11 items={site.nav} cta={site.navCta} logo={{ src: "/brand/logo.png", alt: `${brand.name} logo` }} />;
}

export function SiteFooter() {
  return (
    <Footer11
      logo={{ src: "/brand/logo.png", alt: `${brand.name} logo` }}
      blurb={site.footer.blurb}
      columns={site.footer.groups.map((g) => ({ title: g.title, links: [...g.links] }))}
      contact={{
        address: brand.contact.address,
        phone: brand.contact.phone,
        email: brand.contact.email,
      }}
      socials={brand.social.facebook ? [{ label: "Facebook", href: brand.social.facebook, icon: "facebook" }] : []}
      copyright={`© ${new Date().getFullYear()} ${site.footer.legal}`}
    />
  );
}
