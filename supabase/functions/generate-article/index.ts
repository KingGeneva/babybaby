import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user has admin role
    const { data: hasRole } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!hasRole) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('Missing Lovable API key');
    }

    // Step 1: Identify current trends related to parenting using AI with variety
    const randomSeed = Date.now();
    const topics = [
      'nouvelles méthodes d\'éducation positive',
      'alimentation bio et diversification alimentaire',
      'impact des écrans sur le développement cognitif',
      'routines de sommeil et chronobiologie infantile',
      'aménagement Montessori et espaces d\'éveil',
      'communication bienveillante et gestion des émotions',
      'activités sensorielles et motricité libre',
      'parentalité écologique et produits naturels',
      'développement du langage et bilinguisme',
      'prévention santé et vaccinations récentes',
      'jeux éducatifs et apprentissage précoce',
      'équilibre vie professionnelle et parentale',
      'allaitement et nutrition maternelle',
      'développement social et socialisation',
      'gestion du stress parental et burn-out'
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    const trendResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `Tu es un expert en parentalité et développement de l'enfant. Ta mission est d'identifier une tendance actuelle importante et UNIQUE dans le domaine spécifié. Évite les sujets génériques comme "parentalité positive" seule. Sois spécifique et innovant.` 
          },
          { 
            role: 'user', 
            content: `Identifie UNE tendance SPÉCIFIQUE, ACTUELLE et INNOVANTE concernant: "${randomTopic}". 

IMPORTANT: 
- La tendance doit être précise et concrète (pas juste "parentalité positive" mais par exemple "méthode de time-in vs time-out dans l'éducation positive")
- Elle doit être récente (2024-2025)
- Elle doit apporter une information ou approche nouvelle
- Évite les généralités

Réponds en une seule phrase claire décrivant cette tendance UNIQUE. ID: ${randomSeed}` 
          }
        ],
      }),
    });

    if (!trendResponse.ok) {
      const errorText = await trendResponse.text();
      console.error('Trend identification failed:', trendResponse.status, errorText);
      throw new Error(`Failed to identify trend: ${trendResponse.status}`);
    }

    const trendData = await trendResponse.json();
    const trend = trendData.choices[0].message.content.trim();

    // Step 2: Generate a comprehensive article based on the trend
    const articleResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `Tu es un expert rédacteur spécialisé en parentalité et développement de l'enfant. Tu rédiges des articles informatifs, bien structurés et utiles pour les parents. Tes articles doivent être en français, bien formatés en Markdown, et contenir des conseils pratiques.` 
          },
          { 
            role: 'user', 
            content: `Rédige un article complet et détaillé sur cette tendance: "${trend}"

L'article doit:
- Avoir un titre accrocheur et informatif QUI NE COMMENCE PAS PAR "Parentalité" (sois créatif et spécifique!)
- Contenir au moins 800 mots
- Être structuré avec des titres et sous-titres (utiliser ## et ###)
- Inclure des listes à puces pour les conseils pratiques
- Avoir un ton bienveillant et accessible
- Contenir des informations basées sur des faits
- Se terminer par une conclusion encourageante

IMPORTANT: Le titre doit être unique et directement lié au sujet spécifique, pas un titre générique.

Réponds UNIQUEMENT avec le contenu de l'article en Markdown, sans aucun texte d'introduction ou de conclusion de ta part.` 
          }
        ],
      }),
    });

    if (!articleResponse.ok) {
      const errorText = await articleResponse.text();
      console.error('Article generation failed:', articleResponse.status, errorText);
      throw new Error(`Failed to generate article: ${articleResponse.status}`);
    }

    const articleData = await articleResponse.json();
    const fullContent = articleData.choices[0].message.content.trim();

    // Step 3: Extract metadata from the article using AI
    const metadataResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `Tu es un assistant qui extrait des métadonnées d'articles. Tu dois répondre UNIQUEMENT en JSON valide, sans aucun texte supplémentaire.` 
          },
          { 
            role: 'user', 
            content: `Analyse cet article et fournis les métadonnées au format JSON strict suivant:

{
  "title": "titre de l'article (max 100 caractères)",
  "summary": "résumé en 2-3 phrases (max 300 caractères)",
  "excerpt": "premier paragraphe ou introduction (max 200 caractères)",
  "category": "une seule catégorie parmi: Préparation, Nutrition, Développement, Sommeil, Croissance, Aménagement",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "reading_time": temps de lecture estimé en minutes (nombre entier)
}

Article:
${fullContent}

Réponds UNIQUEMENT avec le JSON, sans aucun autre texte.` 
          }
        ],
      }),
    });

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error('Metadata extraction failed:', metadataResponse.status, errorText);
      throw new Error(`Failed to extract metadata: ${metadataResponse.status}`);
    }

    const metadataData = await metadataResponse.json();
    let metadata;
    
    try {
      const metadataText = metadataData.choices[0].message.content.trim();
      // Remove markdown code blocks if present
      const cleanedText = metadataText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      metadata = JSON.parse(cleanedText);
    } catch (parseError) {
      // Fallback metadata
      metadata = {
        title: trend.substring(0, 100),
        summary: `Article sur ${trend}`,
        excerpt: fullContent.substring(0, 200),
        category: 'Développement',
        tags: ['parentalité', 'conseil', 'enfant'],
        reading_time: Math.ceil(fullContent.split(' ').length / 200)
      };
    }

    // Step 4: Save to database
    const { data: article, error: dbError } = await supabase
      .from('auto_generated_articles')
      .insert({
        title: metadata.title,
        content: fullContent,
        summary: metadata.summary,
        excerpt: metadata.excerpt,
        category: metadata.category,
        tags: metadata.tags,
        reading_time: metadata.reading_time,
        source_trend: trend,
        status: 'pending',
        author: 'Assistant IA',
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        article: article,
        message: 'Article généré avec succès et en attente de validation'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

    } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
