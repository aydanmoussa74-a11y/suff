"use client";

import { useMemo, useState } from "react";
import type { Framework, Snippet } from "@/lib/types";
import { SnippetViewer } from "@/components/explore/snippet-viewer";

export type SandboxEntry = {
  id: string;
  title: string;
  snippet: Snippet;
};

const ORDER: Framework[] = ["html", "react", "flutter", "swiftui", "compose"];
const LABELS: Record<Framework, string> = {
  html: "HTML",
  react: "React",
  flutter: "Flutter",
  swiftui: "SwiftUI",
  compose: "Compose",
};

type SnippetReaderProps = {
  entries: SandboxEntry[];
};

export function SnippetReader({ entries }: SnippetReaderProps) {
  const available = ORDER.filter((framework) => entries.some((entry) => entry.snippet.framework === framework));
  const [framework, setFramework] = useState<Framework>(available[0] ?? "html");
  const activeFramework = available.includes(framework) ? framework : available[0];
  const visible = useMemo(
    () => entries.filter((entry) => entry.snippet.framework === activeFramework),
    [entries, activeFramework],
  );
  const [entryId, setEntryId] = useState(visible[0]?.id ?? "");
  const entry = visible.find((item) => item.id === entryId) ?? visible[0];
  const web = activeFramework === "html" || activeFramework === "react";
  const [preview, setPreview] = useState(web);

  if (!activeFramework || !entry) {
    return <p className="text-sm text-[var(--muted)]">No snippets to read yet.</p>;
  }

  return (
    <div>
      <div role="tablist" aria-label="Language" className="mb-3 flex gap-2 overflow-x-auto">
        {available.map((item) => {
          const selected = item === activeFramework;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setFramework(item);
                setPreview(item === "html" || item === "react");
              }}
              className={`rounded-[var(--radius-chip)] border px-3 py-1.5 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                selected ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]" : "border-[var(--stroke)] text-[var(--muted)]"
              }`}
            >
              {LABELS[item]}
            </button>
          );
        })}
      </div>
      <label className="mb-3 block text-xs text-[var(--muted)]" htmlFor="sandbox-entry">
        Sample
        <select
          id="sandbox-entry"
          value={entry.id}
          onChange={(event) => setEntryId(event.target.value)}
          className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)]"
        >
          {visible.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      {web ? (
        <button
          type="button"
          aria-pressed={preview}
          onClick={() => setPreview((value) => !value)}
          className="mb-3 rounded-full border border-[var(--stroke)] px-3 py-1.5 text-xs text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          {preview ? "Hide preview" : "Show preview"}
        </button>
      ) : (
        <p className="mb-3 text-xs text-[var(--muted)]">Read-only snippet. Live preview is for HTML and React.</p>
      )}
      {web && preview ? <WebPreview framework={activeFramework} code={entry.snippet.code} title={entry.title} /> : null}
      <SnippetViewer snippets={[entry.snippet]} />
    </div>
  );
}

function WebPreview({ framework, code, title }: { framework: Framework; code: string; title: string }) {
  if (framework === "html") {
    const srcDoc = `<!doctype html><html><body style="margin:0;background:#07080b;color:#f4f1ea;display:grid;place-items:center;min-height:160px;font-family:sans-serif">${code}</body></html>`;
    return (
      <iframe
        title={`Preview of ${title}`}
        sandbox=""
        srcDoc={srcDoc}
        className="mb-3 h-40 w-full rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg)]"
      />
    );
  }
  return (
    <div className="mb-3 rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg)] p-4" aria-label={`Preview of ${title}`}>
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">React layout preview</p>
      <button type="button" className="mt-3 rounded-full bg-[var(--accent)] px-3 py-2 text-sm font-medium text-[var(--accent-ink)]">
        {title}
      </button>
      <p className="mt-2 text-xs text-[var(--muted)]">Sample layout only. The snippet is not compiled in the browser.</p>
      <pre className="sr-only">{code}</pre>
    </div>
  );
}
