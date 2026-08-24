import * as React from "react";
import { ACTIVITY_IDS } from "@/content/activities";
import { cn } from "@/lib/utils";

/**
 * A real booking trigger. `data-yetti-activity` is picked up by the global
 * click listener in `components/widget/yetti-booking.tsx`, which opens the
 * Yetti checkout modal for that activity (or a general one, if empty).
 */
export function BookButton({
  activityId = "",
  className,
  children,
}: {
  activityId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" data-yetti-activity={activityId} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
}

/**
 * Parses assistant chat replies for the one HTML fragment the FAQ system
 * prompt is allowed to emit: `<button data-yetti-activity="ID">Label</button>`.
 * Renders that fragment as a real, working `<BookButton>`; everything else
 * stays plain, auto-escaped text. This is deliberately NOT a general HTML
 * renderer (no dangerouslySetInnerHTML on model output) so a prompt
 * injection attempt in a user message can't smuggle in arbitrary markup,
 * only ever a booking button for a real, whitelisted activity ID.
 */
const BUTTON_RE = /<button\s+data-yetti-activity="([0-9a-fA-F-]*)"\s*>([^<]*)<\/button>/g;

export function renderChatContent(content: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  BUTTON_RE.lastIndex = 0;
  while ((match = BUTTON_RE.exec(content))) {
    const [full, id, label] = match;
    if (match.index > last) nodes.push(content.slice(last, match.index));
    if (id === "" || ACTIVITY_IDS.includes(id)) {
      nodes.push(
        <BookButton
          key={`book-${key++}`}
          activityId={id}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
        >
          {label || "Book Now"}
        </BookButton>,
      );
    } else {
      // Unknown id, never invented by the system prompt: render as plain text, not a live button.
      nodes.push(full);
    }
    last = match.index + full.length;
  }
  if (last < content.length) nodes.push(content.slice(last));
  return nodes;
}
