import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const TOPICS = [
  "nouvelles méthodes d'éducation positive",
  "alimentation bio et diversification alimentaire",
  "impact des écrans sur le développement cognitif",
  "routines de sommeil et chronobiologie infantile",
  "aménagement Montessori et espaces d'éveil",
  "communication bienveillante et gestion des émotions",
  "activités sensorielles et motricité libre",
  "parentalité écologique et produits naturels",
  "développement du langage et bilinguisme",
  "prévention santé et vaccinations récentes",
  "jeux éducatifs et apprentissage précoce",
  "équilibre vie professionnelle et parentale",
  "allaitement et nutrition maternelle",
  "développement social et socialisation",
  "gestion du stress parental",
];

async function callAI(apiKey: string, body: Record<string, unknown>) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway ${res.status}: ${t.slice(0, 300)}`);
  }
  return await res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const CRON_SECRET = Deno.env.get("CRON_SECRET");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- Authorization: either CRON_SECRET header OR admin JWT ---
    const cronHeader = req.headers.get("x-cron-secret");
    const isCron = !!CRON_SECRET && cronHeader === CRON_SECRET;

    if (!isCron) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: hasRole } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!hasRole) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // --- Step 1: identify a specific trend ---
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const seed = Date.now();

    const trendData = await callAI(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "Tu es expert en parentalité. Identifie une tendance SPÉCIFIQUE et innovante (2024-2025), pas générique.",
        },
        {
          role: "user",
          content: `Identifie UNE tendance précise concernant: "${topic}". Une seule phrase claire. ID:${seed}`,
        },
      ],
    });
    const trend = trendData.choices[0].message.content.trim();

    // --- Step 2: generate full article ---
    const articleData = await callAI(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "Tu es rédacteur expert en parentalité. Tu écris en français des articles bien structurés, en Markdown, avec des conseils pratiques et un ton bienveillant.",
        },
        {
          role: "user",
          content: `Rédige un article complet sur: "${trend}".

Exigences:
- Titre accrocheur et SPÉCIFIQUE (pas commencer par "Parentalité")
- Minimum 800 mots
- Structuré avec ## et ###
- Listes à puces pour les conseils
- Conclusion encourageante
- SEO-friendly (mots-clés naturels)

Réponds UNIQUEMENT avec le Markdown de l'article.`,
        },
      ],
    });
    const fullContent = articleData.choices[0].message.content.trim();

    // --- Step 3: extract metadata via tool calling for reliability ---
    const metaData = await callAI(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "Tu extrais des métadonnées d'articles de blog." },
        {
          role: "user",
          content: `Extrais les métadonnées de cet article:\n\n${fullContent.slice(0, 4000)}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "save_metadata",
            description: "Save the extracted metadata",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Titre <= 100 chars" },
                summary: { type: "string", description: "Résumé 2-3 phrases" },
                excerpt: { type: "string", description: "Premier paragraphe court" },
                category: {
                  type: "string",
                  enum: ["Préparation", "Nutrition", "Développement", "Sommeil", "Croissance", "Aménagement"],
                },
                tags: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
                reading_time: { type: "integer", minimum: 2, maximum: 20 },
              },
              required: ["title", "summary", "excerpt", "category", "tags", "reading_time"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "save_metadata" } },
    });

    let metadata: any;
    try {
      const args = metaData.choices[0].message.tool_calls?.[0]?.function?.arguments;
      metadata = JSON.parse(args);
    } catch {
      metadata = {
        title: trend.slice(0, 100),
        summary: `Article sur ${trend}`,
        excerpt: fullContent.slice(0, 200),
        category: "Développement",
        tags: ["parentalité", "conseil", "enfant"],
        reading_time: Math.max(3, Math.ceil(fullContent.split(/\s+/).length / 200)),
      };
    }

    const articleId = Date.now();

    // --- Step 4: generate cover image ---
    let imageUrl = "/lovable-uploads/gentle-parenting.jpg";
    try {
      const imagePrompt = `Illustration moderne, douce et chaleureuse pour un article sur la parentalité intitulé "${metadata.title}". ${metadata.excerpt.slice(0, 150)}. Couleurs pastel, style éditorial premium, format 16:9.`;
      const imgRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{ role: "user", content: imagePrompt }],
          modalities: ["image", "text"],
        }),
      });
      if (imgRes.ok) {
        const imgJson = await imgRes.json();
        const b64 = imgJson.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (b64) {
          const base64Data = b64.replace(/^data:image\/\w+;base64,/, "");
          const binary = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          const fileName = `article-images/${articleId}.png`;
          const { error: upErr } = await supabase.storage
            .from("articles")
            .upload(fileName, binary, { contentType: "image/png", cacheControl: "3600", upsert: false });
          if (!upErr) {
            const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(fileName);
            imageUrl = publicUrl;
          }
        }
      }
    } catch (e) {
      console.error("Image generation failed, using fallback:", e);
    }

    // --- Step 5: publish article (write JSON to storage – matches existing site contract) ---
    const articlePayload = {
      id: articleId,
      title: metadata.title,
      content: fullContent,
      summary: metadata.summary,
      excerpt: metadata.excerpt,
      category: metadata.category,
      image: imageUrl,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      readingTime: metadata.reading_time,
      tags: metadata.tags,
      author: "Assistant IA",
      featured: false,
      views: 0,
      source_trend: trend,
      created_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(articlePayload, null, 2)], { type: "application/json" });
    const { error: jsonErr } = await supabase.storage
      .from("articles")
      .upload(`articles/${articleId}.json`, blob, { upsert: true, cacheControl: "3600" });
    if (jsonErr) throw jsonErr;

    return new Response(
      JSON.stringify({
        success: true,
        articleId,
        title: metadata.title,
        trend,
        triggered_by: isCron ? "cron" : "admin",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("auto-publish-article error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
