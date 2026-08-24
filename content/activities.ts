/**
 * Yetti booking activity IDs. These map 1:1 to bookable trips on the live
 * site and to the FAQ assistant's booking buttons (app/(site)/api/chat and
 * components/widget/faq-widget.tsx). Never invent an ID, only these four
 * exist in the booking system.
 */
export const ACTIVITIES = {
  inshore: {
    id: "3570feb3-ab62-42de-abcd-2815c5e93660",
    label: "Inshore Fishing Charters",
  },
  offshore: {
    id: "2b758394-5995-48a9-ad9d-97e5ddb2f94a",
    label: "Offshore / Deep Sea Fishing Charters",
  },
  reef: {
    id: "04124242-64c0-4c2f-8d26-3df965310bd4",
    label: "Reef Fishing Charters",
  },
  sunsetCruise: {
    id: "6b8ba3af-4b39-479c-a42e-4cdd5a576417",
    label: "Sunset or Bay Cruise",
  },
} as const;

export const ACTIVITY_IDS: string[] = Object.values(ACTIVITIES).map((a) => a.id);

export default ACTIVITIES;
