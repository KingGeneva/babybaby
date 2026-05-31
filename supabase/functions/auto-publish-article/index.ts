import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@4.0.0";

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

async function notifyFailure(error: string, context: Record<string, unknown> = {}) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return;
  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "BabyBaby <onboarding@resend.dev>",
      to: ["contact@babybaby.org"],
      subject: "⚠️ Auto-publish article — échec",
      html: `<h2>Échec de la génération d'article</h2>
        <p><strong>Erreur:</strong> ${error}</p>
        <pre>${JSON.stringify(context, null, 2)}</pre>
        <p>Vérifiez les crédits Lovable AI ou les logs de la fonction <code>auto-publish-article</code>.</p>`,
    });
  } catch (e) {
    console.error("Failed to send alert email:", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const CRON_SECRET = Deno.env.get("CRON_SECRET");

  try {
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

    // --- Step 1: identify a specific trend + SEO keyword (cheap model) ---
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const seed = Date.now();

    const trendData = await callAI(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-flash-lite",
      messages: [
        {
          role: "system",
          content:
            "Tu es expert SEO et parentalité francophone. Tu identifies des tendances précises ET le mot-clé long-tail à fort potentiel de recherche associé.",
        },
        {
          role: "user",
          content: `Sur le thème "${topic}", identifie UNE tendance précise 2024-2025 ET le mot-clé long-tail français le plus recherché (3-6 mots, intention informationnelle parentale).
Format strict:
TENDANCE: <une phrase>
MOT-CLE: <mot-clé long-tail>
ID:${seed}`,
        },
      ],
    });
    const trendRaw = trendData.choices[0].message.content.trim();
    const trend = (trendRaw.match(/TENDANCE\s*:\s*(.+)/i)?.[1] || trendRaw).trim();
    const keyword = (trendRaw.match(/MOT-CLE\s*:\s*(.+)/i)?.[1] || topic).trim();

    // --- Step 2: generate RICH article + metadata in ONE call (tool calling) ---
    const articleData = await callAI(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "Tu es rédacteur SEO expert en parentalité francophone. Tu écris des articles longs, pratiques, optimisés pour Google Discover et la recherche organique. Tu intègres naturellement les mots-clés, structures sémantiques (H2/H3), exemples concrets, données chiffrées récentes (2024-2025) et FAQ. Tu cites des sources fiables (OMS, INSPQ, Santé publique France, études récentes) en fin d'article.",
        },
        {
          role: "user",
          content: `Rédige un article SEO complet et engageant.

SUJET: "${trend}"
MOT-CLÉ PRINCIPAL: "${keyword}" (à intégrer naturellement dans le titre, intro, 2 H2, et conclusion)

EXIGENCES STRICTES:
- Titre H1 accrocheur, contenant le mot-clé, max 65 caractères, ne PAS commencer par "Parentalité"
- 1200-1600 mots minimum
- Intro de 2-3 phrases qui répond à l'intention de recherche dès les 50 premiers mots (featured snippet)
- 5 à 7 sections en ## avec sous-sections ### si pertinent
- Au moins 2 listes à puces avec conseils pratiques actionnables
- Au moins 1 tableau Markdown comparatif OU une encadré "À retenir"
- Données chiffrées (statistiques, âges, durées) crédibles 2024-2025
- Une section FAQ finale "## Questions fréquentes" avec 3-4 questions/réponses (boost SEO)
- Conclusion encourageante + appel à l'action vers la communauté/app BabyBaby
- Ton bienveillant, tutoiement parental, zéro jargon inutile
- Variations sémantiques du mot-clé tout au long du texte

Appelle la fonction save_article avec le markdown complet + métadonnées.`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "save_article",
            description: "Sauvegarde l'article rédigé et ses métadonnées SEO",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Titre H1, max 65 chars, contient le mot-clé" },
                content: {
                  type: "string",
                  description: "Article complet en Markdown, 1200+ mots, avec H2/H3/listes/FAQ",
                },
                summary: { type: "string", description: "Résumé 2-3 phrases, contient le mot-clé" },
                excerpt: { type: "string", description: "Accroche meta-description, 140-160 caractères" },
                category: {
                  type: "string",
                  enum: ["Préparation", "Nutrition", "Développement", "Sommeil", "Croissance", "Aménagement"],
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  minItems: 4,
                  maxItems: 8,
                  description: "Tags SEO incluant le mot-clé principal et variantes",
                },
                reading_time: { type: "integer", minimum: 5, maximum: 20 },
              },
              required: ["title", "content", "summary", "excerpt", "category", "tags", "reading_time"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "save_article" } },
    });

    let article: any;
    const argsRaw = articleData.choices[0].message.tool_calls?.[0]?.function?.arguments;
    if (!argsRaw) throw new Error("AI did not return article tool call");
    try {
      article = JSON.parse(argsRaw);
    } catch (e) {
      throw new Error(`Failed to parse article JSON: ${e instanceof Error ? e.message : e}`);
    }

    const fullContent: string = article.content;
    const wordCount = fullContent.split(/\s+/).length;
    if (wordCount < 800) {
      console.warn(`Article shorter than expected: ${wordCount} words`);
    }

    const articleId = Date.now();

    // --- Step 3: generate cover image ---
    let imageUrl = "/lovable-uploads/gentle-parenting.jpg";
    try {
      const imagePrompt = `Illustration éditoriale moderne, douce et chaleureuse pour un article sur la parentalité intitulé "${article.title}". ${article.excerpt.slice(0, 150)}. Couleurs pastel, lumière naturelle, style premium magazine, format 16:9, sans texte.`;
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

    // --- Step 4: publish article ---
    const articlePayload = {
      id: articleId,
      title: article.title,
      content: fullContent,
      summary: article.summary,
      excerpt: article.excerpt,
      category: article.category,
      image: imageUrl,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      readingTime: article.reading_time,
      tags: article.tags,
      author: "Assistant IA",
      featured: false,
      views: 0,
      source_trend: trend,
      seo_keyword: keyword,
      word_count: wordCount,
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
        title: article.title,
        keyword,
        word_count: wordCount,
        trend,
        triggered_by: isCron ? "cron" : "admin",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("auto-publish-article error:", msg);
    await notifyFailure(msg, { timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
