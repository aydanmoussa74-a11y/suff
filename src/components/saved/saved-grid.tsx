"use client";

import { useCallback, useEffect, useState } from "react";
import type { UiPost } from "@/lib/types";
import { getSavedPostIds } from "@/lib/saves";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { UiCard } from "@/components/explore/ui-card";

type SavedGridProps = {
  posts: UiPost[];
};

export function SavedGrid({ posts }: SavedGridProps) {
  const [postIds, setPostIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [problem, setProblem] = useState("");
  const refresh = useCallback(async () => {
    try {
      const result = await getSavedPostIds();
      setPostIds(result.ids);
      setSignedIn(result.signedIn);
      setConfigured(result.configured);
      setProblem("");
    } catch {
      setProblem("Saved posts could not be loaded. Try again.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const client = getSupabaseBrowserClient();
    const { data: listener } = client?.auth.onAuthStateChange(() => { window.setTimeout(() => { void refresh(); }, 0); }) ?? { data: { subscription: null } };
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [refresh]);

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface)]" aria-hidden />;
  }

  const saved = postIds.map((id) => posts.find((post) => post.id === id)).filter((post): post is UiPost => Boolean(post));
  if (problem) return <p role="alert" className="py-8 text-center text-sm text-[var(--muted)]">{problem}</p>;

  if (saved.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--stroke)] px-4 py-10 text-center">
        <p className="text-sm font-medium text-[var(--text)]">{!configured ? "Supabase is not configured" : !signedIn ? "Sign in to see your saved posts" : "No saved components yet"}</p>
        <button type="button" onClick={() => !signedIn ? window.dispatchEvent(new Event("suff-auth")) : window.location.assign("/explore")} className="mt-3 inline-block rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          {!signedIn ? "Sign in" : "Browse Explore"}
        </button>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3">
      {saved.map((post) => (
        <UiCard key={post.slug} post={post} href={`/explore?post=${post.slug}`} />
      ))}
    </div>
  );
}
