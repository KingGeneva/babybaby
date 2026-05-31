// Suggest next parent turn — uses Lovable AI to analyze fairness
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TASK_LABELS: Record<string, string> = {
  night_wake: "Lever de nuit",
  feeding: "Biberon / tétée",
  diaper: "Change de couche",
  bath: "Bain",
  bedtime: "Coucher",
  other: "Autre",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const childId = body?.childId as string;
    const task = (body?.task as string) || "night_wake";
    if (!childId) {
      return new Response(JSON.stringify({ error: "childId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch last 7 days of turns (RLS enforces family scoping)
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const { data: turns, error: turnsErr } = await supabase
      .from("parent_turns")
      .select("parent_id, task, occurred_at, duration_minutes")
      .eq("child_id", childId)
      .gte("occurred_at", since)
      .order("occurred_at", { ascending: false });

    if (turnsErr) throw turnsErr;

    // Fetch family members + their names
    const { data: members } = await supabase
      .from("family_members")
      .select("user_id")
      .eq("child_id", childId);

    const memberIds = (members ?? []).map((m: any) => m.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", memberIds.length ? memberIds : ["00000000-0000-0000-0000-000000000000"]);

    const nameOf = (id: string) => {
      const p = (profiles ?? []).find((x: any) => x.id === id);
      return p?.full_name || p?.email || `Parent ${id.slice(0, 4)}`;
    };

    // Build stats per parent per task
    const stats: Record<string, Record<string, number>> = {};
    for (const id of memberIds) stats[id] = { total: 0, night_wake: 0, feeding: 0, diaper: 0, bath: 0, bedtime: 0, other: 0 };
    let lastDoer: string | null = null;
    let lastTaskTime: string | null = null;
    for (const t of (turns ?? [])) {
      if (!stats[t.parent_id]) stats[t.parent_id] = { total: 0, night_wake: 0, feeding: 0, diaper: 0, bath: 0, bedtime: 0, other: 0 };
      stats[t.parent_id].total += 1;
      stats[t.parent_id][t.task] = (stats[t.parent_id][t.task] || 0) + 1;
      if (t.task === task && !lastDoer) { lastDoer = t.parent_id; lastTaskTime = t.occurred_at; }
    }

    const summaryLines = Object.entries(stats).map(([id, s]) =>
      `- ${nameOf(id)} (id:${id}): total=${s.total}, lever_nuit=${s.night_wake}, biberon=${s.feeding}, change=${s.diaper}, bain=${s.bath}, coucher=${s.bedtime}, autre=${s.other}`
    ).join("\n");

    const taskLabel = TASK_LABELS[task] ?? task;
    const lastInfo = lastDoer
      ? `Dernier "${taskLabel}" : ${nameOf(lastDoer)} à ${new Date(lastTaskTime!).toLocaleString("fr-FR")}.`
      : `Aucun "${taskLabel}" enregistré ces 7 derniers jours.`;

    const prompt = `Tu es un coach familial bienveillant. Décide à qui devrait revenir le prochain tour de "${taskLabel}" pour équilibrer la charge mentale du couple parental.

Historique 7 derniers jours :
${summaryLines || "(aucune donnée)"}

${lastInfo}

IDs disponibles : ${memberIds.join(", ")}

Réponds en JSON STRICT :
{
  "suggested_parent_id": "<uuid>",
  "suggested_parent_name": "<nom>",
  "reason": "<1-2 phrases en français, ton chaleureux, mentionne les chiffres pertinents>",
  "fairness_score": <0-100, 100 = parfaitement équitable>
}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Tu réponds uniquement en JSON valide, sans backticks." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans une minute." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "Crédits IA épuisés. Rechargez votre espace de travail." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const txt = await aiRes.text();
      return new Response(JSON.stringify({ error: "IA indisponible", details: txt }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let suggestion: any = {};
    try { suggestion = JSON.parse(content); } catch { suggestion = { reason: content }; }

    return new Response(JSON.stringify({
      suggestion,
      stats,
      members: memberIds.map((id) => ({ id, name: nameOf(id) })),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("suggest-next-turn error", e);
    return new Response(JSON.stringify({ error: e?.message ?? "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
