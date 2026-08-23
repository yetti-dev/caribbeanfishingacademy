"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, Lock, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 10) {
      setMsg({ ok: false, text: "Use at least 10 characters. This account can create repos and rewrite DNS." });
      return;
    }
    if (password !== confirm) {
      setMsg({ ok: false, text: "The two passwords do not match." });
      return;
    }
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) { setMsg({ ok: false, text: error.message }); return; }
    setMsg({ ok: true, text: "Password set. Taking you to the dashboard." });
    router.replace("/dashboard");
    router.refresh();
  };

  const field =
    "h-11 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-sm text-zinc-900 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:outline-none";

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-100 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl">
        <h1 className="font-display text-xl font-bold tracking-tight text-zinc-900">Set a password</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
          For <span className="font-mono text-xs">{email}</span>
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {[
            { id: "pw", label: "New password", value: password, set: setPassword, auto: "new-password" },
            { id: "pw2", label: "Confirm", value: confirm, set: setConfirm, auto: "new-password" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">{f.label}</label>
              <div className="relative mt-1.5">
                <Lock aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <input id={f.id} type="password" required autoComplete={f.auto} value={f.value}
                  onChange={(e) => f.set(e.target.value)} className={field} />
              </div>
            </div>
          ))}
          <button type="submit" disabled={busy}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:outline-none">
            {busy ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
            {busy ? "Saving" : "Save password"}
          </button>
        </form>
        {msg ? (
          <div className={`mt-4 flex items-start gap-2.5 rounded-lg border p-3 ${msg.ok ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
            {msg.ok ? <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                    : <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-red-700" />}
            <p className={`text-xs leading-relaxed ${msg.ok ? "text-emerald-900" : "text-red-900"}`}>{msg.text}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
