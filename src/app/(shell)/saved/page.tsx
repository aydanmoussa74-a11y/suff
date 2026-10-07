import { SavedGrid } from "@/components/saved/saved-grid";
import { posts as samplePosts } from "@/data/posts";
import { fetchPosts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const fetchedPosts = await fetchPosts();
  const items = (fetchedPosts ?? samplePosts).filter((post) => post.kind !== "flow");

  return (
    <section aria-label="Saved">
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-[var(--text)]">Saved</h1>
        <p className="text-sm text-[var(--muted)]">Your saved posts follow your account.</p>
      </header>
      <SavedGrid posts={items} />
    </section>
  );
}
