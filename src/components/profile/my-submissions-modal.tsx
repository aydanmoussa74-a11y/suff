"use client";

import { useEffect, useId } from "react";

type MySubmissionsModalProps = {
  open: boolean;
  onClose: () => void;
};

const SAMPLE = [
  { id: "sub_glass", title: "Glass balance", status: "In review" },
  { id: "sub_chip", title: "HTML chip", status: "Published" },
];

export function MySubmissionsModal({ open, onClose }: MySubmissionsModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close submissions" className="absolute inset-0 bg-black/65" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="absolute inset-x-0 bottom-0 mx-auto max-h-[70dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-[var(--surface-inverted)] p-4 text-[var(--text-inverted)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold">My Submissions</h2>
          <button type="button" onClick={onClose} className="text-sm text-[var(--muted-inverted)]">Close</button>
        </div>
        <ul className="space-y-2">
          {SAMPLE.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
              <span className="text-sm font-semibold">{item.title}</span>
              <span className="text-xs text-[var(--muted-inverted)]">{item.status}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--muted-inverted)]">Sample statuses. Upload is not connected.</p>
      </div>
    </div>
  );
}
