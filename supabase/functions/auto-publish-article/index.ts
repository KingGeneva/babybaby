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

function sanitizeEditorialYears(text: unknown, currentYear: number) {
  if (typeof text !== "string") return text;
  return text.replace(/\b(2024|2025)\b/g, String(currentYear));
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
    const currentYear = new Date().getFullYear();

    const trendData = await callAI(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-flash-lite",
      messages: [
        {
          role: "system",
          content:
            "Tu es expert SEO et parentalité québécoise. Tu identifies des tendances précises ET le mot-clé long-tail à fort potentiel de recherche associé pour le marché du Québec.",
        },
        {
          role: "user",
          content: `Sur le thème "${topic}", identifie UNE tendance précise ${currentYear} ET le mot-clé long-tail québécois le plus recherché (3-6 mots, intention informationnelle parentale, marché Québec/Canada francophone).
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

    // --- Step 1.5: load (or bootstrap) the article catalog index for internal linking ---
    type CatalogEntry = { id: number; title: string; category: string; path: string; keyword?: string };
    let catalog: CatalogEntry[] = [];
    try {
      const { data: idxBlob, error: idxErr } = await supabase.storage
        .from("articles")
        .download("articles/_index.json");
      if (!idxErr && idxBlob) {
        const txt = await idxBlob.text();
        const parsed = JSON.parse(txt);
        if (Array.isArray(parsed)) catalog = parsed;
      }
    } catch (_) { /* ignore, will bootstrap */ }

    if (catalog.length === 0) {
      try {
        const { data: files } = await supabase.storage.from("articles").list("articles", {
          limit: 200,
          sortBy: { column: "name", order: "desc" },
        });
        if (files && files.length) {
          const jsonFiles = files.filter((f) => f.name.endsWith(".json") && f.name !== "_index.json").slice(0, 100);
          const entries: CatalogEntry[] = [];
          for (const f of jsonFiles) {
            try {
              const { data: blob } = await supabase.storage.from("articles").download(`articles/${f.name}`);
              if (!blob) continue;
              const a = JSON.parse(await blob.text());
              if (!a?.id || !a?.title) continue;
              entries.push({
                id: a.id,
                title: a.title,
                category: a.category || "",
                path: a.slug ? `/articles/${a.slug}-${a.id}` : `/articles/${a.id}`,
                keyword: a.seo_keyword,
              });
            } catch (_) { /* skip */ }
          }
          catalog = entries;
          try {
            const idxBlob2 = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
            await supabase.storage.from("articles").upload("articles/_index.json", idxBlob2, {
              upsert: true, cacheControl: "3600",
            });
          } catch (_) { /* non-fatal */ }
        }
      } catch (e) {
        console.warn("Catalog bootstrap failed:", e instanceof Error ? e.message : e);
      }
    }

    const catalogText = catalog
      .slice(0, 40)
      .map((e) => `- "${e.title}" (${e.category}) → ${e.path}`)
      .join("\n");

    // --- Step 2: generate MAXIMUM-DEPTH article + metadata in ONE call (tool calling) ---
    const articleData = await callAI(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-pro",
      max_tokens: 16000,
      messages: [
        {
          role: "system",
          content:
            `Tu es rédacteur en chef SEO senior, spécialiste de la parentalité québécoise. Tu produis des articles piliers (cornerstone content) de niveau magazine premium : 2500-3500 mots, exhaustifs, sourcés, structurés pour dominer la SERP au Québec/Canada francophone et obtenir des featured snippets, People Also Ask, et Google Discover. Tu maîtrises l'EEAT (expérience, expertise, autorité, fiabilité), tu cites EXCLUSIVEMENT des institutions québécoises et canadiennes reconnues (OMS, UNICEF, Santé Canada, INSPQ, INESSS, Société canadienne de pédiatrie, Naître et grandir, MSSS Québec, Diététistes du Canada, études PubMed récentes 2024-${currentYear}). N'utilise JAMAIS de sources françaises (HAS, ANSES, Santé publique France, Société française de pédiatrie, PMI, CAMSP, SAMU, etc.). Réfère aux ressources locales : CLSC, Info-Santé 811, RAMQ, SAAQ, Croix-Rouge canadienne. Tu intègres des données chiffrées vérifiables. Style : français québécois standard, bienveillant, tutoiement parental, phrases courtes, zéro fluff. Année éditoriale obligatoire : ${currentYear}. N'utilise jamais 2024 ou 2025 dans le titre, le H1, le slug, le résumé, la meta description ou l'alt image ; ces années ne sont acceptées que dans les sources et références.`,
        },
        {
          role: "user",
          content: `Rédige un ARTICLE PILIER SEO ultra-complet, calibré pour ranker top 3 Google.

SUJET: "${trend}"
MOT-CLÉ PRINCIPAL: "${keyword}"

EXIGENCES MAXIMALES:

# Structure obligatoire
1. **Titre H1** : accrocheur, contient le mot-clé, max 65 caractères, ne commence PAS par "Parentalité"
2. **Intro (80-120 mots)** : réponse directe à l'intention de recherche dans les 50 premiers mots (featured snippet), promesse claire, hook émotionnel
3. **Encadré "En bref / À retenir"** en blockquote Markdown (>) avec 4-5 points clés synthétiques
4. **8 à 12 sections ##** structurées en pyramide inversée, avec sous-sections ### si pertinent
5. **Au moins 1 tableau Markdown comparatif** (ex : par âge, par méthode, avantages/inconvénients)
6. **Au moins 3 listes à puces** avec conseils actionnables et numérotés quand c'est une procédure
7. **Au moins 1 section "Erreurs fréquentes à éviter"** avec contre-exemples
8. **Au moins 1 section "Cas concrets" ou "Témoignages" reformulés** (sans inventer de citations réelles)
9. **Section "## Sources et références"** finale avec 4-6 sources crédibles québécoises/canadiennes (INSPQ, Société canadienne de pédiatrie, Naître et grandir, études PubMed) — format : "- *Titre*, Institution, année"
10. **Conclusion (100-150 mots)** : récap, encouragement, CTA vers l'app BabyBaby (suivi de croissance, communauté, conseils experts)

IMPORTANT — la FAQ n'apparaît PAS dans le markdown \`content\`. Elle passe UNIQUEMENT par le champ structuré \`faqs\` de l'appel d'outil (6-8 paires question/réponse, 40-60 mots par réponse). Le frontend l'affiche en accordéon et génère le JSON-LD FAQPage automatiquement.

# Contraintes SEO
- Année éditoriale obligatoire : ${currentYear}. Le titre H1, le slug, le résumé, la meta description et l'alt image doivent utiliser ${currentYear} si une année est mentionnée. Interdiction d'y mettre 2024 ou 2025.
- 2500-3500 mots minimum
- Mot-clé principal dans : H1, premiers 100 mots, ≥2 H2, conclusion, meta description
- Variations sémantiques et synonymes répartis (LSI keywords)
- Densité naturelle, jamais forcée
- Phrases ≤ 20 mots en moyenne, paragraphes ≤ 4 lignes
- Données chiffrées concrètes (âges en mois, pourcentages, durées, recommandations officielles) datées 2024-${currentYear}
- MAILLAGE INTERNE OBLIGATOIRE : insère 4 à 6 liens internes vers des articles EXISTANTS de la liste ci-dessous, en syntaxe Markdown \`[ancre descriptive riche en mots-clés](PATH)\` en utilisant EXACTEMENT le PATH fourni. N'invente JAMAIS d'URL ni de slug. Choisis les articles les plus pertinents thématiquement. Ancres descriptives (jamais "cliquez ici"). Répartis les liens dans le corps du texte, pas en bloc.
${catalogText ? `ARTICLES DISPONIBLES POUR LE MAILLAGE :\n${catalogText}` : "(Aucun article disponible dans le catalogue — n'invente AUCUN lien interne.)"}

# Ton
- Tutoiement parental chaleureux
- Empathie + autorité experte
- Zéro condescendance, zéro injonction culpabilisante
- Inclusif (parent 1 / parent 2, familles diverses)

Appelle la fonction save_article avec le markdown complet, le slug SEO (kebab-case, 3-7 mots, contient le mot-clé), un image_alt descriptif (80-120 chars, contient le mot-clé), la liste structurée \`faqs\` (6-8 paires), un \`howTo\` si l'article est un guide étape-par-étape, et toutes les métadonnées.`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "save_article",
            description: "Sauvegarde l'article pilier rédigé et ses métadonnées SEO",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Titre H1, max 65 chars, contient le mot-clé" },
                content: {
                  type: "string",
                  description: "Article complet en Markdown, 2500-3500 mots, avec encadré, tableau, listes, FAQ, sources",
                },
                summary: { type: "string", description: "Résumé 2-3 phrases, contient le mot-clé" },
                excerpt: {
                  type: "string",
                  description: "Meta description SEO, 140-160 caractères, contient le mot-clé et une promesse",
                },
                category: {
                  type: "string",
                  enum: ["Préparation", "Nutrition", "Développement", "Sommeil", "Croissance", "Aménagement"],
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  minItems: 5,
                  maxItems: 10,
                  description: "Tags SEO incluant le mot-clé principal, variantes et entités liées",
                },
                reading_time: { type: "integer", minimum: 8, maximum: 25 },
                slug: {
                  type: "string",
                  description: "URL slug SEO en kebab-case, 3-7 mots, contient le mot-clé principal, sans accents ni stop-words inutiles (ex: 'portage-physiologique-nouveau-ne')",
                  pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                },
                image_alt: {
                  type: "string",
                  description: "Texte alternatif descriptif de l'image de couverture, 80-120 caractères, contient le mot-clé principal naturellement, décrit la scène pour Google Images et l'accessibilité",
                },
                faqs: {
                  type: "array",
                  minItems: 6,
                  maxItems: 8,
                  description: "6 à 8 paires question/réponse formulées comme de vraies requêtes Google. Réponses concises 40-60 mots. Affiché en accordéon + JSON-LD FAQPage.",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      answer: { type: "string" },
                    },
                    required: ["question", "answer"],
                    additionalProperties: false,
                  },
                },
                howTo: {
                  type: "object",
                  description: "OPTIONNEL — uniquement si l'article est un guide étape-par-étape. Génère un schema HowTo.",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    totalTime: { type: "string", description: "Durée totale ISO 8601, ex 'PT15M'" },
                    steps: {
                      type: "array",
                      minItems: 2,
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          text: { type: "string" },
                        },
                        required: ["name", "text"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["name", "description", "steps"],
                  additionalProperties: false,
                },
              },
              required: ["title", "content", "summary", "excerpt", "category", "tags", "reading_time", "slug", "image_alt", "faqs"],
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

    article.title = sanitizeEditorialYears(article.title, currentYear);
    article.summary = sanitizeEditorialYears(article.summary, currentYear);
    article.excerpt = sanitizeEditorialYears(article.excerpt, currentYear);
    article.slug = sanitizeEditorialYears(article.slug, currentYear);
    article.image_alt = sanitizeEditorialYears(article.image_alt, currentYear);
    let fullContent: string = article.content;
    fullContent = fullContent.replace(/^#\s+.*$/m, `# ${article.title}`);
    // Strip residual fake-link placeholders like *[voir notre guide]* (italic brackets NOT followed by a link parenthesis).
    fullContent = fullContent.replace(/\*\[([^\]]+)\]\*(?!\()/g, "$1");
    const wordCount = fullContent.split(/\s+/).length;
    if (wordCount < 2000) {
      console.warn(`Article shorter than target pillar length: ${wordCount} words`);
    }

    const articleId = Date.now();

    // --- Step 3: generate cover image ---
    let imageUrl = "/lovable-uploads/gentle-parenting.jpg";
    try {
      const imagePrompt = `Illustration éditoriale moderne, douce et chaleureuse pour un article sur la parentalité intitulé "${article.title}". ${article.image_alt || article.excerpt.slice(0, 150)}. Couleurs pastel, lumière naturelle, style premium magazine, format 16:9, sans texte ni mots.`;
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
    // Defensive slug sanitization in case the model returns something off-spec.
    const safeSlug = (article.slug || article.title)
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 80);

    const nowIso = new Date().toISOString();
    const articlePayload = {
      id: articleId,
      title: article.title,
      content: fullContent,
      summary: article.summary,
      excerpt: article.excerpt,
      category: article.category,
      image: imageUrl,
      image_alt: article.image_alt,
      slug: safeSlug,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      dateModified: nowIso,
      readingTime: article.reading_time,
      tags: article.tags,
      author: "Assistant IA",
      featured: false,
      views: 0,
      source_trend: trend,
      seo_keyword: keyword,
      word_count: wordCount,
      faqs: article.faqs,
      howTo: article.howTo,
      created_at: nowIso,
    };

    const blob = new Blob([JSON.stringify(articlePayload, null, 2)], { type: "application/json" });
    const { error: jsonErr } = await supabase.storage
      .from("articles")
      .upload(`articles/${articleId}.json`, blob, { upsert: true, cacheControl: "3600" });
    if (jsonErr) throw jsonErr;

    // --- Step 4.5: update article catalog index (non-fatal) ---
    try {
      const newEntry: CatalogEntry = {
        id: articleId,
        title: article.title,
        category: article.category,
        path: `/articles/${safeSlug}-${articleId}`,
        keyword,
      };
      const updated = [newEntry, ...catalog.filter((e) => e.id !== articleId)];
      const idxOut = new Blob([JSON.stringify(updated, null, 2)], { type: "application/json" });
      await supabase.storage.from("articles").upload("articles/_index.json", idxOut, {
        upsert: true, cacheControl: "3600",
      });
    } catch (e) {
      console.warn("Catalog index update failed (ignored):", e instanceof Error ? e.message : e);
    }


    // --- Step 5: IndexNow ping (fire-and-forget, never throws) ---
    try {
      const articleUrl = `https://babybaby.org/articles/${safeSlug}-${articleId}`;
      const inRes = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: "babybaby.org",
          key: "8f2a9c4e7b1d6038f5a2c9e84b7d1602",
          keyLocation: "https://babybaby.org/8f2a9c4e7b1d6038f5a2c9e84b7d1602.txt",
          urlList: [articleUrl],
        }),
      });
      console.log("IndexNow ping status:", inRes.status);
    } catch (e) {
      console.warn("IndexNow ping failed (ignored):", e instanceof Error ? e.message : e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        articleId,
        title: article.title,
        slug: safeSlug,
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
