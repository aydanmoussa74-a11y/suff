"use client";

import { useEffect, useId, useState } from "react";
import { readProfile, writeProfile } from "@/lib/profile-store";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

const STEPS = ["Splash", "Sign in", "Check", "Verified"] as const;

export function openAuth() {
  window.dispatchEvent(new Event("suff-auth"));
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const titleId = useId();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setError("");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function finish() {
    const profile = readProfile();
    writeProfile({ ...profile, verified: true, name: name.trim() || profile.name });
    window.localStorage.setItem("suff.session", JSON.stringify({ email: email.trim(), sample: true }));
    window.dispatchEvent(new Event("suff-profile"));
    setStep(3);
  }

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close sign in" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-[28px] border border-[var(--stroke)] bg-[var(--surface)] p-4 text-[var(--text)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">Step {step + 1} of 4</p>
          <button type="button" onClick={onClose} className="rounded-full border border-[var(--stroke)] px-3 py-1 text-sm text-[var(--muted)]">
            Close
          </button>
        </div>
        <div className="mb-4 flex gap-1" aria-hidden>
          {STEPS.map((label, index) => (
            <span key={label} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-[var(--accent)]" : "bg-[var(--stroke)]"}`} />
          ))}
        </div>
        {step === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">Suff</p>
            <h2 id={titleId} className="mt-2 text-2xl font-semibold">All your designs in one place</h2>
            <button type="button" onClick={() => setStep(1)} className="mt-6 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)]">
              Continue
            </button>
          </div>
        ) : null}
        {step === 1 ? (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!email.includes("@") || password.length < 8) {
                setError("Use an email and a password of at least 8 characters. The password is not stored.");
                return;
              }
              setError("");
              setStep(2);
            }}
          >
            <h2 id={titleId} className="text-lg font-semibold">{mode === "sign-in" ? "Sign in" : "Sign up"}</h2>
            <label className="block text-sm">
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2" />
            </label>
            <label className="block text-sm">
              Password
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="new-password" className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2" />
            </label>
            {error ? <p role="alert" className="text-sm text-[var(--danger)]">{error}</p> : null}
            <button type="submit" className="w-full rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)]">
              Continue
            </button>
            <button type="button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")} className="text-sm text-[var(--muted)]">
              {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled className="rounded-full border border-[var(--stroke)] px-3 py-2 text-sm text-[var(--muted)]">
                Social sign-in unavailable
              </button>
              <button type="button" disabled className="rounded-full border border-[var(--stroke)] px-3 py-2 text-sm text-[var(--muted)]">
                Social sign-in unavailable
              </button>
            </div>
          </form>
        ) : null}
        {step === 2 ? (
          <div>
            <h2 id={titleId} className="text-lg font-semibold">Creator check</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Sample frames only. No passport, photo, or birth date is collected.</p>
            <label className="mt-3 block text-sm">
              Display name
              <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2" />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-dashed border-[var(--stroke)] px-3 py-6 text-center text-xs text-[var(--muted)]">Passport frame</div>
              <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--stroke)] px-3 py-6 text-xs text-[var(--muted)]">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--accent)] text-[var(--accent)]">✓</span>
                Face frame
              </div>
            </div>
            <button type="button" onClick={finish} className="mt-4 w-full rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)]">
              Continue
            </button>
          </div>
        ) : null}
        {step === 3 ? (
          <div className="py-8 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--ok)]">Sample</p>
            <h2 id={titleId} className="mt-2 text-2xl font-semibold">Identity Verified - Tier 1 Unlocked</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Local sample status only. Nothing was verified.</p>
            <button type="button" onClick={onClose} className="mt-6 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)]">
              Done
            </button>
          </div>
        ) : null}
        {step > 0 && step < 3 ? (
          <button type="button" onClick={() => setStep((value) => value - 1)} className="mt-3 text-sm text-[var(--muted)]">
            Back
          </button>
        ) : null}
      </div>
    </div>
  );
}
