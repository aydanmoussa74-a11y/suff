"use client";

import { useEffect, useId, useState } from "react";
import { readProfile, writeProfile } from "@/lib/profile-store";

type PersonalDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (next: { name: string; handle: string }) => void;
};

export function PersonalDetailsModal({ open, onClose, onSaved }: PersonalDetailsModalProps) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const profile = readProfile();
    setName(profile.name);
    setHandle(profile.handle);
    setError("");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close personal details" className="absolute inset-0 bg-black/65" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg rounded-t-[28px] bg-[var(--surface-inverted)] p-4 text-[var(--text-inverted)]">
        <h2 id={titleId} className="text-lg font-semibold">Personal Details</h2>
        <form
          className="mt-3 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim().length < 2 || !/^[a-z0-9_]{3,16}$/.test(handle.trim())) {
              setError("Name needs 2 letters. Handle is 3–16 letters, numbers, or underscores.");
              return;
            }
            const profile = readProfile();
            writeProfile({ ...profile, name: name.trim(), handle: handle.trim() });
            onSaved({ name: name.trim(), handle: handle.trim() });
            onClose();
          }}
        >
          <label className="block text-sm">
            Display name
            <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-xl border border-[#e6eaf0] px-3 py-2" />
          </label>
          <label className="block text-sm">
            Handle
            <input value={handle} onChange={(event) => setHandle(event.target.value)} className="mt-1 w-full rounded-xl border border-[#e6eaf0] px-3 py-2" />
          </label>
          {error ? <p role="alert" className="text-sm text-[var(--danger)]">{error}</p> : null}
          <button type="submit" className="rounded-full bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)]">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
