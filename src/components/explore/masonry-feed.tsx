"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { UiPost } from "@/lib/types";
import { UiCard } from "@/components/explore/ui-card";

type MasonryFeedProps = {
  posts: UiPost[];
  pending?: boolean;
};

export function MasonryFeed({ posts, pending = false }: MasonryFeedProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pending) return <MasonrySkeleton />;

  if (posts.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--stroke)] px-4 py-10 text-center">
        <p className="text-sm font-medium text-[var(--text)]">No posts for this framework yet</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Try All, or another chip above.</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3">
      {posts.map((post) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("post", post.slug);
        return <UiCard key={post.id} post={post} href={`${pathname}?${params.toString()}`} />;
      })}
    </div>
  );
}

export function MasonrySkeleton() {
  return (
    <div className="columns-2 gap-3" aria-hidden>
      {[164, 220, 200, 148].map((height, index) => (
        <div key={index} className="mb-3 break-inside-avoid overflow-hidden rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--surface)]">
          <div className="animate-pulse bg-white/5" style={{ height }} />
          <div className="space-y-2 p-3">
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
