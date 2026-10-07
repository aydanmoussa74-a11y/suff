import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { posts } from "../src/data/posts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the seed script.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function stableUuid(value: string) {
  const namespace = Buffer.from("6ba7b8109dad11d180b400c04fd430c8", "hex");
  const bytes = createHash("sha1").update(namespace).update(`suff:${value}`).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function main() {
  const authors = new Map<string, (typeof posts)[number]["author"]>();
  for (const post of posts) authors.set(post.author.handle, post.author);

  const profileRows = [...authors.values()].map((author) => ({
    id: stableUuid(`author:${author.handle}`),
    handle: author.handle,
    name: author.name,
    avatar_url: author.avatarUrl || null,
    tier: author.tier,
    verified: false,
  }));
  const { error: profilesError } = await supabase.from("profiles").upsert(profileRows, { onConflict: "id" });
  if (profilesError) throw profilesError;

  const postRows = posts.map((post) => ({
    id: stableUuid(`post:${post.slug}`),
    slug: post.slug,
    kind: post.kind,
    title: post.title,
    summary: post.summary,
    author_id: stableUuid(`author:${post.author.handle}`),
    frameworks: post.frameworks,
    tags: post.tags,
    like_count: post.likeCount,
    preview_url: post.preview.src || null,
    preview: post.preview,
    palette: post.palette,
    snippets: post.snippets,
    steps: post.steps,
    created_at: post.createdAt,
  }));
  const { error: postsError } = await supabase.from("posts").upsert(postRows, { onConflict: "slug" });
  if (postsError) throw postsError;
  console.info(`Seeded ${profileRows.length} profiles and ${postRows.length} posts/flows.`);
}

main().catch((error: unknown) => {
  console.error("Suff seed failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
