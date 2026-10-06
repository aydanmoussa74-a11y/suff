"use client";

import { useEffect, useState } from "react";
import type { UiPost } from "@/lib/types";
import { readSaves } from "@/lib/saves";
import { UiCard } from "@/components/explore/ui-card";

type SavedGridProps = {
  posts: UiPost[];
};

export function SavedGrid({ posts }: SavedGridProps) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSlugs(readSaves());
    sync();
    setReady(true);
    window.addEventListener("suff-saves", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("suff-saves", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface)]" aria-hidden />;
  }

  const saved = slugs.map((slug) => posts.find((post) => post.slug === slug)).filter((post): post is UiPost => Boolean(post));

  if (saved.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--stroke)] px-4 py-10 text-center">
        <p className="text-sm font-medium text-[var(--text)]">No saved components yet</p>
        <a
          href="/explore"
          className="mt-3 inline-block rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Browse Explore
        </a>
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
