import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Quote01 } from "@/components/sections/quote/quote-01";
import { Quote02 } from "@/components/sections/quote/quote-02";
import { Quote03 } from "@/components/sections/quote/quote-03";
import { Quote04 } from "@/components/sections/quote/quote-04";
import { demoQuotes } from "@/content/demo";

export const QUOTE_ENTRIES: CatalogEntry[] = [
  { code: "QUOTE-01", category: "Quote", label: "Full bleed colour band, one oversized quote",
    file: "components/sections/quote/quote-01.tsx", component: "Quote01", props: "quote: Quote",
    node: <Quote01 quote={demoQuotes[0]} /> },
  { code: "QUOTE-02", category: "Quote", label: "Founder quote beside a portrait, signature name",
    file: "components/sections/quote/quote-02.tsx", component: "Quote02", props: "quote: Quote, since?: string",
    node: <Quote02 quote={demoQuotes[1]} since="Sailing out of Slip 14 since 2013" /> },
  { code: "QUOTE-03", category: "Quote", label: "Editorial pull quote breaking out of a text column",
    file: "components/sections/quote/quote-03.tsx", component: "Quote03", props: "quote: Quote, before?: string[], after?: string[]",
    node: <Quote03 quote={demoQuotes[2]}
      before={["We bought the second boat in 2016 because the first one kept selling out by March, not because we wanted a fleet.", "The rule has not changed since: twelve guests, two crew, and nobody waiting for the ladder."]}
      after={["That is also why we still cook lunch aboard instead of handing out a packed box at the dock."]} /> },
  { code: "QUOTE-04", category: "Quote", label: "Three short quotes in a row, vertical rules between",
    file: "components/sections/quote/quote-04.tsx", component: "Quote04", props: "eyebrow?: string, quotes: Quote[]",
    node: <Quote04 eyebrow="From the logbook" quotes={demoQuotes} /> },
];
