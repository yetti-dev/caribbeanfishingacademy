import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/magic/reveal";
import type { SectionHeading } from "@/content/types";

/** Two big tappable tiles. Ring the marina office or message the crew. */
export function Cta08({ heading, phone, whatsapp, callLabel = "Call the marina office", messageLabel = "Message the crew on WhatsApp", callNote, messageNote, footnote }: {
  heading: SectionHeading; phone: string; whatsapp: string;
  callLabel?: string; messageLabel?: string; callNote?: string; messageNote?: string; footnote?: string;
}) {
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const wa = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
  const tiles = [
    { href: tel, icon: Phone, label: callLabel, value: phone, note: callNote, key: "call" },
    { href: wa, icon: MessageCircle, label: messageLabel, value: whatsapp, note: messageNote, key: "message" },
  ];

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{heading.title}</h2>
          {heading.body ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
          {tiles.map((t) => (
            <a
              key={t.key}
              href={t.href}
              className="group flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-8 transition duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition duration-200 ease-out group-hover:bg-primary group-hover:text-primary-foreground">
                  <t.icon aria-hidden className="size-5" />
                </span>
                <ArrowUpRight aria-hidden className="size-5 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </span>
              <span className="mt-6 text-sm font-medium text-muted-foreground">{t.label}</span>
              <span className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">{t.value}</span>
              {t.note ? <span className="mt-3 text-xs leading-relaxed text-muted-foreground">{t.note}</span> : null}
            </a>
          ))}
        </RevealGroup>
        {footnote ? <p className="mt-6 text-xs text-muted-foreground">{footnote}</p> : null}
      </div>
    </section>
  );
}
