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
    
    const { articleId, title, excerpt } = await req.json();

    if (!articleId || !title) {
      throw new Error('Missing required fields: articleId and title');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('Missing Lovable API key');
    }

    // Create a descriptive prompt for the image based on the article
    const imagePrompt = `Crée une illustration moderne et professionnelle pour un article de blog sur la parentalité intitulé "${title}". ${excerpt ? `L'article parle de: ${excerpt.substring(0, 150)}` : ''}. Style: doux, chaleureux, familial, avec des couleurs pastel. Format: 16:9 horizontal. Ultra high resolution.`;

    // Generate image using Lovable AI with retry logic
    let imageData;
    let base64Image;
    
    // Try with flash-image model first
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              { 
                role: 'user', 
                content: imagePrompt
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (!imageResponse.ok) {
          if (attempt === 2) {
            throw new Error(`Failed to generate image after 2 attempts: ${imageResponse.status}`);
          }
          continue;
        }

        imageData = await imageResponse.json();
        base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!base64Image) {
          if (attempt === 2) {
            throw new Error('No image returned from AI after 2 attempts');
          }
          continue;
        }
        
        // Success
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }

    if (!base64Image) {
      throw new Error('Failed to generate image after all attempts');
    }

    // Convert base64 to blob
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Upload to Supabase storage
    const fileName = `article-images/${articleId}-${Date.now()}.png`;
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('articles')
      .upload(fileName, binaryData, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('articles')
      .getPublicUrl(fileName);

    // Update article with image URL
    const { error: updateError } = await supabase
      .from('auto_generated_articles')
      .update({ image_url: publicUrl })
      .eq('id', articleId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: publicUrl,
        message: 'Image générée avec succès'
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
