import { FlowCarousel } from "@/components/flows/flow-carousel";
import { posts as samplePosts } from "@/data/posts";
import { fetchPosts } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export default async function FlowsPage() {
  const fetchedPosts = await fetchPosts();
  const flows = (fetchedPosts ?? samplePosts).filter((post) => post.kind === "flow" && post.steps.length > 0);

  return (
    <section aria-label="Flows" className="space-y-8">
      <header>
        <h1 className="text-lg font-semibold text-[var(--text)]">Flows</h1>
        <p className="text-sm text-[var(--muted)]">Step-by-step journeys. Sample screens only.</p>
      </header>
      {flows.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--stroke)] px-4 py-10 text-center text-sm text-[var(--muted)]">
          No flows yet.
        </p>
      ) : (
        flows.map((post) => <FlowCarousel key={post.id} post={post} />)
      )}
    </section>
  );
}
