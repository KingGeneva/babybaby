import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CONTEST_SLUG = "panier-naissance-quebec-2026";
const REFERRAL_BONUS = 3;

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const ref = body?.ref ? String(body.ref).trim().toUpperCase().slice(0, 12) : null;

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Courriel invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Already registered?
    const { data: existing } = await supabase
      .from("contest_entries")
      .select("email, referral_code, entries_count")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({
          alreadyRegistered: true,
          referral_code: existing.referral_code,
          entries_count: existing.entries_count,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate referrer
    let validRef: string | null = null;
    if (ref) {
      const { data: refRow } = await supabase
        .from("contest_entries")
        .select("referral_code")
        .eq("referral_code", ref)
        .maybeSingle();
      if (refRow) validRef = refRow.referral_code;
    }

    // Generate unique code
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: taken } = await supabase
        .from("contest_entries")
        .select("id")
        .eq("referral_code", code)
        .maybeSingle();
      if (!taken) break;
      code = generateCode();
    }

    const { data: inserted, error: insertErr } = await supabase
      .from("contest_entries")
      .insert({
        email,
        referral_code: code,
        referred_by: validRef,
        contest_slug: CONTEST_SLUG,
      })
      .select("referral_code, entries_count")
      .single();

    if (insertErr) throw insertErr;

    // Bonus to referrer
    if (validRef) {
      const { data: refRow } = await supabase
        .from("contest_entries")
        .select("entries_count")
        .eq("referral_code", validRef)
        .single();
      if (refRow) {
        await supabase
          .from("contest_entries")
          .update({ entries_count: refRow.entries_count + REFERRAL_BONUS })
          .eq("referral_code", validRef);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        referral_code: inserted.referral_code,
        entries_count: inserted.entries_count,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("contest-enter error", e);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
