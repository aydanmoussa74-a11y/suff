"use client";

import { useState } from "react";
import type { Framework } from "@/lib/types";

type DevicePreviewProps = {
  slug: string;
  title: string;
  framework: Framework;
  accent: string;
};

export function DevicePreview({ slug, title, framework, accent }: DevicePreviewProps) {
  const web = framework === "react" || framework === "html";
  return web ? (
    <BrowserFrame title={title}>
      <PreviewBody slug={slug} title={title} accent={accent} />
    </BrowserFrame>
  ) : (
    <PhoneFrame>
      <PreviewBody slug={slug} title={title} accent={accent} />
    </PhoneFrame>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[92%] rounded-[28px] border border-white/15 bg-[#0c0d11] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      <div className="relative overflow-hidden rounded-[22px] bg-[#101218]" style={{ aspectRatio: "9 / 16" }}>
        <span className="absolute left-1/2 top-1.5 z-10 h-3 w-14 -translate-x-1/2 rounded-full bg-black/80" />
        <div className="h-full overflow-hidden pt-6">{children}</div>
      </div>
    </div>
  );
}

function BrowserFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[94%] overflow-hidden rounded-xl border border-white/12 bg-[#101218] shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#e15b4c]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#d7b56d]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#7dcea0]" />
        <span className="ml-1 truncate text-[9px] text-[var(--muted)]">{title}</span>
      </div>
      <div className="min-h-[210px]">{children}</div>
    </div>
  );
}

function PreviewBody({ slug, title, accent }: { slug: string; title: string; accent: string }) {
  if (slug.includes("login") || slug.includes("sign")) return <SignInPreview accent={accent} />;
  if (slug.includes("balance") || slug.includes("transfer")) return <BalancePreview accent={accent} title={title} />;
  if (slug.includes("settings")) return <SettingsPreview />;
  if (slug.includes("chip") || slug.includes("filter")) return <ChipPreview accent={accent} />;
  if (slug.includes("splash") || slug.includes("welcome")) return <SplashPreview accent={accent} />;
  return <BalancePreview accent={accent} title={title} />;
}

function SignInPreview({ accent }: { accent: string }) {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <form
      className="flex h-full flex-col justify-end gap-2 bg-[#07080b] p-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">Sign in</p>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Email"
        aria-label="Email preview"
        className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-[11px] text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
      />
      <button type="submit" className="rounded-full px-3 py-2 text-[11px] font-semibold text-[#1a1408]" style={{ background: accent }}>
        {sent ? "Sent" : "Continue"}
      </button>
    </form>
  );
}

function BalancePreview({ accent, title }: { accent: string; title: string }) {
  const [held, setHeld] = useState(false);
  return (
    <div className="flex h-full flex-col justify-between bg-[#07080b] p-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
        <p className="text-[9px] uppercase tracking-[0.14em] text-[var(--muted)]">{title}</p>
        <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>
          2,480
        </p>
      </div>
      <button
        type="button"
        onClick={() => setHeld((value) => !value)}
        className="rounded-full border border-white/10 px-3 py-2 text-[11px] text-[var(--text)]"
      >
        {held ? "Held" : "Hold to send"}
      </button>
    </div>
  );
}

function SettingsPreview() {
  const [on, setOn] = useState(true);
  return (
    <div className="space-y-1.5 bg-[#07080b] p-3">
      {["Appearance", "Alerts", "Language"].map((row) => (
        <button
          key={row}
          type="button"
          onClick={() => row === "Alerts" && setOn((value) => !value)}
          className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/5 px-2 py-2 text-left text-[11px] text-[var(--text)]"
        >
          {row}
          <span className="text-[10px] text-[var(--accent)]">{row === "Alerts" ? (on ? "On" : "Off") : "›"}</span>
        </button>
      ))}
    </div>
  );
}

function ChipPreview({ accent }: { accent: string }) {
  const [active, setActive] = useState("Flutter");
  return (
    <div className="flex h-full items-end bg-[#07080b] p-3">
      <div className="flex gap-1.5">
        {["Flutter", "React"].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setActive(chip)}
            className="rounded-full px-2.5 py-1 text-[10px]"
            style={active === chip ? { background: accent, color: "#1a1408" } : { border: "1px solid #222530", color: "#9a958c" }}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

function SplashPreview({ accent }: { accent: string }) {
  return (
    <div className="grid h-full place-items-center bg-[#07080b] text-center">
      <div>
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-[#1a1408]" style={{ background: accent }}>
          S
        </span>
        <p className="mt-2 text-xs text-[var(--text)]">Suff</p>
      </div>
    </div>
  );
}

export function FlowScreen({ stepId, title }: { stepId: string; title: string }) {
  const accent = "#d7b56d";
  return (
    <PhoneFrame>
      {stepId === "login" ? <SignInPreview accent={accent} /> : null}
      {stepId === "splash" ? <SplashPreview accent={accent} /> : null}
      {stepId === "document" ? <VerifyPreview title="Document frame" /> : null}
      {stepId === "face" ? <VerifyPreview title="Face check" /> : null}
      {stepId === "verified" ? <SuccessPreview title={title} /> : null}
      {!["login", "splash", "document", "face", "verified"].includes(stepId) ? <SplashPreview accent={accent} /> : null}
    </PhoneFrame>
  );
}

function VerifyPreview({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#07080b] px-4 text-center">
      <div className="grid h-28 w-20 place-items-center rounded-2xl border border-dashed border-[var(--accent)] bg-white/5">
        <span className="h-10 w-10 rounded-full border border-[var(--accent)]" />
      </div>
      <p className="text-[11px] text-[var(--text)]">{title}</p>
      <p className="text-[10px] text-[var(--muted)]">Sample frame. Nothing is captured.</p>
    </div>
  );
}

function SuccessPreview({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#07080b] px-4 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--ok)] text-sm font-semibold text-[#102117]">✓</span>
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      <button type="button" className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-[11px] font-semibold text-[#1a1408]">
        Continue
      </button>
    </div>
  );
}
