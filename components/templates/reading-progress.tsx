"use client";

import * as React from "react";

/**
 * A hairline progress bar for the article templates.
 *
 * Isolated in its own file so the page around it stays a Server Component, and
 * sticky rather than fixed so it behaves inside the /sections preview column.
 */
export function ReadingProgress({ label = "Reading progress" }: { label?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const host = ref.current?.parentElement;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setPct(100);
        return;
      }
      const done = Math.min(Math.max(-rect.top / total, 0), 1);
      setPct(Math.round(done * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="sticky top-0 z-30 h-1 w-full bg-muted">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${pct}%` }}
        className="h-full bg-primary transition-[width] duration-150 ease-out motion-reduce:transition-none"
      />
    </div>
  );
}
