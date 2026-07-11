import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

function buildPrompt(title: string, brief: string): string {
  const scene = (brief || title).slice(0, 280);
  return `Photographie éditoriale réaliste haut de gamme, style magazine parentalité premium, pour illustrer un article intitulé "${title}". Scène spécifique au sujet : ${scene}. Cadrage cinématographique 16:9, lumière naturelle douce (fenêtre, golden hour ou éclairage d'intérieur chaleureux), profondeur de champ marquée (bokeh subtil), textures authentiques (bois, textile, peau), palette douce et lumineuse cohérente avec une marque bébé bienveillante, composition soignée façon reportage lifestyle. Personnages (parents, bébés) réalistes, anatomiquement corrects, expressions naturelles et sincères, mains et visages nets. Intérieur québécois contemporain chaleureux si scène domestique.

INTERDICTIONS ABSOLUES : aucun texte, lettre, chiffre, filigrane ou logo dans l'image ; pas d'illustration cartoon, dessin animé, 3D stylisé, vectoriel, flat design, aquarelle ni style pastel enfantin ; pas de rendu "IA générique" ni de collage ; pas de mains déformées, doigts en trop, visages fondus ou yeux asymétriques ; pas de saturation criarde ni d'éclairage néon.`;
}

async function generateImage(apiKey: string, prompt: string): Promise<Uint8Array | null> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) {
    console.warn("image gen failed", res.status, (await res.text()).slice(0, 200));
    return null;
  }
  const json = await res.json();
  const b64 = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!b64) return null;
  const base64Data = b64.replace(/^data:image\/\w+;base64,/, "");
  return Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const CRON_SECRET = Deno.env.get("CRON_SECRET");

  try {
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Auth: cron secret or admin JWT
    const cronHeader = req.headers.get("x-cron-secret");
    const isCron = !!CRON_SECRET && cronHeader === CRON_SECRET;
    if (!isCron) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data: hasRole } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!hasRole) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    const limit: number = Math.min(Number(body?.limit) || 50, 100);
    const sinceMs: number = body?.sinceMs ? Number(body.sinceMs) : Date.parse("2026-06-01T00:00:00Z");

    const results: Array<{ kind: string; id: string | number; title: string; status: string; error?: string }> = [];

    // 1) Pipeline articles in storage
    const { data: files, error: listErr } = await supabase.storage.from("articles").list("articles", {
      limit: 200,
      sortBy: { column: "name", order: "desc" },
    });
    if (listErr) throw listErr;

    let processed = 0;
    for (const f of files ?? []) {
      if (processed >= limit) break;
      if (!f.name.endsWith(".json") || f.name === "_index.json") continue;
      const idStr = f.name.replace(".json", "");
      const idNum = Number(idStr);
      // Only pipeline (timestamp) articles, skip old static (id 200, 201, etc.)
      if (!Number.isFinite(idNum) || idNum < 1000000000000) continue;
      if (idNum < sinceMs) continue;

      try {
        const { data: blob } = await supabase.storage.from("articles").download(`articles/${f.name}`);
        if (!blob) { results.push({ kind: "pipeline", id: idStr, title: "?", status: "skip-download" }); continue; }
        const article = JSON.parse(await blob.text());
        const prompt = buildPrompt(article.title, article.image_alt || article.excerpt || article.summary || "");
        const img = await generateImage(LOVABLE_API_KEY, prompt);
        if (!img) { results.push({ kind: "pipeline", id: idNum, title: article.title, status: "gen-failed" }); continue; }
        const fileName = `article-images/${idNum}.png`;
        const { error: upErr } = await supabase.storage
          .from("articles")
          .upload(fileName, img, { contentType: "image/png", cacheControl: "3600", upsert: true });
        if (upErr) { results.push({ kind: "pipeline", id: idNum, title: article.title, status: "upload-failed", error: upErr.message }); continue; }
        const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(fileName);
        // Update the JSON's image field (cache-bust with ?v=timestamp so front picks up new bytes even if CDN caches)
        const bust = `?v=${Date.now()}`;
        article.image = publicUrl.split("?")[0] + bust;
        const jsonBlob = new Blob([JSON.stringify(article, null, 2)], { type: "application/json" });
        await supabase.storage.from("articles").upload(`articles/${f.name}`, jsonBlob, { upsert: true, cacheControl: "3600" });
        results.push({ kind: "pipeline", id: idNum, title: article.title, status: "ok" });
        processed++;
      } catch (e) {
        results.push({ kind: "pipeline", id: idStr, title: "?", status: "error", error: e instanceof Error ? e.message : String(e) });
      }
    }

    // 2) cms_articles
    try {
      const { data: rows } = await supabase.from("cms_articles").select("id, title, excerpt, image").limit(50);
      for (const row of rows ?? []) {
        try {
          const prompt = buildPrompt(row.title, row.excerpt || row.title);
          const img = await generateImage(LOVABLE_API_KEY, prompt);
          if (!img) { results.push({ kind: "cms", id: row.id, title: row.title, status: "gen-failed" }); continue; }
          const fileName = `article-images/cms-${row.id}.png`;
          const { error: upErr } = await supabase.storage
            .from("articles")
            .upload(fileName, img, { contentType: "image/png", cacheControl: "3600", upsert: true });
          if (upErr) { results.push({ kind: "cms", id: row.id, title: row.title, status: "upload-failed", error: upErr.message }); continue; }
          const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(fileName);
          const finalUrl = publicUrl.split("?")[0] + `?v=${Date.now()}`;
          await supabase.from("cms_articles").update({ image: finalUrl }).eq("id", row.id);
          results.push({ kind: "cms", id: row.id, title: row.title, status: "ok" });
        } catch (e) {
          results.push({ kind: "cms", id: row.id, title: row.title, status: "error", error: e instanceof Error ? e.message : String(e) });
        }
      }
    } catch (e) {
      console.warn("cms pass failed", e);
    }

    return new Response(JSON.stringify({ success: true, count: results.length, results }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("regenerate-article-images error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
