export type LocalProfile = {
  name: string;
  handle: string;
  verified: boolean;
  theme: "dark" | "oled";
  privacy: boolean;
  confirmSignOut: boolean;
  notifySaved: boolean;
};

const PROFILE_KEY = "suff.profile";

const DEFAULTS: LocalProfile = {
  name: "Guest",
  handle: "guest",
  verified: false,
  theme: "dark",
  privacy: true,
  confirmSignOut: true,
  notifySaved: false,
};

export function readProfile(): LocalProfile {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function writeProfile(next: LocalProfile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  document.documentElement.dataset.theme = next.theme;
}

export function applyTheme(theme: LocalProfile["theme"]) {
  document.documentElement.dataset.theme = theme;
}
