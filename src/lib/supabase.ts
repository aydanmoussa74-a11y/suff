import { createBrowserClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { UiPost } from "@/lib/types";

let browserClient: SupabaseClient | null | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient !== undefined) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  browserClient = url && key ? createBrowserClient(url, key) : null;
  return browserClient;
}

function configuredServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

type PostRow = {
  id: string;
  slug: string;
  kind: UiPost["kind"];
  title: string;
  summary: string;
  author: { handle: string; name: string; avatar_url: string | null; tier: UiPost["author"]["tier"] } | null;
  frameworks: string[] | null;
  tags: string[] | null;
  like_count: number | null;
  preview_url: string | null;
  preview: UiPost["preview"] | null;
  palette: UiPost["palette"] | null;
  snippets: UiPost["snippets"] | null;
  steps: UiPost["steps"] | null;
  created_at: string | null;
};

export function mapPost(row: PostRow): UiPost {
  return {
    id: row.id,
    slug: row.slug,
    kind: row.kind,
    title: row.title,
    summary: row.summary,
    author: {
      handle: row.author?.handle ?? "suff",
      name: row.author?.name ?? "Suff",
      avatarUrl: row.author?.avatar_url ?? "",
      tier: row.author?.tier ?? "member",
    },
    frameworks: (row.frameworks ?? []) as UiPost["frameworks"],
    tags: row.tags ?? [],
    likeCount: row.like_count ?? 0,
    saved: false,
    preview: row.preview ?? { src: row.preview_url ?? "", alt: row.title, width: 390, height: 520 },
    palette: row.palette ?? [],
    snippets: row.snippets ?? [],
    steps: row.steps ?? [],
    createdAt: row.created_at ?? new Date(0).toISOString(),
  };
}

export async function fetchPosts(): Promise<UiPost[] | null> {
  const client = configuredServerClient();
  if (!client) return null;
  const { data, error } = await client
    .from("posts")
    .select("id,slug,kind,title,summary,author:profiles!posts_author_id_fkey(handle,name,avatar_url,tier),frameworks,tags,like_count,preview_url,preview,palette,snippets,steps,created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Unable to fetch Suff posts from Supabase:", error.message);
    return [];
  }
  return (data as unknown as PostRow[]).map(mapPost);
}
