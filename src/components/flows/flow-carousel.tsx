"use client";

import { useState } from "react";
import type { UiPost } from "@/lib/types";
import { FlowStepView } from "@/components/flows/flow-step";

type FlowCarouselProps = {
  post: UiPost;
};

export function FlowCarousel({ post }: FlowCarouselProps) {
  const steps = [...post.steps].sort((a, b) => a.index - b.index);
  const [index, setIndex] = useState(0);
  const step = steps[index];
  if (!step) return null;
  const atStart = index === 0;
  const atEnd = index === steps.length - 1;

  return (
    <section aria-roledescription="carousel" aria-label={post.title} className="rounded-[var(--radius-card)]">
      <header className="mb-3">
        <h2 className="text-base font-semibold text-[var(--text)]">{post.title}</h2>
        <p className="text-sm text-[var(--muted)]">{post.summary}</p>
      </header>
      <div className="mb-3 flex gap-1" role="tablist" aria-label="Steps">
        {steps.map((item, itemIndex) => {
          const selected = itemIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`${item.title}, step ${item.index}`}
              onClick={() => setIndex(itemIndex)}
              className={`h-1.5 flex-1 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                selected ? "bg-[var(--accent)]" : "bg-[var(--stroke)]"
              }`}
            />
          );
        })}
      </div>
      <FlowStepView step={step} total={steps.length} />
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          disabled={atStart}
          className="rounded-full border border-[var(--stroke)] px-4 py-2 text-sm text-[var(--text)] disabled:text-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          Back
        </button>
        <p className="text-xs text-[var(--muted)]" aria-live="polite">
          {step.index} / {steps.length}
        </p>
        <button
          type="button"
          onClick={() => setIndex((value) => Math.min(steps.length - 1, value + 1))}
          disabled={atEnd}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)] disabled:bg-[var(--stroke)] disabled:text-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          Next
        </button>
      </div>
    </section>
  );
}
