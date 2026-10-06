import { SavedGrid } from "@/components/saved/saved-grid";
import { posts } from "@/data/posts";

export default function SavedPage() {
  const items = posts.filter((post) => post.kind !== "flow");

  return (
    <section aria-label="Saved">
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-[var(--text)]">Saved</h1>
        <p className="text-sm text-[var(--muted)]">Bookmarks stay on this device.</p>
      </header>
      <SavedGrid posts={items} />
    </section>
  );
}
