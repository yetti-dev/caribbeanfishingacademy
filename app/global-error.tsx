"use client";

import "./globals.css";
import { fontVariables } from "@/lib/fonts";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
        <div>
          <p className="eyebrow text-primary">Something went wrong</p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
            We hit a snag on our end
          </h1>
          <p className="mt-3 text-muted-foreground">
            Please try again, or call us at 787-405-4100 and we will help you book directly.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 cursor-pointer rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
