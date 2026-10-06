"use client";

import { useEffect, useId, useState } from "react";
import { PersonalDetailsModal } from "@/components/profile/personal-details-modal";
import { MySubmissionsModal } from "@/components/profile/my-submissions-modal";
import { SettingsModal } from "@/components/profile/settings-modal";
import { readProfile } from "@/lib/profile-store";
import { openAuth } from "@/components/auth/auth-modal";

type Sheet = "details" | "submissions" | "security" | "payment" | "notifications" | "help" | null;

const LINKS: { id: Exclude<Sheet, null>; label: string; detail: string }[] = [
  { id: "details", label: "Personal Details", detail: "Name and handle" },
  { id: "submissions", label: "My Submissions", detail: "Drafts and review status" },
  { id: "security", label: "Security", detail: "Sign-out confirmation" },
  { id: "payment", label: "Payment & Pro Tier", detail: "Sample member plan" },
  { id: "notifications", label: "Notifications", detail: "Saved and review alerts" },
  { id: "help", label: "Help Centre", detail: "How this sample account works" },
];

export default function ProfilePage() {
  const titleId = useId();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [name, setName] = useState("Guest");
  const [handle, setHandle] = useState("guest");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const sync = () => {
      const profile = readProfile();
      setName(profile.name);
      setHandle(profile.handle);
      setVerified(profile.verified);
    };
    sync();
    window.addEventListener("suff-profile", sync);
    return () => window.removeEventListener("suff-profile", sync);
  }, [sheet]);

  return (
    <section aria-labelledby={titleId} className="-mx-4 -mt-4">
      <div className="rounded-b-[32px] bg-[var(--bg)] px-5 pb-12 pt-2 text-[var(--text)]">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            aria-label="Open settings"
            onClick={() => setSettingsOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--stroke)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <GearIcon />
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-[var(--accent)] text-xl font-semibold text-[var(--accent)]">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <h1 id={titleId} className="mt-3 text-xl font-semibold tracking-tight">
            {name}
          </h1>
          <p className="text-sm text-[var(--muted)]">@{handle}</p>
          <p className="mt-2 rounded-full border border-[var(--stroke)] px-3 py-1 text-xs text-[var(--accent)]">
            {verified ? "Verified Curator" : "Unverified Creator"}
          </p>
        </div>
      </div>
      <div className="relative z-10 -mt-7 px-4">
        <button
          type="button"
          onClick={openAuth}
          className="w-full rounded-[var(--radius-card)] bg-[var(--surface-inverted)] px-4 py-4 text-left text-[var(--text-inverted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span className="block text-sm font-semibold">{verified ? "Unlock Unlimited Submissions" : "Verify Creator Account"}</span>
          <span className="mt-1 block text-xs text-[var(--muted-inverted)]">
            {verified ? "Sample curator status on this device." : "Sample switch only. This does not verify an identity."}
          </span>
        </button>
        <ul className="mt-3 space-y-2 rounded-[28px] bg-[var(--surface-inverted)] p-3 text-[var(--text-inverted)]">
          {LINKS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSheet(item.id)}
                className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-xs text-[var(--muted-inverted)]">{item.detail}</span>
                </span>
                <span aria-hidden className="text-[var(--muted-inverted)]">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <PersonalDetailsModal open={sheet === "details"} onClose={() => setSheet(null)} onSaved={(next) => { setName(next.name); setHandle(next.handle); }} />
      <MySubmissionsModal open={sheet === "submissions"} onClose={() => setSheet(null)} />
      <InfoSheet sheet={sheet} onClose={() => setSheet(null)} />
    </section>
  );
}

function InfoSheet({ sheet, onClose }: { sheet: Sheet; onClose: () => void }) {
  if (sheet !== "security" && sheet !== "payment" && sheet !== "notifications" && sheet !== "help") return null;
  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/65" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg rounded-t-[28px] bg-[var(--surface-inverted)] p-4 text-[var(--text-inverted)]">
        <h2 className="text-lg font-semibold">{sheet === "security" ? "Security" : sheet === "payment" ? "Payment & Pro Tier" : sheet === "notifications" ? "Notifications" : "Help Centre"}</h2>
        <p className="mt-2 text-sm text-[var(--muted-inverted)]">
          {sheet === "payment"
            ? "Sample account is on the Member tier. Billing is not connected."
            : sheet === "help"
              ? "Suff stores bookmarks and profile fields on this device only."
              : "This control stays on this device."}
        </p>
        <button type="button" onClick={onClose} className="mt-4 rounded-full bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)]">
          Close
        </button>
      </div>
    </div>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
