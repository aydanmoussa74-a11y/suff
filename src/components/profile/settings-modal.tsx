"use client";

import { useEffect, useId, useRef, useState } from "react";
import { applyTheme, readProfile, writeProfile } from "@/lib/profile-store";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "oled">("dark");
  const [privacy, setPrivacy] = useState(true);
  const [cleared, setCleared] = useState("");
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    if (!open) return;
    const profile = readProfile();
    setTheme(profile.theme);
    setPrivacy(profile.privacy);
    applyTheme(profile.theme);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function saveTheme(next: "dark" | "oled") {
    setTheme(next);
    const profile = readProfile();
    writeProfile({ ...profile, theme: next });
  }

  function savePrivacy(next: boolean) {
    setPrivacy(next);
    const profile = readProfile();
    writeProfile({ ...profile, privacy: next });
  }

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close settings" className="absolute inset-0 bg-black/65" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg rounded-t-[28px] border border-[var(--stroke)] bg-[var(--surface)] p-4 text-[var(--text)]"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold">Settings</h2>
          <button type="button" onClick={onClose} className="rounded-full border border-[var(--stroke)] px-3 py-1 text-sm text-[var(--muted)]">
            Close
          </button>
        </div>
        <fieldset className="mb-4">
          <legend className="mb-2 text-sm text-[var(--muted)]">Theme</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "dark" as const, label: "Default Dark" },
              { id: "oled" as const, label: "Pitch Black OLED" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={theme === item.id}
                onClick={() => saveTheme(item.id)}
                className={`rounded-2xl border px-3 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                  theme === item.id ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--stroke)] text-[var(--text)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem("suff.snippet-cache");
            setCleared("Cached snippets cleared.");
          }}
          className="mb-2 w-full rounded-2xl border border-[var(--stroke)] px-3 py-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          Clear local cached snippets
        </button>
        {cleared ? <p role="status" className="mb-2 text-sm text-[var(--ok)]">{cleared}</p> : null}
        <label className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--stroke)] px-3 py-3 text-sm">
          Data privacy
          <input
            type="checkbox"
            checked={privacy}
            onChange={(event) => savePrivacy(event.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
        </label>
        <button
          type="button"
          onClick={() => setSignedOut(true)}
          className="w-full rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)]"
        >
          {signedOut ? "Signed out on this device" : "Sign out"}
        </button>
      </div>
    </div>
  );
}
