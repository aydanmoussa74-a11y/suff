import { getSupabaseBrowserClient } from "@/lib/supabase";

export async function getSavedPostIds() {
  const client = getSupabaseBrowserClient();
  if (!client) return { ids: [] as string[], signedIn: false, configured: false };
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user) return { ids: [] as string[], signedIn: false, configured: true };
  const { data, error } = await client.from("saved_posts").select("post_id").eq("user_id", user.id);
  if (error) throw error;
  return { ids: (data ?? []).map((row) => row.post_id), signedIn: true, configured: true };
}

export async function toggleSavedPost(postId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) throw new Error("Supabase is not configured.");
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Sign in to save posts.");
  const { data: existing, error: lookupError } = await client
    .from("saved_posts").select("post_id").eq("user_id", user.id).eq("post_id", postId).maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) {
    const { error } = await client.from("saved_posts").delete().eq("user_id", user.id).eq("post_id", postId);
    if (error) throw error;
    return false;
  }
  const { error } = await client.from("saved_posts").insert({ user_id: user.id, post_id: postId });
  if (error) throw error;
  return true;
}
