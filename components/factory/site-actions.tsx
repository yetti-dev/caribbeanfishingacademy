"use client";

import { useState, useTransition } from "react";
import { Archive, ArchiveRestore, LoaderCircle, Trash2, TriangleAlert, X } from "lucide-react";
import { deleteSite, setArchived } from "@/app/(factory)/dashboard/actions";

/** Row actions. Archive is one click; delete makes you retype the slug. */
export function SiteActions({ siteId, slug, archived }: { siteId: string; slug: string; archived: boolean }) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <span className="flex items-center gap-0.5">
      <button
        type="button" disabled={pending}
        title={archived ? "Restore to draft" : "Archive"}
        aria-label={archived ? `Restore ${slug}` : `Archive ${slug}`}
        onClick={() => start(async () => {
          const r = await setArchived(siteId, !archived);
          if (!r.ok) setErr(r.error);
        })}
        className="cursor-pointer rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
      >
        {pending ? <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
          : archived ? <ArchiveRestore aria-hidden className="size-3.5" />
          : <Archive aria-hidden className="size-3.5" />}
      </button>

      <button
        type="button" onClick={() => { setConfirming(true); setTyped(""); setErr(null); }}
        title="Delete" aria-label={`Delete ${slug}`}
        className="cursor-pointer rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
      >
        <Trash2 aria-hidden className="size-3.5" />
      </button>

      {err ? <span className="max-w-40 truncate text-[10px] text-red-700" title={err}>{err}</span> : null}

      {confirming ? (
        <span className="fixed inset-0 z-100 grid place-items-center bg-zinc-900/40 p-4 backdrop-blur-sm">
          <span className="block w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <span className="flex items-start justify-between">
              <span className="flex items-start gap-2.5">
                <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-red-600" />
                <span>
                  <span className="block font-display text-base font-bold text-zinc-900">Delete {slug}?</span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-zinc-600">
                    This removes the site and every run, provisioning step, scraped page, asset record, deploy
                    and domain row with it. It cannot be undone.
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-zinc-600">
                    The GitHub repo and the Vercel project are <span className="font-semibold">not</span> touched,
                    so a deployed site stays online. Remove those by hand if you want them gone.
                  </span>
                </span>
              </span>
              <button type="button" onClick={() => setConfirming(false)} aria-label="Cancel"
                className="cursor-pointer rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                <X aria-hidden className="size-4" />
              </button>
            </span>

            <label htmlFor={`confirm-${siteId}`} className="mt-4 block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              Type {slug} to confirm
            </label>
            <input
              id={`confirm-${siteId}`} value={typed} onChange={(e) => setTyped(e.target.value)}
              autoComplete="off" spellCheck={false}
              className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 font-mono text-sm text-zinc-900 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:outline-none"
            />
            {err ? <span className="mt-2 block text-xs text-red-700">{err}</span> : null}

            <span className="mt-4 flex gap-2">
              <button type="button" onClick={() => setConfirming(false)}
                className="flex-1 cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                Cancel
              </button>
              <button
                type="button" disabled={pending || typed.trim() !== slug}
                onClick={() => start(async () => {
                  const r = await deleteSite(siteId, typed);
                  if (r.ok) setConfirming(false); else setErr(r.error);
                })}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:outline-none">
                {pending ? <LoaderCircle aria-hidden className="size-3.5 animate-spin" /> : <Trash2 aria-hidden className="size-3.5" />}
                Delete permanently
              </button>
            </span>
          </span>
        </span>
      ) : null}
    </span>
  );
}
