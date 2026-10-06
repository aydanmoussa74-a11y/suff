"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/shell/bottom-nav";
import { TopBar } from "@/components/shell/top-bar";
import { AuthModal } from "@/components/auth/auth-modal";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const open = () => setAuthOpen(true);
    window.addEventListener("suff-auth", open);
    return () => window.removeEventListener("suff-auth", open);
  }, []);

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text)]">
      <TopBar />
      <main className="mx-auto w-full max-w-lg px-4 pb-28 pt-4">{children}</main>
      <BottomNav />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
