
// @deno-types="npm:@types/node"
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid messages array." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = {
      role: "system",
      content: `Tu es BabyBot, un assistant parental expert, chaleureux, bienveillant et ultra pédagogique. Tes réponses sont toujours en français, adaptées à des jeunes parents, claires et sourcées s'il le faut. Rappelle-toi d'être synthétique mais précis, de donner des conseils et toujours conclure sur une touche positive ou rassurante. Si la question sort du domaine bébé/parentalité, reformule pour recentrer la discussion.`,
    };

    const openAIRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 360,
      }),
    });

    if (!openAIRes.ok) {
      const errBody = await openAIRes.text();
      return new Response(JSON.stringify({ error: errBody }), { status: 500, headers: corsHeaders });
    }

    const data = await openAIRes.json();
    const aiResponse = data.choices?.[0]?.message?.content ?? "Je suis désolé, je n'ai pas compris. Peux-tu reformuler ?";

    return new Response(JSON.stringify({ content: aiResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
