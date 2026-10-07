"use client";

import { useEffect, useState } from "react";
import type { UiPost } from "@/lib/types";
import { getSavedPostIds, toggleSavedPost } from "@/lib/saves";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { sharePost } from "@/lib/share";

const LABELS: Record<string, string> = {
  flutter: "Flutter",
  react: "React",
  swiftui: "SwiftUI",
  compose: "Compose",
  html: "HTML",
};

type UiCardProps = {
  post: UiPost;
  href: string;
};

export function UiCard({ post, href }: UiCardProps) {
  const accent = post.palette.find((token) => token.role === "accent")?.hex ?? "#d7b56d";
  const surface = post.palette.find((token) => token.role === "surface")?.hex ?? "#12141a";
  const tall = post.preview.height > 500;

  return (
    <article className="mb-3 break-inside-avoid overflow-hidden rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--surface)]">
      <a
        href={href}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <div className={`relative ${tall ? "h-64" : "h-44"}`} style={{ background: `linear-gradient(180deg, ${surface}, #07080b)` }}>
          <span className="absolute left-3 top-3 rounded-[var(--radius-chip)] border border-[var(--stroke)] bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wide text-[var(--accent)]">
            {LABELS[post.frameworks[0]] ?? post.frameworks[0]}
          </span>
          <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 p-3" style={{ background: surface }}>
            <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{post.tags[0]}</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>
              {post.title}
            </p>
          </div>
        </div>
      </a>
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <a href={href} className="min-w-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
          <h3 className="truncate text-sm font-semibold text-[var(--text)]">{post.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--bg)] text-[10px] text-[var(--accent)]">
              {post.author.name.slice(0, 1)}
            </span>
            @{post.author.handle}
          </p>
        </a>
        <div className="flex shrink-0 items-center gap-2">
          <p className="text-xs text-[var(--muted)]">{post.likeCount}</p>
          <ShareIconButton slug={post.slug} title={post.title} />
          <SaveToggle postId={post.id} />
        </div>
      </div>
    </article>
  );
}

function ShareIconButton({ slug, title }: { slug: string; title: string }) {
  const [label, setLabel] = useState("Share");

  return (
    <button
      type="button"
      aria-label={label === "Share" ? `Share ${title}` : label}
      onClick={async () => {
        const result = await sharePost(slug, title);
        if (result === "copied") {
          setLabel("Link Copied!");
          window.setTimeout(() => setLabel("Share"), 1400);
        }
      }}
      className="grid h-8 w-8 place-items-center rounded-full border border-[var(--stroke)] text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      {label === "Share" ? <ShareIcon /> : <span className="sr-only">Link Copied!</span>}
      {label !== "Share" ? <span aria-hidden className="text-[10px] text-[var(--accent)]">Ok</span> : null}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.75" />
      <path d="m8 11 7-3M8 13l7 3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function SaveToggle({ postId }: { postId: string }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      try {
        const result = await getSavedPostIds();
        if (mounted) setSaved(result.ids.includes(postId));
      } catch {
        if (mounted) setSaved(false);
      }
    };
    void sync();
    const client = getSupabaseBrowserClient();
    const { data: listener } = client?.auth.onAuthStateChange(() => { window.setTimeout(() => { void sync(); }, 0); }) ?? { data: { subscription: null } };
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [postId]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      disabled={busy}
      onClick={async () => {
        setStatus("");
        setBusy(true);
        try {
          setSaved(await toggleSavedPost(postId));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Could not update saved posts.";
          if (message.includes("Sign in")) {
            setStatus("Sign in to save");
            window.dispatchEvent(new Event("suff-auth"));
          } else {
            setStatus("Save unavailable");
          }
        } finally {
          setBusy(false);
          window.setTimeout(() => setStatus(""), 1800);
        }
      }}
      className={`rounded-full border px-2.5 py-1 text-[11px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
        saved ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--stroke)] text-[var(--muted)]"
      }`}
    >
      {status || (busy ? "…" : saved ? "Saved" : "Save")}
    </button>
  );
}
