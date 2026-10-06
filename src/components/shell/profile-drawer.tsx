"use client";

import { useEffect, useId, useRef } from "react";

type ProfileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const ACTIONS = [
  { id: "submit", label: "Submit UI", detail: "Send a component or snippet", href: "/explore?compose=submit" },
  { id: "snippets", label: "My Snippets", detail: "Drafts you have opened", href: "/sandbox" },
  { id: "boards", label: "Saved Boards", detail: "Bookmarks and collections", href: "/saved" },
  { id: "pro", label: "Pro Status", detail: "Sample account · Member", href: "/saved" },
] as const;

export function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close profile" className="absolute inset-0 bg-black/65" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[var(--surface-inverted)] text-[var(--text-inverted)] shadow-[var(--shadow-nav)]"
      >
        <div className="rounded-b-[32px] bg-[var(--bg)] px-5 pb-10 pt-[max(20px,env(safe-area-inset-top))] text-[var(--text)]">
          <div className="mb-6 flex justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--stroke)] px-3 py-1 text-sm text-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              Close
            </button>
          </div>
          <div className="flex items-end gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-[var(--stroke)] bg-[var(--surface)] text-lg font-semibold text-[var(--accent)]">
              G
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">Sample</p>
              <h2 id={titleId} className="text-xl font-semibold tracking-tight">
                Guest
              </h2>
              <p className="text-sm text-[var(--muted)]">Member · not signed in</p>
            </div>
          </div>
        </div>
        <ul className="-mt-6 flex flex-1 flex-col gap-2 px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
          {ACTIONS.map((action) => (
            <li key={action.id}>
              <a
                href={action.href}
                onClick={onClose}
                className="flex items-center justify-between rounded-2xl border border-[#e6eaf0] bg-white px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <span>
                  <span className="block text-sm font-semibold">{action.label}</span>
                  <span className="block text-xs text-[var(--muted-inverted)]">{action.detail}</span>
                </span>
                <span aria-hidden className="text-[var(--muted-inverted)]">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
