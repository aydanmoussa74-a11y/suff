"use client";

import { useEffect, useState } from "react";
import type { UiPost } from "@/lib/types";
import { getSavedPostIds, toggleSavedPost } from "@/lib/saves";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { sharePost } from "@/lib/share";
import { DevicePreview } from "@/components/explore/device-preview";

type UiCardProps = {
  post: UiPost;
  href: string;
};

export function UiCard({ post, href }: UiCardProps) {
  const accent = post.palette.find((token) => token.role === "accent")?.hex ?? "#d7b56d";
  const framework = post.frameworks[0] ?? "react";

  return (
    <article className="mb-3 break-inside-avoid">
      <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#101218] pb-12">
        <div className="px-2 pb-2 pt-3">
          <DevicePreview slug={post.slug} title={post.title} framework={framework} accent={accent} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
          <a href={href} className="flex min-w-0 items-center gap-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
            <span className="grid h-6 w-6 place-items-center rounded-full border border-white/15 text-[10px] text-[var(--accent)]">
              {post.author.name.slice(0, 1)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[var(--text)]">{post.title}</span>
              <span className="block truncate text-[10px] text-[var(--muted)]">@{post.author.handle}</span>
            </span>
          </a>
          <span className="flex shrink-0 items-center gap-1">
            <ShareIconButton slug={post.slug} title={post.title} />
            <SaveToggle postId={post.id} />
          </span>
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
      className="grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-black/40 text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      {label === "Share" ? <ShareIcon /> : <span className="text-[9px] text-[var(--accent)]">Ok</span>}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    const { data: listener } = client?.auth.onAuthStateChange(() => {
      window.setTimeout(() => {
        void sync();
      }, 0);
    }) ?? { data: { subscription: null } };
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
        setBusy(true);
        try {
          setSaved(await toggleSavedPost(postId));
        } catch (error) {
          const message = error instanceof Error ? error.message : "";
          if (message.includes("Sign in")) window.dispatchEvent(new Event("suff-auth"));
        } finally {
          setBusy(false);
        }
      }}
      className={`grid h-7 w-7 place-items-center rounded-full border bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
        saved ? "border-[var(--accent)] text-[var(--accent)]" : "border-white/15 text-[var(--text)]"
      }`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} aria-hidden="true">
        <path d="M7 5.5h10a1 1 0 0 1 1 1V20l-6-3.2L6 20V6.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    </button>
  );
}
