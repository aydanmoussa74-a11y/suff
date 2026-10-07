"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Framework, UiPost } from "@/lib/types";
import { PaletteStrip } from "@/components/explore/palette-strip";
import { SnippetViewer } from "@/components/explore/snippet-viewer";
import { downloadText, paletteFile, sharePost, snippetFilename } from "@/lib/share";

type DetailDrawerProps = {
  post: UiPost | null;
  missing?: boolean;
};

const TABS = [
  { id: "preview", label: "Preview" },
  { id: "palette", label: "Palette" },
  { id: "code", label: "Code" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DetailDrawer({ post, missing = false }: DetailDrawerProps) {
  const open = Boolean(post) || missing;
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabId>("preview");
  const [toast, setToast] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [activeFramework, setActiveFramework] = useState<Framework | null>(post?.snippets[0]?.framework ?? null);
  const exportRef = useRef<HTMLDivElement>(null);

  function close() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("post");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    setTab("preview");
    setExportOpen(false);
    setActiveFramework(post?.snippets[0]?.framework ?? null);
  }, [post?.slug]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (exportOpen) {
          setExportOpen(false);
          return;
        }
        close();
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>("a, button, [tabindex='0']");
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
  }, [open, searchParams, pathname, exportOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close details" className="absolute inset-0 bg-black/65" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-[28px] border border-[var(--stroke)] bg-[var(--surface)] shadow-[var(--shadow-nav)]"
      >
        <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">Detail</p>
            <h2 id={titleId} className="truncate text-lg font-semibold text-[var(--text)]">
              {post?.title ?? "Post not found"}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {post ? <ShareButton slug={post.slug} title={post.title} onToast={setToast} /> : null}
            {post ? (
              <ExportMenu
                post={post}
                open={exportOpen}
                menuRef={exportRef}
                activeFramework={activeFramework}
                onToggle={() => setExportOpen((value) => !value)}
                onClose={() => setExportOpen(false)}
              />
            ) : null}
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="rounded-full border border-[var(--stroke)] px-3 py-1 text-sm text-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              Close
            </button>
          </div>
        </div>
        {post ? (
          <>
            <div role="tablist" aria-label="Post details" className="mx-4 mb-3 grid grid-cols-3 gap-1 rounded-[var(--radius-chip)] border border-[var(--stroke)] p-1">
              {TABS.map((item) => {
                const selected = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setTab(item.id)}
                    className={`rounded-[var(--radius-chip)] px-2 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                      selected ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(20px,env(safe-area-inset-bottom))]">
              {tab === "preview" ? <PreviewPane post={post} /> : null}
              {tab === "palette" ? <PaletteStrip tokens={post.palette} /> : null}
              {tab === "code" ? <SnippetViewer snippets={post.snippets} onActiveChange={setActiveFramework} /> : null}
            </div>
            {toast ? (
              <p role="status" className="px-4 pb-3 text-sm text-[var(--accent)]">
                {toast}
              </p>
            ) : null}
          </>
        ) : (
          <p className="px-4 pb-8 text-sm text-[var(--muted)]">That slug is not in the sample feed. Close this sheet and pick a card.</p>
        )}
      </div>
    </div>
  );
}

function PreviewPane({ post }: { post: UiPost }) {
  const accent = post.palette.find((token) => token.role === "accent")?.hex ?? "#d7b56d";
  const surface = post.palette.find((token) => token.role === "surface")?.hex ?? "#12141a";
  return (
    <div>
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--stroke)]" style={{ background: surface }}>
        <div className="px-4 py-8">
          <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{post.preview.alt}</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: accent }}>
            {post.title}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">{post.summary}</p>
      <p className="mt-2 text-xs text-[var(--muted)]">
        @{post.author.handle} · {post.likeCount} likes
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <li key={tag} className="rounded-[var(--radius-chip)] border border-[var(--stroke)] px-2 py-1 text-xs text-[var(--text)]">
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShareButton({ slug, title, onToast }: { slug: string; title: string; onToast: (message: string) => void }) {
  return (
    <button
      type="button"
      aria-label={`Share ${title}`}
      onClick={async () => {
        const result = await sharePost(slug, title);
        if (result === "copied") onToast("Link Copied!");
        if (result === "failed") onToast("Could not copy the link.");
        if (result === "copied" || result === "failed") window.setTimeout(() => onToast(""), 1400);
      }}
      className="rounded-full border border-[var(--stroke)] px-3 py-1 text-sm text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      Share
    </button>
  );
}

function ExportMenu({
  post,
  open,
  menuRef,
  activeFramework,
  onToggle,
  onClose,
}: {
  post: UiPost;
  open: boolean;
  menuRef: RefObject<HTMLDivElement>;
  activeFramework: Framework | null;
  onToggle: () => void;
  onClose: () => void;
}) {
  const snippet = post.snippets.find((item) => item.framework === activeFramework) ?? post.snippets[0];
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
        className="rounded-full border border-[var(--stroke)] px-3 py-1 text-sm text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        Export
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 z-10 mt-1 w-48 rounded-xl border border-[var(--stroke)] bg-[var(--bg)] p-1 shadow-[var(--shadow-nav)]">
          <button
            type="button"
            role="menuitem"
            disabled={!snippet}
            onClick={() => {
              if (!snippet) return;
              downloadText(snippetFilename(snippet), snippet.code);
              onClose();
            }}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--text)] disabled:text-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            {snippet ? snippetFilename(snippet) : "No snippet"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              downloadText(`${post.slug}-tokens.json`, paletteFile(post.slug, post.palette), "application/json");
              onClose();
            }}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            tokens.json
          </button>
        </div>
      ) : null}
    </div>
  );
}
