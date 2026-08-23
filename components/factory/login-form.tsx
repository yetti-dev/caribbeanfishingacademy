"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, LoaderCircle, Lock, Mail, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";

type Mode = "password" | "reset";

/**
 * Email and password sign in, with a reset path.
 *
 * The reset path is not decoration: these accounts were created without anyone
 * signing in, so an account may have no password at all. Without a way to set
 * one, such an account is simply locked out.
 */
export function LoginForm({ next, error }: { next: string; error?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(
    error ? { ok: false, text: error } : null,
  );

  const notConfigured = () =>
    setMsg({ ok: false, text: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." });

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) return notConfigured();
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) {
      // Supabase says "Invalid login credentials" whether the address is unknown
      // or the password is wrong, which is correct: distinguishing them would let
      // anyone enumerate who has an account.
      setMsg({
        ok: false,
        text: /invalid login/i.test(err.message)
          ? "That email and password combination did not work. If the account was created without a password, use the reset link below."
          : err.message,
      });
      return;
    }
    router.replace(next);
    router.refresh();
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) return notConfigured();
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset`,
    });
    setBusy(false);
    setMsg(err
      ? { ok: false, text: err.message }
      : { ok: true, text: `If ${email.trim()} has an account, a link to set a password is on its way. It expires in an hour.` });
  };

  const field =
    "h-11 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none";
  const label = "block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500";

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-100 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl">
        <h1 className="font-display text-xl font-bold tracking-tight text-zinc-900">Factory sign in</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
          {mode === "password"
            ? "Email and password. Only allowlisted addresses can open the dashboard."
            : "We email a link so you can set a new password."}
        </p>

        <form onSubmit={mode === "password" ? signIn : sendReset} className="mt-6 space-y-3">
          <div>
            <label htmlFor="email" className={label}>Email</label>
            <div className="relative mt-1.5">
              <Mail aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input id="email" type="email" required autoComplete="email" value={email}
                onChange={(ev) => setEmail(ev.target.value)} placeholder="you@example.com" className={field} />
            </div>
          </div>

          {mode === "password" ? (
            <div>
              <label htmlFor="password" className={label}>Password</label>
              <div className="relative mt-1.5">
                <Lock aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <input id="password" type={show ? "text" : "password"} required autoComplete="current-password"
                  value={password} onChange={(ev) => setPassword(ev.target.value)} placeholder="••••••••"
                  className={`${field} pr-10`} />
                <button type="button" onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1.5 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                  {show ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
                </button>
              </div>
            </div>
          ) : null}

          <button type="submit" disabled={busy}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:outline-none">
            {busy ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
            {busy ? "Working" : mode === "password" ? "Sign in" : "Email a reset link"}
          </button>
        </form>

        <button type="button" onClick={() => { setMode(mode === "password" ? "reset" : "password"); setMsg(null); }}
          className="mt-4 cursor-pointer text-xs text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-800 hover:underline focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
          {mode === "password" ? "Forgot or never set a password?" : "Back to signing in"}
        </button>

        {msg ? (
          <div className={`mt-4 flex items-start gap-2.5 rounded-lg border p-3 ${msg.ok ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
            {msg.ok
              ? <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-700" />
              : <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-red-700" />}
            <p className={`text-xs leading-relaxed ${msg.ok ? "text-emerald-900" : "text-red-900"}`}>{msg.text}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
