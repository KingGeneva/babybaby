/**
 * Déclenchement d'une reconstruction + mise en ligne du site après une
 * publication automatique d'article.
 *
 * IMPORTANT — état réel :
 * Le site est hébergé par Lovable et sa mise en ligne se fait aujourd'hui via
 * le bouton « Publier ». Il n'existe pas d'API publique/officielle permettant
 * de la déclencher depuis le backend. Cette fonction implémente donc toute la
 * mécanique (auth, déduplication, timeout, retry borné, journalisation) et
 * appelle un webhook de déploiement fourni par le propriétaire via le secret
 * `SITE_REBUILD_WEBHOOK_URL` (en-tête d'auth optionnel :
 * `SITE_REBUILD_WEBHOOK_TOKEN`, envoyé en `Authorization: Bearer ...`).
 * Tant que ce secret n'existe pas, la fonction répond `configured: false`,
 * journalise `not_configured` et ne prétend AUCUN succès.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const DEDUPE_WINDOW_MS = 10 * 60 * 1000; // une reconstruction / 10 min max
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 3;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    // --- Auth serveur : secret cron OU administrateur authentifié ---
    const cronSecret = Deno.env.get("CRON_SECRET");
    const isCron = !!cronSecret && req.headers.get("x-cron-secret") === cronSecret;
    if (!isCron) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return json({ error: "Non authentifié" }, 401);
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
      if (!user) return json({ error: "Non authentifié" }, 401);
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) return json({ error: "Accès refusé - Admin uniquement" }, 403);
    }

    let payload: { reason?: string; articleId?: number; dryRun?: boolean } = {};
    try {
      payload = (await req.json()) ?? {};
    } catch { /* corps facultatif */ }

    const reason = payload.reason ?? "article_published";
    const dryRun = payload.dryRun === true;

    // --- Déduplication : une demande aboutie ou en cours récente suffit ---
    const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
    const { data: recent } = await supabase
      .from("rebuild_requests")
      .select("id, status, created_at")
      .gte("created_at", since)
      .in("status", ["pending", "success"])
      .order("created_at", { ascending: false })
      .limit(1);

    if (recent && recent.length > 0) {
      return json({
        triggered: false,
        deduplicated: true,
        reason: `Une demande (${recent[0].status}) date de moins de 10 minutes`,
        request_id: recent[0].id,
      });
    }

    const webhookUrl = Deno.env.get("SITE_REBUILD_WEBHOOK_URL");
    const webhookToken = Deno.env.get("SITE_REBUILD_WEBHOOK_TOKEN");

    const { data: inserted } = await supabase
      .from("rebuild_requests")
      .insert({
        reason,
        source: isCron ? "cron" : "admin",
        article_id: payload.articleId ?? null,
        status: webhookUrl ? "pending" : "not_configured",
      })
      .select("id")
      .single();
    const requestId = inserted?.id ?? null;

    if (!webhookUrl) {
      await supabase.from("rebuild_requests")
        .update({ error: "SITE_REBUILD_WEBHOOK_URL manquant", completed_at: new Date().toISOString() })
        .eq("id", requestId);
      console.warn("Rebuild non déclenché : SITE_REBUILD_WEBHOOK_URL absent");
      return json({
        triggered: false,
        configured: false,
        missing_secret: "SITE_REBUILD_WEBHOOK_URL",
        request_id: requestId,
        message: "Mécanisme installé mais inactif : aucun webhook de déploiement configuré.",
      });
    }

    if (dryRun) {
      await supabase.from("rebuild_requests")
        .update({ status: "dry_run", completed_at: new Date().toISOString() })
        .eq("id", requestId);
      return json({ triggered: false, configured: true, dry_run: true, request_id: requestId });
    }

    // --- Appel du webhook : timeout + retry borné ---
    let attempts = 0;
    let httpStatus: number | null = null;
    let lastError: string | null = null;

    while (attempts < MAX_ATTEMPTS) {
      attempts += 1;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
          },
          body: JSON.stringify({ reason, articleId: payload.articleId ?? null, requestedAt: new Date().toISOString() }),
        });
        httpStatus = res.status;
        if (res.ok) {
          lastError = null;
          break;
        }
        lastError = `HTTP ${res.status}`;
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
      } finally {
        clearTimeout(timer);
      }
      if (attempts < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 1000 * attempts));
    }

    const ok = !lastError;
    await supabase.from("rebuild_requests").update({
      status: ok ? "success" : "failed",
      attempts,
      http_status: httpStatus,
      error: lastError,
      completed_at: new Date().toISOString(),
    }).eq("id", requestId);

    console.log(`Rebuild trigger ${ok ? "success" : "failed"} (attempts=${attempts}, http=${httpStatus})`);

    return json({
      triggered: ok,
      configured: true,
      attempts,
      http_status: httpStatus,
      error: lastError,
      request_id: requestId,
    }, ok ? 200 : 502);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("trigger-site-rebuild error:", msg);
    return json({ triggered: false, error: msg }, 500);
  }
});
