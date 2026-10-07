"use client";

import { useRef, useState } from "react";
import type { UiPost } from "@/lib/types";
import { FlowScreen } from "@/components/explore/device-preview";

type FlowCardProps = {
  post: UiPost;
};

export function FlowCard({ post }: FlowCardProps) {
  const steps = [...post.steps].sort((a, b) => a.index - b.index);
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function sync() {
    const node = scroller.current;
    if (!node) return;
    const width = node.clientWidth * 0.72 || 1;
    setIndex(Math.round(node.scrollLeft / width));
  }

  return (
    <section aria-roledescription="carousel" aria-label={post.title}>
      <header className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--text)]">{post.title}</h2>
          <p className="text-xs text-[var(--muted)]">Sample screens. Nothing is captured.</p>
        </div>
        <p className="text-[11px] text-[var(--accent)]" aria-live="polite">
          {Math.min(index + 1, steps.length)} / {steps.length}
        </p>
      </header>
      <div className="mb-3 flex gap-1" aria-hidden>
        {steps.map((step, stepIndex) => (
          <span key={step.id} className={`h-1 flex-1 rounded-full ${stepIndex <= index ? "bg-[var(--accent)]" : "bg-[var(--stroke)]"}`} />
        ))}
      </div>
      <div
        ref={scroller}
        onScroll={sync}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((step) => (
          <article key={step.id} className="w-[72%] shrink-0 snap-center">
            <FlowScreen stepId={step.id} title={step.title} />
            <p className="mt-2 text-center text-[11px] text-[var(--muted)]">{step.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
