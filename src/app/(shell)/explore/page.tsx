import { Suspense } from "react";
import { DetailDrawer } from "@/components/explore/detail-drawer";
import { FrameworkChips } from "@/components/explore/framework-chips";
import { MasonryFeed, MasonrySkeleton } from "@/components/explore/masonry-feed";
import { filterPosts, posts } from "@/data/posts";
import { isFramework } from "@/lib/types";

type ExplorePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const raw = typeof params.framework === "string" ? params.framework : undefined;
  const framework = raw && isFramework(raw) ? raw : undefined;
  const items = filterPosts(framework);
  const slug = typeof params.post === "string" ? params.post : undefined;
  const active = slug ? posts.find((post) => post.slug === slug) ?? null : null;

  return (
    <section aria-label="Explore">
      <Suspense fallback={<div className="mb-4 h-9" />}>
        <FrameworkChips />
      </Suspense>
      <Suspense fallback={<MasonrySkeleton />}>
        <MasonryFeed posts={items} />
      </Suspense>
      <Suspense fallback={null}>
        <DetailDrawer post={active} missing={Boolean(slug && !active)} />
      </Suspense>
    </section>
  );
}
