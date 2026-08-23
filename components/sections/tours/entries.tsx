import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Tour01 } from "@/components/sections/tours/tour-01";
import { Tour02 } from "@/components/sections/tours/tour-02";
import { Tour03 } from "@/components/sections/tours/tour-03";
import { Tour04 } from "@/components/sections/tours/tour-04";
import { Tour05 } from "@/components/sections/tours/tour-05";
import { Tour06 } from "@/components/sections/tours/tour-06";
import { Tour07 } from "@/components/sections/tours/tour-07";
import { Tour08 } from "@/components/sections/tours/tour-08";
import { Tour09 } from "@/components/sections/tours/tour-09";
import { Tour10 } from "@/components/sections/tours/tour-10";
import { Tour11 } from "@/components/sections/tours/tour-11";
import { Tour12 } from "@/components/sections/tours/tour-12";
import { Tour13 } from "@/components/sections/tours/tour-13";
import { Tour14 } from "@/components/sections/tours/tour-14";
import { Tour15 } from "@/components/sections/tours/tour-15";
import { demoContact, demoTiers, demoTours } from "@/content/demo";

export const TOUR_ENTRIES: CatalogEntry[] = [
  {
    code: "TOUR-01",
    category: "Tours",
    label: "Marketplace photo grid, four up, with a floating save button and one inline star",
    file: "components/sections/tours/tour-01.tsx",
    component: "Tour01",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour01
        heading={{
          eyebrow: "Departing Slip 14",
          title: "Every trip we run out of Renaissance Marina",
          body: "Twelve guests maximum, gear and lunch aboard, and a captain who has read this water for twelve seasons.",
        }}
        tours={demoTours.slice(0, 4)}
        cta={{ label: "See all departures", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-02",
    category: "Tours",
    label: "Booking site rows: photo left, details middle, bordered price rail and button on the right",
    file: "components/sections/tours/tour-02.tsx",
    component: "Tour02",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour02
        heading={{
          eyebrow: "Availability this week",
          title: "Pick a trip, pick a time, we hold the slot",
          body: "Fares shown are per guest with tax included. Free rebooking if the captain calls it off for weather.",
        }}
        tours={demoTours.slice(0, 4)}
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-03",
    category: "Tours",
    label: "Three up cards where the fare chip overlaps the seam between photo and body",
    file: "components/sections/tours/tour-03.tsx",
    component: "Tour03",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour03
        heading={{
          eyebrow: "Blue Water Sail",
          title: "Three ways to spend a day on this coast",
          body: "Reef in the morning, coast run at midday, dinner under the lighthouse at golden hour.",
        }}
        tours={demoTours.slice(0, 3)}
        cta={{ label: "See the itinerary", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-04",
    category: "Tours",
    label: "Three tier fare cards, the middle one scaled up on the brand colour with a ticked list",
    file: "components/sections/tours/tour-04.tsx",
    component: "Tour04",
    props: "heading?: SectionHeading, tiers: PriceTier[], cta?: Cta",
    node: (
      <Tour04
        heading={{
          eyebrow: "Fares",
          title: "What a day aboard costs",
          body: "One price per guest. Snorkel gear, lunch and soft drinks are in the fare, not bolted on at the dock.",
        }}
        tiers={demoTiers}
        cta={{ label: "Book this trip", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-05",
    category: "Tours",
    label: "Comparison table, one row per inclusion and one column per fare, header row sticks while you scroll",
    file: "components/sections/tours/tour-05.tsx",
    component: "Tour05",
    props: "heading?: SectionHeading, tiers: PriceTier[], cta?: Cta",
    sticky: true,
    node: (
      <Tour05
        heading={{
          eyebrow: "Compare",
          title: "What is aboard on each trip",
          body: "The half day, the full day and the private charter, line by line, so nothing is a surprise at Slip 14.",
        }}
        tiers={demoTiers}
        cta={{ label: "Book", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-06",
    category: "Tours",
    label: "Bento: one hero trip fills half the grid full bleed, three thumbnail rows fill the other half",
    file: "components/sections/tours/tour-06.tsx",
    component: "Tour06",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour06
        heading={{
          eyebrow: "Most booked",
          title: "The sunset run, and three good alternatives",
          body: "If the evening trip is full, these three leave from the same slip and end just as well.",
        }}
        tours={demoTours.slice(0, 4)}
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-07",
    category: "Tours",
    label: "Editorial index with no cards: hairline rows, oversized numerals, stamp thumbnail, fare set right in mono",
    file: "components/sections/tours/tour-07.tsx",
    component: "Tour07",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour07
        heading={{
          eyebrow: "The full list",
          title: "Six trips, one marina, no upsell at the dock",
          body: "Everything Blue Water Sail runs out of Oranjestad, in the order the boats leave.",
        }}
        tours={demoTours}
        cta={{ label: "Book", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-08",
    category: "Tours",
    label: "Tall portrait poster cards on an auto advancing rail, copy on a solid surface below the photo",
    file: "components/sections/tours/tour-08.tsx",
    component: "Tour08",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour08
        heading={{
          eyebrow: "On the water this month",
          title: "Trips that fill first in high season",
          body: "Ten days ahead for the sunset cruise, a full week for a private charter so the galley can plan.",
        }}
        tours={demoTours}
        cta={{ label: "Reserve a seat", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-09",
    category: "Tours",
    label: "Two up cards closed off by a three cell spec strip: hours, departure point, group size",
    file: "components/sections/tours/tour-09.tsx",
    component: "Tour09",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour09
        heading={{
          eyebrow: "Trip details",
          title: "Times, meeting point and group size up front",
          body: "Every trip boards at Slip 14, Renaissance Marina, fifteen minutes before departure. Parking is free.",
        }}
        tours={demoTours.slice(0, 4)}
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-10",
    category: "Tours",
    label: "Quiet cards that lift on hover or keyboard focus and roll out the what is included list",
    file: "components/sections/tours/tour-10.tsx",
    component: "Tour10",
    props: "heading?: SectionHeading, tours: Tour[], included?: string[], cta?: Cta",
    node: (
      <Tour10
        heading={{
          eyebrow: "Included in every fare",
          title: "The price at the dock is the price you booked",
          body: "Hover a trip to see what comes with it. Nothing on this list is an extra.",
        }}
        tours={demoTours.slice(0, 3)}
        included={[
          "Masks, fins and vests in every size",
          "Lunch grilled on the back deck",
          "Cold drinks and shade all day",
          "Reef safe sunscreen aboard",
          "Free rebooking if the captain calls it off",
        ]}
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-11",
    category: "Tours",
    label: "Ticket stubs with punched notches, a dashed tear line between trip and fare, and a mono booking reference",
    file: "components/sections/tours/tour-11.tsx",
    component: "Tour11",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour11
        heading={{
          eyebrow: "Your boarding pass",
          title: "Book online, show the stub at Slip 14",
          body: "No printing, no paperwork. The crew ticks you off the list and you are aboard.",
        }}
        tours={demoTours.slice(0, 3)}
        cta={{ label: "Get your ticket", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-12",
    category: "Tours",
    label: "Dark ink section, three up, with the brand accent at low alpha and a travelling beam on the featured trip",
    file: "components/sections/tours/tour-12.tsx",
    component: "Tour12",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta, featuredIndex?: number",
    node: (
      <Tour12
        heading={{
          eyebrow: "Private charter",
          title: "Take the whole boat for the evening",
          body: "Up to twelve guests, your route, your playlist. The crew handles the catering and the paperwork.",
        }}
        tours={demoTours.slice(0, 3)}
        featuredIndex={0}
        cta={{ label: "Enquire about a charter", href: "#contact" }}
      />
    ),
  },
  {
    code: "TOUR-13",
    category: "Tours",
    label: "Chip filtered grid driven by the trip tags, with a live result count and a real empty state",
    file: "components/sections/tours/tour-13.tsx",
    component: "Tour13",
    props: "heading?: SectionHeading, tours: Tour[], allLabel?: string, cta?: Cta",
    node: (
      <Tour13
        heading={{
          eyebrow: "Find your trip",
          title: "Filter by what you actually want from the day",
          body: "Morning glass water, an afternoon on the reef, or the whole boat to yourselves.",
        }}
        tours={demoTours}
        allLabel="Every trip"
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-14",
    category: "Tours",
    label: "Map panel that sticks on one side while a compact trip list scrolls past it",
    file: "components/sections/tours/tour-14.tsx",
    component: "Tour14",
    props: "heading?: SectionHeading, tours: Tour[], mapQuery: string, bbox?: string, marker?: string, cta?: Cta",
    sticky: true,
    node: (
      <Tour14
        heading={{
          eyebrow: "Where we sail from",
          title: "Slip 14, Renaissance Marina, Oranjestad",
          body: "Two minutes from the bus stop, free parking on the quay, and the boats are visible from the gate.",
        }}
        tours={demoTours}
        mapQuery={demoContact.mapQuery}
        cta={{ label: "Get directions", href: "#contact" }}
      />
    ),
  },
  {
    code: "TOUR-15",
    category: "Tours",
    label: "Head to head comparison of two trips on a shared row grid, popular one wearing a ribbon",
    file: "components/sections/tours/tour-15.tsx",
    component: "Tour15",
    props: "heading?: SectionHeading, tours: Tour[], popularIndex?: number, cta?: Cta",
    node: (
      <Tour15
        heading={{
          eyebrow: "Half day or full day",
          title: "Three hours on the reef, or six down the coast",
          body: "The two trips guests weigh up most often, every line on the same baseline so you can read across.",
        }}
        tours={demoTours.slice(1, 3)}
        popularIndex={0}
        cta={{ label: "Book this trip", href: "#book" }}
      />
    ),
  },
];
