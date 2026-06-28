import { supabase } from "@/integrations/supabase/client";

/**
 * Fire-and-forget IndexNow ping. Never throws — failures are only logged to console.
 * Submits the given URLs to Bing/Yandex via the indexnow-ping edge function
 * (the edge function handles CORS and filters URLs to the babybaby.org host).
 */
export async function pingIndexNow(urls: string[]): Promise<void> {
  if (!Array.isArray(urls) || urls.length === 0) return;
  try {
    const { data, error } = await supabase.functions.invoke("indexnow-ping", {
      body: { urls },
    });
    if (error) {
      console.info("[IndexNow] ping failed:", error.message);
      return;
    }
    console.info("[IndexNow] ping result:", data);
  } catch (e) {
    console.info("[IndexNow] ping threw (ignored):", e);
  }
}

export const SITE_ORIGIN = "https://babybaby.org";

export function articleUrlForIndexNow(idOrSlug: string | number, slug?: string): string {
  if (slug && typeof idOrSlug === "number") {
    return `${SITE_ORIGIN}/articles/${slug}-${idOrSlug}`;
  }
  return `${SITE_ORIGIN}/articles/${idOrSlug}`;
}
