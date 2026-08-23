"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Radar } from "lucide-react";
import { startScrape } from "@/app/(factory)/dashboard/actions";

/** Seed the crawl frontier with the home page. The worker walks it from there. */
export function StartScrapeButton({ siteId, disabled }: { siteId: string; disabled?: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <span className="flex items-center gap-2">
      <button type="button" disabled={pending || disabled}
        title={disabled ? "This site has no source URL to crawl" : "Queue the crawl"}
        onClick={() => start(async () => {
          const r = await startScrape(siteId);
          setMsg(r.ok ? r.message : r.error);
          setTimeout(() => setMsg(null), 10000);
        })}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
        {pending ? <LoaderCircle aria-hidden className="size-3.5 animate-spin" /> : <Radar aria-hidden className="size-3.5" />}
        {pending ? "Queueing" : "Queue crawl"}
      </button>
      {msg ? <span className="max-w-64 truncate font-mono text-[10px] text-zinc-500" title={msg}>{msg}</span> : null}
    </span>
  );
}
