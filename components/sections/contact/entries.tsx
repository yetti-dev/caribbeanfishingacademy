import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Contact01 } from "@/components/sections/contact/contact-01";
import { Contact02 } from "@/components/sections/contact/contact-02";
import { Contact03 } from "@/components/sections/contact/contact-03";
import { Contact04 } from "@/components/sections/contact/contact-04";
import { Contact05 } from "@/components/sections/contact/contact-05";
import { demoContact, demoTours } from "@/content/demo";

export const CONTACT_ENTRIES: CatalogEntry[] = [
  {
    code: "CONTACT-01",
    category: "Contact",
    label: "Split: form on the left, marina details and opening hours on a raised card",
    file: "components/sections/contact/contact-01.tsx",
    component: "Contact01",
    props: "heading: SectionHeading, contact: ContactDetails, submitLabel?, successTitle?, successBody?",
    node: (
      <Contact01
        heading={{
          eyebrow: "Talk to the crew",
          title: "Ask us about a date, a boat, or the weather",
          body: "Slip 14 is at the far end of Renaissance Marina, past the fuel dock. Send a note and we will tell you exactly where to stand.",
        }}
        contact={demoContact}
      />
    ),
  },
  {
    code: "CONTACT-02",
    category: "Contact",
    label: "Enquiry card overlapping a full width OpenStreetMap strip, no API key",
    file: "components/sections/contact/contact-02.tsx",
    component: "Contact02",
    props: "heading: SectionHeading, contact: ContactDetails, bbox?, marker?, mapTitle?, submitLabel?",
    leadsWithMedia: true,
    node: (
      <Contact02
        heading={{
          eyebrow: "Slip 14",
          title: "Come and find us",
          body: "Park at the Renaissance lot, walk to the water, turn left. We are the catamaran with the blue sail cover.",
        }}
        contact={demoContact}
      />
    ),
  },
  {
    code: "CONTACT-03",
    category: "Contact",
    label: "Full booking enquiry in two numbered steps: date, guest count, trip select, crew notes",
    file: "components/sections/contact/contact-03.tsx",
    component: "Contact03",
    props: "heading: SectionHeading, tours: BookableTour[], contact: ContactDetails, reassurance?: string[]",
    node: (
      <Contact03
        heading={{
          eyebrow: "Booking enquiry",
          title: "Hold a morning on the water",
          body: "Tell us the date and the party size. We check the tide, the boat and the crew roster, then come back with a time.",
        }}
        tours={demoTours}
        contact={demoContact}
      />
    ),
  },
  {
    code: "CONTACT-04",
    category: "Contact",
    label: "Minimal centred form, three direct tiles below for call, WhatsApp and email",
    file: "components/sections/contact/contact-04.tsx",
    component: "Contact04",
    props: "heading: SectionHeading, contact: ContactDetails, whatsappText?, submitLabel?",
    node: (
      <Contact04
        heading={{
          eyebrow: "Say hello",
          title: "Three fields, that is all",
          body: "No account, no forty question form. Write a line and a person reads it.",
        }}
        contact={demoContact}
      />
    ),
  },
  {
    code: "CONTACT-05",
    category: "Contact",
    label: "Two panels: inverted brand form on one side, a before you write list on the other",
    file: "components/sections/contact/contact-05.tsx",
    component: "Contact05",
    props: "heading: SectionHeading, notes: PreflightNote[], contact: ContactDetails, formTitle?",
    node: (
      <Contact05
        heading={{
          eyebrow: "Contact",
          title: "Most answers are already here",
          body: "The questions below cover about half the mail we get. If yours is not one of them, the form is right there.",
        }}
        notes={[
          {
            q: "Can we sail if it rains?",
            a: "Usually yes. Rain here passes in twenty minutes. We only cancel for wind over 25 knots, and then you reschedule free or take a full refund.",
          },
          {
            q: "Do you take children?",
            a: "From four years up on the half day trips, any age on a private charter. Child sized buoyancy aids are aboard every boat.",
          },
          {
            q: "Is snorkel gear included?",
            a: "Mask, snorkel and fins are supplied and sanitised between trips. Bring your own if you prefer a prescription mask.",
          },
          {
            q: "Where exactly do we meet?",
            a: "Slip 14, Renaissance Marina, Oranjestad. Fifteen minutes before departure, at the top of the finger dock.",
          },
        ]}
        contact={demoContact}
      />
    ),
  },
];
