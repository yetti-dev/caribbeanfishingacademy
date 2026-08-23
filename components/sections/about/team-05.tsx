import { Mail } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Member } from "@/content/demo";
import type { SectionHeading } from "@/content/types";

export type DirectoryMember = Member & { email?: string };

/** Compact directory table with mono column headers and a mail link per row. */
export function Team05({ heading, members, columns }: {
  heading?: SectionHeading;
  members: DirectoryMember[];
  columns?: { person: string; role: string; about: string; contact: string };
}) {
  const col = columns ?? { person: "Person", role: "Role", about: "On board for", contact: "Reach" };
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <Reveal delay={0.06} className="mt-12 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="bg-muted">
                <th scope="col" className="px-5 py-3 font-mono text-[11px] font-medium tracking-[0.2em] text-foreground/70 uppercase">
                  {col.person}
                </th>
                <th scope="col" className="px-5 py-3 font-mono text-[11px] font-medium tracking-[0.2em] text-foreground/70 uppercase">
                  {col.role}
                </th>
                <th scope="col" className="px-5 py-3 font-mono text-[11px] font-medium tracking-[0.2em] text-foreground/70 uppercase">
                  {col.about}
                </th>
                <th scope="col" className="px-5 py-3 text-right font-mono text-[11px] font-medium tracking-[0.2em] text-foreground/70 uppercase">
                  {col.contact}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.name} className="bg-card transition-colors duration-200 ease-out hover:bg-accent">
                  <th scope="row" className="px-5 py-4 font-normal">
                    <span className="flex items-center gap-3">
                      <span className="size-11 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                        <img
                          src={m.image.src}
                          alt={m.image.alt}
                          loading="lazy"
                          decoding="async"
                          className="aspect-square w-full object-cover"
                        />
                      </span>
                      <span className="font-display text-base font-semibold tracking-tight text-foreground">{m.name}</span>
                    </span>
                  </th>
                  <td className="px-5 py-4 align-middle text-sm text-primary">{m.role}</td>
                  <td className="px-5 py-4 align-middle text-sm leading-relaxed text-muted-foreground">{m.bio}</td>
                  <td className="px-5 py-4 text-right align-middle">
                    {m.email ? (
                      <a
                        href={`mailto:${m.email}`}
                        aria-label={`Email ${m.name}`}
                        className="inline-grid size-10 cursor-pointer place-items-center rounded-lg border border-border text-muted-foreground transition duration-200 ease-out hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      >
                        <Mail aria-hidden className="size-4" />
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
