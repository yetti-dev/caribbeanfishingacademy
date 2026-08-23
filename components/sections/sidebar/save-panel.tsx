"use client";

/** Save the current pick against a site, so the dashboard shows the handoff. */
import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, LoaderCircle, Save, TriangleAlert } from "lucide-react";
import { listSites, saveLayout } from "@/app/(factory)/sections/actions";
import type { Theme } from "@/components/sections/theme";

export function SavePanel({ theme, sections }: { theme: Theme; sections: string[] }) {
  const [sites, setSites] = useState<{ slug: string; name: string }[]>([]);
  const [slug, setSlug] = useState("");
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => { listSites().then(setSites).catch(() => setSites([])); }, []);

  const label = "block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500";

  return (
    <div className="flex h-full flex-col overflow-y-auto p-3">
      <p className={label}>Attach to a site</p>
      <select value={slug} onChange={(e) => setSlug(e.target.value)}
        className="mt-1.5 h-9 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-2 text-xs text-zinc-800 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none">
        <option value="">Not attached, share code only</option>
        {sites.map((s) => <option key={s.slug} value={s.slug}>{s.name} ({s.slug})</option>)}
      </select>
      <p className="mt-1.5 text-[10px] leading-snug text-zinc-500">
        Attaching marks this the current layout for that site and shows it on the dashboard, which is what the
        local build reads with <span className="font-mono">npm run pull</span>.
      </p>

      <label htmlFor="layout-note" className={`${label} mt-4`}>Note (optional)</label>
      <textarea id="layout-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3}
        placeholder="Why this composition"
        className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white p-2 text-xs text-zinc-800 placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none" />

      <button type="button" disabled={pending || !sections.length}
        onClick={() => start(async () => {
          const r = await saveLayout({ siteSlug: slug || null, theme: theme as unknown as Record<string, unknown>, sections, note: note || undefined });
          setMsg(r.ok ? { ok: true, text: r.message } : { ok: false, text: r.error });
        })}
        className="mt-4 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:outline-none">
        {pending ? <LoaderCircle aria-hidden className="size-3.5 animate-spin" /> : <Save aria-hidden className="size-3.5" />}
        {pending ? "Saving" : `Save ${sections.length} section(s)`}
      </button>

      {msg ? (
        <div className={`mt-3 flex items-start gap-2 rounded-lg border p-2.5 ${msg.ok ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
          {msg.ok ? <CheckCircle2 aria-hidden className="mt-0.5 size-3.5 shrink-0 text-emerald-700" />
                  : <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-red-700" />}
          <p className={`text-[11px] leading-relaxed ${msg.ok ? "text-emerald-900" : "text-red-900"}`}>{msg.text}</p>
        </div>
      ) : null}
    </div>
  );
}
