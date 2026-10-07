"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const CHIPS = [
  { id: "all", label: "All" },
  { id: "flutter", label: "Flutter" },
  { id: "react", label: "React" },
  { id: "swiftui", label: "SwiftUI" },
  { id: "compose", label: "Compose" },
] as const;

export function FrameworkChips() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("framework") ?? "all";

  return (
    <div className="-mx-4 mb-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div role="tablist" aria-label="Framework" className="flex w-max gap-2">
        {CHIPS.map((chip) => {
          const selected = active === chip.id || (chip.id === "all" && !searchParams.get("framework"));
          const params = new URLSearchParams(searchParams.toString());
          if (chip.id === "all") params.delete("framework");
          else params.set("framework", chip.id);
          const query = params.toString();
          const href = query ? `${pathname}?${query}` : pathname;
          return (
            <Link
              key={chip.id}
              href={href}
              scroll={false}
              role="tab"
              aria-selected={selected}
              className={`rounded-[var(--radius-chip)] border border-[0.5px] px-2.5 py-1 text-[12px] leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]"
                  : "border-white/15 bg-transparent text-[var(--muted)]"
              }`}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
