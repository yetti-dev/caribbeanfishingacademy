"use client";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cta, Img } from "@/content/types";

/**
 * Rotating photo background with the copy bottom left and a clickable thumbnail
 * rail bottom right, so a visitor can see what is coming and jump to it.
 *
 * Same contrast approach as the other rotators: a corner-weighted gradient that
 * is deep where the words are (~92%, about 8:1) and near clear at the opposite
 * edge, rather than a flat tint heavy enough to ruin the photograph.
 */
export function Hero19({ eyebrow, title, body, images, ctas = [], interval = 7000 }: {
  eyebrow?: string; title: string; body: string; images: Img[]; ctas?: Cta[]; interval?: number;
}) {
  const [i, setI] = useState(0);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motionOk || images.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [motionOk, images.length, interval]);

  return (
    <section className="relative isolate flex min-h-[94vh] items-end overflow-hidden bg-foreground">
      {images.map((im, idx) => (
        <img
          key={im.src} src={im.src} alt={idx === i ? im.alt : ""} aria-hidden={idx !== i}
          loading={idx === 0 ? "eager" : "lazy"} decoding="async"
          className={cn(
            "absolute inset-0 z-0 size-full object-cover transition-all duration-[1400ms] ease-out",
            idx === i ? "scale-100 opacity-100" : "scale-105 opacity-0",
          )}
        />
      ))}
      {/* Corner weighted: deep at the bottom left, clear at the top right. */}
      <div aria-hidden className="absolute inset-0 z-10 bg-linear-to-tr from-foreground/92 via-foreground/60 to-foreground/10" />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pb-10 pt-32">
        <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="max-w-2xl">
            {eyebrow ? <p className="eyebrow text-background/85">{eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.92] tracking-tight text-balance text-background sm:text-6xl">{title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-background/90">{body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {ctas.map((cta, idx) => (
                <a key={cta.label} href={cta.href} className={idx === 0
                  ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none"
                  : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-background/50 px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-background/10 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"}>
                  {cta.label}
                  {idx === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
                </a>
              ))}
            </div>
          </div>

          {images.length > 1 ? (
            <ul className="flex gap-2 lg:justify-end">
              {images.map((im, idx) => (
                <li key={im.src}>
                  <button
                    type="button" onClick={() => setI(idx)} aria-current={idx === i}
                    aria-label={`Show photo ${idx + 1} of ${images.length}`}
                    className={cn(
                      "block cursor-pointer overflow-hidden rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none",
                      idx === i ? "w-20 ring-2 ring-primary" : "w-14 opacity-65 hover:opacity-100",
                    )}
                  >
                    <img src={im.src} alt="" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
