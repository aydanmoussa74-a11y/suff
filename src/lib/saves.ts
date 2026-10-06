const KEY = "suff.saved";

export function readSaves(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function writeSaves(slugs: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event("suff-saves"));
}

export function toggleSave(slug: string) {
  const current = readSaves();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current];
  writeSaves(next);
  return next;
}
