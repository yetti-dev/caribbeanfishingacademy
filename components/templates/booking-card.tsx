"use client";

import * as React from "react";
import { Minus, Plus, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The sticky booking panel for the tour detail template. Client because the
 * date, guest count and running total are live.
 */
export function BookingCard({
  price = "$88",
  unit = "per guest",
  rating = 4.9,
  reviews = 412,
  serviceFee = 9,
  maxGuests = 12,
  className,
}: {
  price?: string;
  unit?: string;
  rating?: number;
  reviews?: number;
  serviceFee?: number;
  maxGuests?: number;
  className?: string;
}) {
  const [guests, setGuests] = React.useState(2);
  const [date, setDate] = React.useState("");
  const amount = Number(price.replace(/[^0-9.]/g, "")) || 0;
  const currency = price.replace(/[0-9.,]/g, "").trim() || "$";
  const subtotal = amount * guests;
  const total = subtotal + serviceFee;
  const money = (n: number) => `${currency}${n.toLocaleString("en-US")}`;

  const stepBtn =
    "grid size-8 cursor-pointer place-items-center rounded-full border border-border text-foreground transition duration-200 ease-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tracking-tight text-foreground">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
        <span className="ml-auto inline-flex items-center gap-1 text-sm text-foreground">
          <Star aria-hidden className="size-4 fill-current text-primary" />
          {rating.toFixed(1)}
          <span className="text-muted-foreground">({reviews})</span>
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border">
        <div className="border-b border-border p-3">
          <label
            htmlFor="booking-date"
            className="block font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
          >
            Sailing date
          </label>
          <input
            id="booking-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full cursor-pointer bg-transparent text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 p-3">
          <div className="flex-1">
            <span className="block font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Guests
            </span>
            <span className="mt-1 block text-sm text-foreground">
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>
          <button
            type="button"
            aria-label="Remove a guest"
            disabled={guests <= 1}
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className={stepBtn}
          >
            <Minus aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Add a guest"
            disabled={guests >= maxGuests}
            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
            className={stepBtn}
          >
            <Plus aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 w-full cursor-pointer rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Reserve these seats
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        You will not be charged yet. The crew confirms the weather window first.
      </p>

      <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            {price} x {guests} {guests === 1 ? "guest" : "guests"}
          </dt>
          <dd className="text-foreground">{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Marina and fuel levy</dt>
          <dd className="text-foreground">{money(serviceFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 font-semibold">
          <dt className="text-foreground">Total today</dt>
          <dd className="text-foreground">{money(total)}</dd>
        </div>
      </dl>

      <p className="mt-5 flex items-start gap-2 rounded-xl bg-muted p-3 text-xs leading-relaxed text-foreground">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
        Free cancellation until 48 hours before departure, and a full refund whenever the
        captain calls off the trip.
      </p>
    </div>
  );
}
