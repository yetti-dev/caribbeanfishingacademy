"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Play } from "lucide-react";
import { runTick } from "@/app/(factory)/dashboard/actions";

/** Drive the worker by hand, for before pg_cron is wired or to skip the wait. */
export function RunTickButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <span className="flex items-center gap-2">
      <button type="button" disabled={pending}
        onClick={() => start(async () => {
          const r = await runTick();
          setMsg(r.ok ? r.message : r.error);
          setTimeout(() => setMsg(null), 8000);
        })}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
        {pending ? <LoaderCircle aria-hidden className="size-3.5 animate-spin" /> : <Play aria-hidden className="size-3.5" />}
        {pending ? "Running" : "Run worker"}
      </button>
      {msg ? <span className="max-w-72 truncate font-mono text-[10px] text-zinc-500" title={msg}>{msg}</span> : null}
    </span>
  );
}
