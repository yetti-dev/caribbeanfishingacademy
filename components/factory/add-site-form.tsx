"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, LoaderCircle, Plus, TriangleAlert, X } from "lucide-react";
import { addSite } from "@/app/(factory)/dashboard/actions";

/** Add a site and optionally queue the 10 provisioning steps. */
export function AddSiteForm() {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const field =
    "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none";
  const label = "block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500";

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:outline-none">
        <Plus aria-hidden className="size-3.5" /> Add site
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-100 grid place-items-center bg-zinc-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-zinc-900">Add a site</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              Creates the repo from the template, strips the factory, commits a holding page, creates the
              Vercel project, deploys, attaches the domain and writes DNS. The crawl is queued at the same
              time. A scheduler runs both, so this is the last button you press.
            </p>
          </div>
          <button type="button" onClick={() => { setOpen(false); setMsg(null); }} aria-label="Close"
            className="cursor-pointer rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
            <X aria-hidden className="size-4" />
          </button>
        </div>

        <form
          className="mt-5 space-y-3"
          action={(fd) => start(async () => {
            const r = await addSite(fd);
            setMsg(r.ok ? { ok: true, text: r.message } : { ok: false, text: r.error });
          })}
        >
          <div>
            <label htmlFor="source_url" className={label}>Source website to clone</label>
            <input id="source_url" name="source_url" required placeholder="https://sycorax.com" className={`mt-1 ${field}`} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="slug" className={label}>Slug (repo and project name)</label>
              <input id="slug" name="slug" placeholder="from the source domain" className={`mt-1 ${field}`} />
            </div>
            <div>
              <label htmlFor="name" className={label}>Display name</label>
              <input id="name" name="name" placeholder="from the URL if blank" className={`mt-1 ${field}`} />
            </div>
          </div>
          <div>
            <label htmlFor="domain" className={label}>Domain</label>
            <input id="domain" name="domain" placeholder="defaults to <slug>.getyetti.com" className={`mt-1 ${field}`} />
            <p className="mt-1 text-[10px] leading-snug text-zinc-500">
              Blank uses <span className="font-mono">&lt;slug&gt;.getyetti.com</span>, derived from the source
              site. Type <span className="font-mono">none</span> to provision without a domain, which skips the
              DNS and smoke steps instead of writing a real record at your registrar.
            </p>
          </div>
          <div>
            <label htmlFor="brief" className={label}>Brief (optional)</label>
            <textarea id="brief" name="brief" rows={2} placeholder="What the colleague asked for"
              className="mt-1 w-full resize-y rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-700">
            <input type="checkbox" name="provision" defaultChecked
              className="size-4 cursor-pointer rounded border-zinc-400 accent-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none" />
            Queue provisioning and the crawl now
          </label>

          <button type="submit" disabled={pending}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:outline-none">
            {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
            {pending ? "Creating" : "Create and queue"}
          </button>
        </form>

        {msg ? (
          <div className={`mt-4 flex items-start gap-2.5 rounded-lg border p-3 ${msg.ok ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
            {msg.ok
              ? <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-700" />
              : <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-red-700" />}
            <p className={`text-xs leading-relaxed ${msg.ok ? "text-emerald-900" : "text-red-900"}`}>{msg.text}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
