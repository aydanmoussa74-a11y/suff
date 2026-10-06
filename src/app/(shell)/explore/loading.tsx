import { MasonrySkeleton } from "@/components/explore/masonry-feed";

export default function ExploreLoading() {
  return (
    <section aria-label="Explore loading">
      <div className="mb-4 h-9" />
      <MasonrySkeleton />
    </section>
  );
}
