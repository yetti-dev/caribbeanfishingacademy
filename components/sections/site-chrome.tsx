import { Nav10 } from "@/components/sections/nav/nav-10";
import { Footer08 } from "@/components/sections/footer/footer-08";
import { brand } from "@/brand.config";
import { site } from "@/content/site";

/**
 * Shared chrome for every route. One navbar, one footer, wired once so the
 * real logo, the exact source nav order and the real contact details stay
 * consistent across all thirteen pages instead of being re-typed per page.
 */
export function SiteHeader() {
  return (
    <Nav10
      items={site.nav}
      cta={site.navCta}
      logo={{ src: "/brand/logo.png", alt: `${brand.name} logo` }}
      brandName="Caribbean Fishing Academy"
      phone={brand.contact.phone}
    />
  );
}

export function SiteFooter() {
  return (
    <Footer08
      brandName="Caribbean Fishing Academy"
      logo={{ src: "/brand/logo.png", alt: `${brand.name} logo` }}
      tagline={site.footer.blurb}
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
