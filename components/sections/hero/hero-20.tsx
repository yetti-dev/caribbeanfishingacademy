"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cta, Img } from "@/content/types";

export type HeroSlide = {
  image: Img;
  eyebrow?: string;
  title: string;
  body: string;
  price?: string;
  duration?: string;
};

/**
 * A true slideshow hero: each slide carries its OWN copy, so the headline and
 * price change with the photograph. Useful when the page has to sell three
 * different trips above the fold rather than one message.
 *
 * Contrast is the same bottom-weighted gradient the other rotators use. The
 * vertical rail on the right shows position and lets a visitor stop on a slide.
 * Rotation halts under prefers-reduced-motion.
 */
export function Hero20({ slides, cta, interval = 6500 }: { slides: HeroSlide[]; cta?: Cta; interval?: number }) {
  const [i, setI] = useState(0);
  const [motionOk, setMotionOk] = useState(true);
  const slide = slides[i];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motionOk || slides.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [motionOk, slides.length, interval]);

  return (
    <section className="relative isolate flex min-h-[94vh] items-end overflow-hidden bg-foreground">
      {slides.map((s, idx) => (
        <img
          key={s.image.src} src={s.image.src} alt={idx === i ? s.image.alt : ""} aria-hidden={idx !== i}
          loading={idx === 0 ? "eager" : "lazy"} decoding="async"
          className={cn(
            "absolute inset-0 z-0 size-full object-cover transition-opacity duration-1000 ease-out",
            idx === i ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div aria-hidden className="absolute inset-0 z-10 bg-linear-to-t from-foreground/93 via-foreground/58 to-foreground/15" />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pb-16 pt-32">
        <div className="flex items-end justify-between gap-8">
          {/* key on the index so the copy re-animates with each slide */}
          <div key={i} className="max-w-2xl animate-[fadeUp_600ms_ease-out]">
            {slide.eyebrow ? <p className="eyebrow text-background/85">{slide.eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.92] tracking-tight text-balance text-background sm:text-6xl">{slide.title}</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-background/90">{slide.body}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {slide.price ? (
                <p className="font-display text-2xl font-bold text-background">
                  {slide.price}
                  <span className="ml-1.5 text-sm font-normal text-background/70">per guest</span>
                </p>
              ) : null}
              {slide.duration ? (
                <p className="inline-flex items-center gap-1.5 text-sm text-background/80">
                  <Clock aria-hidden className="size-4" /> {slide.duration}
                </p>
              ) : null}
              {cta ? (
                <a href={cta.href} className="group ml-auto inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none">
                  {cta.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : null}
            </div>
          </div>

          {slides.length > 1 ? (
            <ol className="hidden shrink-0 flex-col gap-2 lg:flex">
              {slides.map((s, idx) => (
                <li key={s.title}>
                  <button
                    type="button" onClick={() => setI(idx)} aria-current={idx === i}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none",
                      idx === i ? "bg-background/15" : "hover:bg-background/10",
                    )}
                  >
                    <span className={cn("h-6 w-0.5 rounded-full transition-colors", idx === i ? "bg-primary" : "bg-background/35")} />
                    <span className={cn("font-mono text-[11px] transition-colors", idx === i ? "text-background" : "text-background/60")}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className={cn("max-w-36 truncate text-xs transition-colors", idx === i ? "text-background" : "text-background/60")}>
                      {s.title}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
    </section>
  );
}
