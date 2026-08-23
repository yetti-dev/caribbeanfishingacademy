"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Mail, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";

/** Magic link sign in. No passwords to leak or reset. */
export function LoginForm({ next, error }: { next: string; error?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState(error ?? "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) {
      setState("error");
      setMessage("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    setState("sending");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (err) { setState("error"); setMessage(err.message); return; }
    setState("sent");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-100 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl">
        <h1 className="font-display text-xl font-bold tracking-tight text-zinc-900">Factory sign in</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
          We email a one time link. Only allowlisted addresses can open the dashboard.
        </p>

        {state === "sent" ? (
          <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-700" />
            <p className="text-xs leading-relaxed text-emerald-900">
              Link sent to <span className="font-medium">{email}</span>. It expires in an hour, and opening
              it in the same browser keeps you signed in.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6">
            <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              Email
            </label>
            <div className="relative mt-1.5">
              <Mail aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="email" type="email" required autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="h-11 w-full rounded-lg border border-zinc-300 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none"
              />
            </div>
            <button
              type="submit" disabled={state === "sending"}
              className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {state === "sending" ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
              {state === "sending" ? "Sending" : "Email me a link"}
            </button>
          </form>
        )}

        {message ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-red-700" />
            <p className="text-xs leading-relaxed text-red-900">{message}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
