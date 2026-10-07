"use client";

import { useEffect, useId, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type AuthModalProps = { open: boolean; onClose: () => void };

export function openAuth() {
  window.dispatchEvent(new Event("suff-auth"));
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const titleId = useId();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError("");
    setMessage("");
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const supabase = getSupabaseBrowserClient();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!supabase) {
      setError("Authentication is not configured. Add the Supabase URL and anon key to the deployment environment.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "sign-in") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        window.dispatchEvent(new Event("suff-profile"));
        onClose();
      } else {
        const safeHandle = (name.trim() || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24) || "member";
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: {
            data: { name: name.trim() || email.split("@")[0], handle: safeHandle },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (authError) throw authError;
        if (data.session) {
          window.dispatchEvent(new Event("suff-profile"));
          onClose();
        } else {
          setMessage("Check your email for the confirmation link. Your profile will be ready after confirmation.");
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signInWith(provider: "google" | "github") {
    setError("");
    if (!supabase) {
      setError("Authentication is not configured. Add the Supabase URL and anon key to the deployment environment.");
      return;
    }
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) { setError(authError.message); setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close sign in" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-[28px] border border-[var(--stroke)] bg-[var(--surface)] p-4 text-[var(--text)]">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">Suff / Account</p>
          <button type="button" onClick={onClose} className="rounded-full border border-[var(--stroke)] px-3 py-1 text-sm text-[var(--muted)]">Close</button>
        </div>
        <h2 id={titleId} className="mb-4 text-2xl font-semibold">{mode === "sign-in" ? "Sign in" : "Create account"}</h2>
        <form className="space-y-3" onSubmit={submit}>
          {mode === "sign-up" ? <label className="block text-sm">Display name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2" /></label> : null}
          <label className="block text-sm">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2" /></label>
          <label className="block text-sm">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={8} required className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2" /></label>
          {error ? <p role="alert" className="text-sm text-[var(--danger)]">{error}</p> : null}
          {message ? <p role="status" className="text-sm text-[var(--ok)]">{message}</p> : null}
          <button type="submit" disabled={busy} className="w-full rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)] disabled:opacity-60">{busy ? "Working…" : mode === "sign-in" ? "Sign in" : "Create account"}</button>
        </form>
        <div className="my-4 grid grid-cols-2 gap-2">
          <button type="button" disabled={busy} onClick={() => signInWith("google")} className="rounded-full border border-[var(--stroke)] px-3 py-2 text-sm disabled:opacity-60">Continue with Google</button>
          <button type="button" disabled={busy} onClick={() => signInWith("github")} className="rounded-full border border-[var(--stroke)] px-3 py-2 text-sm disabled:opacity-60">Continue with GitHub</button>
        </div>
        <button type="button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setError(""); setMessage(""); }} className="self-start text-sm text-[var(--muted)]">{mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}</button>
        <p className="mt-5 text-xs text-[var(--muted)]">Account verification is handled by Supabase Auth. Suff does not perform identity or document verification.</p>
      </div>
    </div>
  );
}
