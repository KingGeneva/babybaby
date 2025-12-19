import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      console.error('Invalid user token:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin role
    const { data: hasAdminRole, error: roleError } = await supabaseClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Error checking admin role:', roleError.message);
      return new Response(
        JSON.stringify({ error: 'Error verifying permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!hasAdminRole) {
      console.error('User is not an admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin user verified:', user.id);

    // Liste des ebooks à uploader
    const ebooks = [
      {
        id: "eb-001",
        title: "Les 6 premiers mois - Guide complet",
        filename: "Les_6_premiers_mois_-_Guide_complet.pdf",
        path: "/ebooks/Les_6_premiers_mois_-_Guide_complet.pdf"
      },
      {
        id: "eb-002",
        title: "Le sommeil du bébé",
        filename: "Le_sommeil_du_bébé.pdf",
        path: "/ebooks/Le_sommeil_du_bébé.pdf"
      },
      {
        id: "eb-003",
        title: "Coliques du bébé",
        filename: "Coliques_du_bébé.pdf",
        path: "/ebooks/Coliques_du_bébé.pdf"
      },
      {
        id: "eb-004",
        title: "Les Étapes Clés du Développement de Bébé",
        filename: "Les_Etapes_Cles_du_Developpement_de_Bebe.pdf",
        path: "/ebooks/Les_Etapes_Cles_du_Developpement_de_Bebe.pdf"
      }
    ];

    const results = [];

    for (const ebook of ebooks) {
      // Télécharger le fichier depuis public
      const fileResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}${ebook.path}`);
      
      if (!fileResponse.ok) {
        console.error(`File not found: ${ebook.filename}`);
        results.push({
          id: ebook.id,
          success: false,
          error: `Fichier non trouvé: ${ebook.filename}`
        });
        continue;
      }

      const fileBlob = await fileResponse.blob();
      const fileBuffer = await fileBlob.arrayBuffer();

      // Uploader dans le bucket storage
      const { data, error } = await supabaseClient
        .storage
        .from('ebooks')
        .upload(ebook.filename, fileBuffer, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) {
        console.error(`Upload error for ${ebook.filename}:`, error.message);
      } else {
        console.log(`Successfully uploaded: ${ebook.filename}`);
      }

      results.push({
        id: ebook.id,
        filename: ebook.filename,
        success: !error,
        error: error?.message,
        path: data?.path
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        results 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
