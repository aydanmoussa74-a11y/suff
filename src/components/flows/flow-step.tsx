import type { FlowStep } from "@/lib/types";
import { SnippetViewer } from "@/components/explore/snippet-viewer";

type FlowStepViewProps = {
  step: FlowStep;
  total: number;
};

export function FlowStepView({ step, total }: FlowStepViewProps) {
  return (
    <article aria-label={`Step ${step.index} of ${total}: ${step.title}`} className="rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--surface)] p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
        Step {step.index} of {total}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-[var(--text)]">{step.title}</h3>
      <p className="mt-1 text-sm text-[var(--muted)]">{step.caption}</p>
      <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg)] px-4 py-10">
        <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{step.preview.alt}</p>
        <p className="mt-2 text-xl font-semibold text-[var(--accent)]">{step.title}</p>
      </div>
      <div className="mt-3">
        <SnippetViewer snippets={step.snippets} />
      </div>
    </article>
  );
}
