"use client";

import { useEffect, useState } from "react";
import type { Framework, Snippet } from "@/lib/types";

const ORDER: Framework[] = ["flutter", "react", "swiftui", "compose", "html"];
const LABELS: Record<Framework, string> = {
  flutter: "Flutter",
  react: "React",
  swiftui: "SwiftUI",
  compose: "Compose",
  html: "HTML",
};

type SnippetViewerProps = {
  snippets: Snippet[];
  onActiveChange?: (framework: Framework) => void;
};

export function SnippetViewer({ snippets, onActiveChange }: SnippetViewerProps) {
  const available = ORDER.filter((framework) => snippets.some((snippet) => snippet.framework === framework));
  const [framework, setFramework] = useState<Framework | null>(available[0] ?? null);
  const active = framework && available.includes(framework) ? framework : available[0] ?? null;
  const visible = snippets.filter((snippet) => snippet.framework === active);
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (active) onActiveChange?.(active);
  }, [active, onActiveChange]);

  async function copy(snippet: Snippet) {
    setFailed(false);
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(snippet.filename);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setFailed(true);
    }
  }

  if (!active || visible.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No snippets for this post yet.</p>;
  }

  return (
    <div>
      <div role="tablist" aria-label="Snippet framework" className="mb-3 flex gap-2 overflow-x-auto">
        {available.map((item) => {
          const selected = item === active;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFramework(item)}
              className={`rounded-[var(--radius-chip)] border px-3 py-1.5 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]"
                  : "border-[var(--stroke)] text-[var(--muted)]"
              }`}
            >
              {LABELS[item]}
            </button>
          );
        })}
      </div>
      <ul className="space-y-3">
        {visible.map((snippet) => (
          <li key={snippet.filename} className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg)]">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--stroke)] px-3 py-2">
              <p className="truncate font-mono text-xs text-[var(--muted)]">
                {snippet.filename}
                <span className="ml-2">{snippet.language}</span>
              </p>
              <button
                type="button"
                onClick={() => copy(snippet)}
                className="shrink-0 rounded-full border border-[var(--stroke)] px-3 py-1 text-xs text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {copied === snippet.filename ? "Copied!" : "Copy snippet"}
              </button>
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-5 text-[var(--text)]">
              <code>{highlight(snippet.code)}</code>
            </pre>
          </li>
        ))}
      </ul>
      {failed ? <p className="mt-2 text-sm text-[var(--danger)]">Copy failed. Select the snippet and copy it manually.</p> : null}
    </div>
  );
}

function highlight(code: string) {
  const lines = code.split("\n");
  return lines.map((line, index) => (
    <span key={index} className="block">
      {colorLine(line)}
    </span>
  ));
}

function colorLine(line: string) {
  const parts = line.split(/(\/\/.*|#.*|"[^"]*"|'[^']*'|\b(?:class|const|fun|struct|export|function|return|override|Widget|View|Composable|Text|var|let)\b)/g);
  return parts.map((part, index) => {
    if (!part) return null;
    if (part.startsWith("//") || part.startsWith("#")) return <span key={index} className="text-[var(--muted)]">{part}</span>;
    if (part.startsWith('"') || part.startsWith("'")) return <span key={index} className="text-[var(--ok)]">{part}</span>;
    if (/^(class|const|fun|struct|export|function|return|override|var|let)$/.test(part)) {
      return <span key={index} className="text-[var(--accent)]">{part}</span>;
    }
    if (/^(Widget|View|Composable|Text)$/.test(part)) return <span key={index} className="text-[#f4f1ea]">{part}</span>;
    return <span key={index}>{part}</span>;
  });
}
