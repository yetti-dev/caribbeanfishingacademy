"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import type { Cta, Img } from "@/content/types";

/**
 * Video background hero.
 *
 * The copy sits on a SOLID card, not over the footage behind a gradient. A
 * 40-50% scrim measures about 1.6-1.9:1 against a bright frame, and reaching
 * 4.5:1 needs roughly 85% black, which throws away the video you paid to shoot.
 * A solid panel keeps the footage visible and the words readable.
 *
 * The poster carries the first paint, autoplay is muted and inline (required by
 * iOS and by Chrome's autoplay policy), and prefers-reduced-motion pauses it.
 */
export function Hero11({ eyebrow, title, body, videoSrc, poster, ctas = [], footnote }: {
  eyebrow?: string; title: string; body: string; videoSrc: string; poster: Img; ctas?: Cta[]; footnote?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { void v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <section className="relative isolate min-h-[85vh] overflow-hidden bg-foreground">
      <video
        ref={ref} src={videoSrc} poster={poster.src} autoPlay muted loop playsInline preload="metadata"
        aria-label={poster.alt}
        className="absolute inset-0 z-0 size-full object-cover"
      />
      {/* Light, purely aesthetic tint. It is NOT what makes the text readable. */}
      <div aria-hidden className="absolute inset-0 z-10 bg-foreground/25" />

      <div className="relative z-20 mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-20">
        <div className="max-w-xl rounded-2xl bg-background p-8 shadow-2xl sm:p-10">
          {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
          <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((cta, i) => (
              <a key={cta.label} href={cta.href} className={i === 0
                ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                {cta.label}
                {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
          </div>
          {footnote ? <p className="mt-5 text-xs text-muted-foreground">{footnote}</p> : null}
        </div>
      </div>

      <button
        type="button" onClick={toggle} aria-label={playing ? "Pause background video" : "Play background video"}
        className="absolute bottom-5 right-5 z-20 grid size-10 cursor-pointer place-items-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-sm transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4 translate-x-px" />}
      </button>
    </section>
  );
}
