import { SnippetReader } from "@/components/sandbox/snippet-reader";
import { sandboxEntries } from "@/data/posts";

export default function SandboxPage() {
  return (
    <section aria-label="Sandbox">
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-[var(--text)]">Sandbox</h1>
        <p className="text-sm text-[var(--muted)]">Preview HTML and React. Read Flutter, SwiftUI, and Compose.</p>
      </header>
      <SnippetReader entries={sandboxEntries()} />
    </section>
  );
}
