/**
 * Correction ciblée des liens internes hérités (`babybaby.app`) dans les
 * articles déjà publiés du bucket Storage « articles ».
 *
 * - Auth : admin (JWT + has_role) OU en-tête x-cron-secret.
 * - Par défaut DRY-RUN ; `{"apply": true}` pour écrire.
 * - Sauvegarde réversible du JSON original dans `articles/_backups/<ts>/`.
 * - Idempotent, aucune suppression de contenu, aucun autre domaine touché
 *   (analyse par URL, pas de remplacement de sous-chaîne).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { rewriteLegacyLinksInText } from "../_shared/internal-links.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const TEXT_FIELDS = ["content", "summary", "excerpt", "title", "image_alt"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

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

    let apply = false;
    try {
      apply = !!(await req.json())?.apply;
    } catch {
      apply = false;
    }

    const { data: files, error: listErr } = await supabase.storage.from("articles").list("articles", {
      limit: 1000,
    });
    if (listErr) throw listErr;

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const report: Array<{ file: string; links: number }> = [];
    let totalLinks = 0;

    for (const f of files ?? []) {
      if (!f.name.endsWith(".json") || f.name === "_index.json") continue;
      const path = `articles/${f.name}`;
      const { data: blob, error: dlErr } = await supabase.storage.from("articles").download(path);
      if (dlErr || !blob) continue;
      const raw = await blob.text();

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(raw);
      } catch {
        continue;
      }

      let changes = 0;
      for (const field of TEXT_FIELDS) {
        if (typeof data[field] === "string") {
          const { text, count } = rewriteLegacyLinksInText(data[field] as string);
          if (count) {
            data[field] = text;
            changes += count;
          }
        }
      }
      const faqs = data.faqs;
      if (Array.isArray(faqs)) {
        for (const faq of faqs as Array<Record<string, unknown>>) {
          for (const k of ["question", "answer"]) {
            if (typeof faq?.[k] === "string") {
              const { text, count } = rewriteLegacyLinksInText(faq[k] as string);
              if (count) {
                faq[k] = text;
                changes += count;
              }
            }
          }
        }
      }

      if (!changes) continue;
      report.push({ file: f.name, links: changes });
      totalLinks += changes;

      if (apply) {
        await supabase.storage.from("articles").upload(
          `_backups/${stamp}/${f.name}`,
          new Blob([raw], { type: "application/json" }),
          { upsert: true },
        );
        const { error: upErr } = await supabase.storage.from("articles").upload(
          path,
          new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
          { upsert: true, cacheControl: "3600" },
        );
        if (upErr) throw upErr;
      }
    }

    return json({
      mode: apply ? "apply" : "dry-run",
      scanned: (files ?? []).length,
      articles_affected: report.length,
      links: totalLinks,
      backup_prefix: apply ? `articles/_backups/${stamp}` : null,
      report,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
