"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TabId = "explore" | "flows" | "sandbox" | "saved";

const TABS: { id: TabId; href: string; label: string }[] = [
  { id: "explore", href: "/explore", label: "Explore" },
  { id: "flows", href: "/flows", label: "Flows" },
  { id: "sandbox", href: "/sandbox", label: "Sandbox" },
  { id: "saved", href: "/saved", label: "Saved" },
];

export function FloatingNav() {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    TABS.findIndex((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`)),
  );

  return (
    <nav aria-label="Primary" className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-5" style={{ bottom: "var(--nav-offset)" }}>
      <div className="pointer-events-auto relative grid h-12 w-full max-w-[20rem] grid-cols-4 rounded-full border border-white/10 bg-[var(--surface-glass)] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <span
          aria-hidden
          className="absolute bottom-1 left-1 top-1 rounded-full bg-[var(--accent)] transition-transform duration-300 ease-out"
          style={{ width: "calc(25% - 2px)", transform: `translateX(${activeIndex * 100}%)` }}
        />
        {TABS.map((tab) => {
          const active = TABS[activeIndex]?.id === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative z-10 grid place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                active ? "text-[var(--accent-ink)]" : "text-[var(--muted)]"
              }`}
            >
              <TabIcon id={tab.id} />
              <span className="sr-only">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TabIcon({ id }: { id: TabId }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true as const };
  if (id === "explore") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }
  if (id === "flows") {
    return (
      <svg {...common}>
        <path d="M5 7h14M5 12h10M5 17h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "sandbox") {
    return (
      <svg {...common}>
        <path d="m8 8-4 4 4 4M16 8l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M7 5.5h10a1 1 0 0 1 1 1V20l-6-3.2L6 20V6.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
