import type { CatalogEntry } from "@/components/sections/catalog-types";
import type { NavItem } from "@/content/types";
import { Nav06 } from "@/components/sections/nav/nav-06";
import { Nav07 } from "@/components/sections/nav/nav-07";
import { Nav08 } from "@/components/sections/nav/nav-08";
import { Nav09 } from "@/components/sections/nav/nav-09";
import { Nav10 } from "@/components/sections/nav/nav-10";
import { demoCta, demoContact, demoNav, img } from "@/content/demo";

/** demoNav plus a lucide icon per item, for the rail nav that renders icons. */
const iconNav: NavItem[] = demoNav.map((it, i) => ({
  ...it,
  icon: ["Sailboat", "Anchor", "Images", "Star", "MapPin"][i] ?? "Circle",
}));

export const NAV_ENTRIES: CatalogEntry[] = [
  {
    code: "NAV-06",
    category: "Navbar",
    label: "Hairline bar with a Menu word button that takes over the screen: oversized numbered links, staggered in, contact rail beside them",
    file: "components/sections/nav/nav-06.tsx",
    component: "Nav06",
    props: "items: NavItem[], cta?: Cta, logo?, brandName?, meta?: { label, value, href? }[]",
    sticky: true,
    node: (
      <Nav06
        items={demoNav}
        cta={demoCta}
        brandName="Blue Water Sail"
        meta={[
          { label: "Dock", value: demoContact.address },
          { label: "Call the dock", value: demoContact.phone, href: `tel:${demoContact.phone.replace(/\s/g, "")}` },
          { label: "Sunday hours", value: "08:00 to 17:00" },
        ]}
      />
    ),
  },
  {
    code: "NAV-07",
    category: "Navbar",
    label: "Search first bar: the centre is a command trigger, Cmd K or slash opens a filterable palette of every tour and page",
    file: "components/sections/nav/nav-07.tsx",
    component: "Nav07",
    props: "items: NavItem[], cta?: Cta, logo?, brandName?, placeholder?: string",
    sticky: true,
    node: <Nav07 items={demoNav} cta={demoCta} brandName="Blue Water Sail" placeholder="Search tours, boats and pages" />,
  },
  {
    code: "NAV-08",
    category: "Navbar",
    label: "Floating vertical rail down the left edge that widens on hover to show labels, squared top bar and drawer on mobile",
    file: "components/sections/nav/nav-08.tsx",
    component: "Nav08",
    props: "items: NavItem[] (icon per item), cta?: Cta, logo?, brandName?",
    sticky: true,
    overlay: true,
    tallPreview: true,
    node: <Nav08 items={iconNav} cta={{ ...demoCta, icon: "CalendarCheck" }} brandName="Blue Water Sail" />,
  },
  {
    code: "NAV-09",
    category: "Navbar",
    label: "Auto hide bar: slides away scrolling down, returns scrolling up, reading progress hairline, children open an inline tray",
    file: "components/sections/nav/nav-09.tsx",
    component: "Nav09",
    props: "items: NavItem[], cta?: Cta, logo?, brandName?",
    sticky: true,
    node: <Nav09 items={demoNav} cta={demoCta} brandName="Blue Water Sail" />,
  },
  {
    code: "NAV-10",
    category: "Navbar",
    label: "Two row header: utility strip with phone, hours and socials rolls away on scroll, mega panel carries a featured photo card",
    file: "components/sections/nav/nav-10.tsx",
    component: "Nav10",
    props: "items: NavItem[], cta?: Cta, logo?, brandName?, phone?, hours?, socials?: Link[], featured?: { image: Img, eyebrow?, title, body, href }",
    sticky: true,
    node: (
      <Nav10
        items={demoNav}
        cta={demoCta}
        brandName="Blue Water Sail"
        phone={demoContact.phone}
        hours="Slip 14, Renaissance Marina, 07:00 to 19:00"
        socials={demoContact.socials}
        featured={{
          image: img(4, "Sailboat anchored off a quiet reef at first light"),
          eyebrow: "Most booked",
          title: "Sunset cruise, 17:30",
          body: "Three hours out of Slip 14, twelve guests, grilled catch aboard and the ride back under sail.",
          href: "#sunset",
        }}
      />
    ),
  },
];
