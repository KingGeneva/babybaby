import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Non authentifié');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Non authentifié');
    }

    // Vérifier le rôle admin
    const { data: hasAdminRole } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!hasAdminRole) {
      throw new Error('Accès refusé - Admin uniquement');
    }

    const { method, action, articleId, articleData } = await req.json();

    switch (action) {
      case 'list': {
        // Lister tous les fichiers d'articles
        const { data: files, error } = await supabase.storage
          .from('articles')
          .list('articles');

        if (error) throw error;

        const articles = [];
        for (const file of files || []) {
          if (file.name.endsWith('.json')) {
            const { data } = await supabase.storage
              .from('articles')
              .download(`articles/${file.name}`);
            
            if (data) {
              const text = await data.text();
              articles.push(JSON.parse(text));
            }
          }
        }

        return new Response(JSON.stringify({ articles }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        // Créer un nouvel article
        if (!articleData) throw new Error('Données d\'article manquantes');

        const article = {
          id: Date.now(),
          ...articleData,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase.storage
          .from('articles')
          .upload(
            `articles/${article.id}.json`,
            new Blob([JSON.stringify(article)], { type: 'application/json' }),
            { upsert: true }
          );

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, article }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        // Mettre à jour un article existant
        if (!articleId || !articleData) {
          throw new Error('ID et données d\'article requis');
        }

        const { error } = await supabase.storage
          .from('articles')
          .upload(
            `articles/${articleId}.json`,
            new Blob([JSON.stringify(articleData)], { type: 'application/json' }),
            { upsert: true }
          );

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        // Supprimer un article
        if (!articleId) throw new Error('ID d\'article requis');

        const { error } = await supabase.storage
          .from('articles')
          .remove([`articles/${articleId}.json`]);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Action non reconnue');
    }
  } catch (error: any) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
