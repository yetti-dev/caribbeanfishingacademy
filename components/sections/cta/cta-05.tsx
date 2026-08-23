import { CalendarCheck } from "lucide-react";
import type { Cta as CtaLink } from "@/content/types";

/** Sticky action bar. Price and availability on the left, the booking button pinned right. */
export function Cta05({ price, priceNote, availability, primary }: {
  price: string; priceNote?: string; availability?: string; primary?: CtaLink;
}) {
  return (
    <div className="sticky bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
        <div className="min-w-0">
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">{price}</span>
            {priceNote ? <span className="text-xs text-muted-foreground">{priceNote}</span> : null}
          </p>
          {availability ? (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
              {availability}
            </p>
          ) : null}
        </div>
        {primary ? (
          <a href={primary.href} className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
            <CalendarCheck aria-hidden className="size-4" />
            {primary.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}
