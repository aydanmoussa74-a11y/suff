"use client";

import { useEffect, useId, useRef, useState } from "react";
import { openAuth } from "@/components/auth/auth-modal";

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 px-4 pt-[max(12px,env(safe-area-inset-top))]">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between rounded-[var(--radius-nav)] border border-[var(--stroke)] bg-[var(--surface-glass)] px-3 backdrop-blur-xl">
        <a href="/explore" className="flex items-center gap-2 rounded-full px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-[var(--accent)] text-xs font-semibold text-[var(--accent-ink)]">
            S
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">Suff</span>
        </a>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openAuth}
            className="rounded-full px-3 py-1 text-sm text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--text)] hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            aria-label="Open search"
          >
            <SearchIcon />
          </button>
          <a
            href="/profile"
            className="grid h-10 w-10 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            aria-label="Open profile"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--stroke)] bg-[var(--surface)] text-xs font-semibold text-[var(--accent)]">
              G
            </span>
          </a>
        </div>
      </div>
      {searchOpen ? <SearchModal onClose={() => setSearchOpen(false)} /> : null}
    </header>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/60 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--surface)] p-4 shadow-[var(--shadow-nav)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id={titleId} className="text-sm font-semibold text-[var(--text)]">
            Search Suff
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-[var(--muted)] hover:text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            Close
          </button>
        </div>
        <label className="sr-only" htmlFor="suff-search">
          Search components and flows
        </label>
        <input
          id="suff-search"
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Components, flows, tags"
          className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
        />
        <p className="mt-3 text-sm text-[var(--muted)]">
          {query.trim()
            ? `No matches for “${query.trim()}” yet. Explore feed results connect in the next slice.`
            : "Search stays empty until the Explore feed is wired."}
        </p>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
