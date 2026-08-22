"use client";
import { useState } from "react";
import { Play, X, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/** Hero with a video thumbnail that opens a real dialog. */
export function Hero10({ eyebrow, title, body, image, videoUrl, ctas = [], caption }: {
  eyebrow?: string; title: string; body: string; image: Img; videoUrl: string; ctas?: Cta[]; caption?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-muted/30">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal>
          {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((cta, i) => (
              <a key={cta.label} href={cta.href} className={i === 0
                ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                {cta.label}
                {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <button type="button" onClick={() => setOpen(true)} className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none" aria-label="Play the tour video">
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="aspect-16/10 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-200 group-hover:scale-110">
                <Play aria-hidden className="size-6 translate-x-0.5 fill-current" />
              </span>
            </span>
          </button>
          {caption ? <p className="mt-3 text-center text-sm text-muted-foreground">{caption}</p> : null}
        </Reveal>
      </div>

      {open ? (
        <div role="dialog" aria-modal="true" aria-label="Tour video" className="fixed inset-0 z-100 grid place-items-center bg-foreground/80 p-4 backdrop-blur-sm">
          <button type="button" onClick={() => setOpen(false)} aria-label="Close video" className="absolute right-5 top-5 cursor-pointer rounded-lg bg-background/90 p-2 text-foreground transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
            <X aria-hidden className="size-5" />
          </button>
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-foreground">
            <iframe src={videoUrl} title="Tour video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen className="size-full" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
