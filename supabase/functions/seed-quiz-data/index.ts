
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Configuration pour tous les types de quiz
const quizData = {
  parenting_style: [
    {
      question: "Comment réagissez-vous lorsque votre enfant fait une crise ?",
      options: [
        { id: "a1", text: "Je reste calme et j'essaie de comprendre ce qui le dérange" },
        { id: "a2", text: "Je lui explique fermement pourquoi son comportement est inacceptable" },
        { id: "a3", text: "Je cède pour éviter la crise et maintenir la paix" },
        { id: "a4", text: "J'impose une conséquence immédiate" }
      ]
    },
    {
      question: "Quelle importance accordez-vous aux règles dans votre foyer ?",
      options: [
        { id: "b1", text: "Les règles sont importantes mais flexibles selon le contexte" },
        { id: "b2", text: "Les règles sont essentielles et doivent être respectées" },
        { id: "b3", text: "Je préfère peu de règles pour que mon enfant s'épanouisse librement" },
        { id: "b4", text: "Les règles sont importantes mais négociables avec l'enfant" }
      ]
    },
    {
      question: "Comment gérez-vous l'autonomie de votre enfant ?",
      options: [
        { id: "c1", text: "Je l'encourage à être indépendant tout en le guidant" },
        { id: "c2", text: "Je structure ses activités pour favoriser son développement" },
        { id: "c3", text: "Je le laisse explorer et apprendre par lui-même" },
        { id: "c4", text: "Je suis présent pour l'aider quand il en a besoin" }
      ]
    }
  ],
  child_development: [
    {
      question: "À quel âge la plupart des bébés commencent-ils à marcher ?",
      options: [
        { id: "a1", text: "Entre 8 et 10 mois" },
        { id: "a2", text: "Entre 12 et 15 mois" },
        { id: "a3", text: "Entre 15 et 18 mois" },
        { id: "a4", text: "Après 18 mois" }
      ]
    },
    {
      question: "Quelle est la meilleure façon de stimuler le développement du langage chez un tout-petit ?",
      options: [
        { id: "b1", text: "Lui faire regarder des vidéos éducatives" },
        { id: "b2", text: "Lui parler régulièrement et décrire ce que vous faites" },
        { id: "b3", text: "Utiliser principalement un langage simplifié (baby talk)" },
        { id: "b4", text: "Attendre qu'il commence à parler pour engager la conversation" }
      ]
    },
    {
      question: "Quel signe pourrait indiquer un retard de développement chez un enfant de 2 ans ?",
      options: [
        { id: "c1", text: "Ne dit pas encore de phrases complètes" },
        { id: "c2", text: "Ne connaît pas encore l'alphabet" },
        { id: "c3", text: "Ne marche pas encore avec assurance" },
        { id: "c4", text: "Est timide avec les étrangers" }
      ]
    }
  ],
  parental_burnout: [
    {
      question: "À quelle fréquence vous sentez-vous épuisé(e) par votre rôle de parent ?",
      options: [
        { id: "a1", text: "Rarement ou jamais" },
        { id: "a2", text: "Occasionnellement" },
        { id: "a3", text: "Fréquemment" },
        { id: "a4", text: "Presque tout le temps" }
      ]
    },
    {
      question: "Avez-vous l'impression de ne plus avoir de temps pour vous ?",
      options: [
        { id: "b1", text: "Non, je trouve un bon équilibre" },
        { id: "b2", text: "Parfois, mais ça reste gérable" },
        { id: "b3", text: "Souvent, c'est difficile d'avoir du temps personnel" },
        { id: "b4", text: "Oui, mon temps personnel est inexistant" }
      ]
    },
    {
      question: "Ressentez-vous de la culpabilité lorsque vous prenez du temps pour vous ?",
      options: [
        { id: "c1", text: "Jamais ou rarement" },
        { id: "c2", text: "Parfois" },
        { id: "c3", text: "Souvent" },
        { id: "c4", text: "Presque toujours" }
      ]
    }
  ]
};

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Création du client Supabase avec les variables d'environnement Deno
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("Début de l'insertion des données de quiz");

    // Insérer les questions pour chaque type de quiz
    for (const [quizType, questions] of Object.entries(quizData)) {
      for (const question of questions) {
        const { data, error } = await supabaseClient
          .from('quiz_questions')
          .upsert({
            quiz_type: quizType,
            question: question.question,
            options: question.options
          }, { onConflict: 'quiz_type,question' });
        
        if (error) {
          console.error(`Erreur lors de l'insertion pour ${quizType}:`, error);
        } else {
          console.log(`Question ajoutée pour ${quizType}`);
        }
      }
    }

    console.log("Insertion des données terminée avec succès");

    return new Response(
      JSON.stringify({ success: true, message: "Données de quiz insérées avec succès" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur lors de l'insertion des données:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
