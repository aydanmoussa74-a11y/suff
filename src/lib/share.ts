import type { Framework, PaletteToken, Snippet } from "@/lib/types";

const EXT: Record<Framework, string> = {
  flutter: "dart",
  react: "tsx",
  swiftui: "swift",
  compose: "kt",
  html: "html",
};

export function postUrl(slug: string) {
  const url = new URL("/explore", window.location.origin);
  url.searchParams.set("post", slug);
  return url.toString();
}

export async function sharePost(slug: string, title: string) {
  const url = postUrl(slug);
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title, url });
      return "shared" as const;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "aborted" as const;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied" as const;
  } catch {
    return "failed" as const;
  }
}

export function downloadText(filename: string, contents: string, type = "text/plain") {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function snippetFilename(snippet: Snippet) {
  if (snippet.filename.includes(".")) return snippet.filename;
  return `${snippet.filename}.${EXT[snippet.framework]}`;
}

export function paletteFile(slug: string, tokens: PaletteToken[]) {
  return JSON.stringify({ slug, tokens }, null, 2);
}
