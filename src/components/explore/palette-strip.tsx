"use client";

import { useState } from "react";
import type { PaletteToken } from "@/lib/types";

type PaletteStripProps = {
  tokens: PaletteToken[];
};

export function PaletteStrip({ tokens }: PaletteStripProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function copy(token: PaletteToken) {
    setFailed(false);
    try {
      await navigator.clipboard.writeText(token.hex);
      setCopied(token.hex);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setFailed(true);
    }
  }

  if (tokens.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No palette tokens on this post.</p>;
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-2">
        {tokens.map((token) => {
          const active = copied === token.hex;
          return (
            <li key={`${token.role}-${token.hex}`}>
              <button
                type="button"
                onClick={() => copy(token)}
                className="flex w-full items-center gap-2 rounded-2xl border border-[var(--stroke)] bg-[var(--bg)] p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                aria-label={`Copy ${token.hex}`}
              >
                <span className="h-10 w-10 shrink-0 rounded-xl border border-white/10" style={{ background: token.hex }} />
                <span className="min-w-0">
                  <span className="block truncate text-xs uppercase tracking-wide text-[var(--muted)]">{token.role}</span>
                  <span className="block font-mono text-sm text-[var(--text)]">{active ? "Copied!" : token.hex}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {failed ? <p className="mt-2 text-sm text-[var(--danger)]">Copy failed. Select the hex and copy it manually.</p> : null}
    </div>
  );
}
