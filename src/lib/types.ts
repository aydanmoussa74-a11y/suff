export type Framework = "flutter" | "react" | "swiftui" | "compose" | "html";
export type PostKind = "component" | "screen" | "flow";

export type PaletteToken = {
  name: string;
  hex: string;
  role: "bg" | "surface" | "text" | "muted" | "accent" | "stroke";
};

export type Snippet = {
  framework: Framework;
  language: string;
  filename: string;
  code: string;
};

export type FlowStep = {
  id: string;
  index: number;
  title: string;
  caption: string;
  preview: { src: string; alt: string; width: number; height: number };
  snippets: Snippet[];
};

export type UiPost = {
  id: string;
  slug: string;
  kind: PostKind;
  title: string;
  summary: string;
  author: {
    handle: string;
    name: string;
    avatarUrl: string;
    tier: "member" | "pro" | "curator";
  };
  frameworks: Framework[];
  tags: string[];
  likeCount: number;
  saved: boolean;
  preview: { src: string; alt: string; width: number; height: number };
  palette: PaletteToken[];
  snippets: Snippet[];
  steps: FlowStep[];
  createdAt: string;
};

export const FRAMEWORKS = ["flutter", "react", "swiftui", "compose", "html"] as const;

export function isFramework(value: string): value is Framework {
  return (FRAMEWORKS as readonly string[]).includes(value);
}
