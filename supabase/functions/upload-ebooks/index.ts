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
