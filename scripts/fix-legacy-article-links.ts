/**
 * Correction ciblée des liens internes hérités (`babybaby.app`) dans les
 * articles déjà publiés (bucket Storage « articles », préfixe `articles/`).
 *
 * Sécurité / réversibilité :
 *   - mode dry-run par défaut (`--apply` pour écrire) ;
 *   - sauvegarde du JSON original dans `articles/_backups/<ts>/<fichier>`
 *     avant toute écriture ;
 *   - idempotent : un second passage ne modifie plus rien ;
 *   - seuls les champs texte sont réécrits, aucune suppression de contenu,
 *     aucun autre domaine touché (analyse par URL, pas par sous-chaîne).
 *
 * Usage :
 *   SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/fix-legacy-article-links.ts [--apply]
 */
import { rewriteLegacyLinksInText } from "../src/lib/internalLinks";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const APPLY = process.argv.includes("--apply");
const BUCKET = "articles";
const PREFIX = "articles/";
const TEXT_FIELDS = ["content", "summary", "excerpt", "title", "image_alt"] as const;

if (!SUPABASE_URL || !KEY) {
  console.error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.");
  process.exit(1);
}

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function listArticles(): Promise<string[]> {
  const names: string[] = [];
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ prefix: PREFIX, limit: 100, offset }),
    });
    if (!res.ok) throw new Error(`list failed: ${res.status}`);
    const page = (await res.json()) as Array<{ name: string }>;
    if (!page.length) break;
    names.push(...page.map((f) => f.name).filter((n) => n.endsWith(".json")));
    if (page.length < 100) break;
  }
  return names;
}

async function download(path: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, { headers });
  if (!res.ok) throw new Error(`download ${path}: ${res.status}`);
  return await res.text();
}

async function upload(path: string, body: string) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...headers, "x-upsert": "true", "Content-Type": "application/json" },
    body,
  });
  if (!res.ok) throw new Error(`upload ${path}: ${res.status} ${await res.text()}`);
}

function fixArticle(raw: string): { out: string; changes: number } {
  const data = JSON.parse(raw);
  let changes = 0;
  for (const field of TEXT_FIELDS) {
    if (typeof data[field] === "string") {
      const { text, count } = rewriteLegacyLinksInText(data[field]);
      if (count) {
        data[field] = text;
        changes += count;
      }
    }
  }
  if (Array.isArray(data.faqs)) {
    for (const faq of data.faqs) {
      for (const k of ["question", "answer"]) {
        if (typeof faq?.[k] === "string") {
          const { text, count } = rewriteLegacyLinksInText(faq[k]);
          if (count) {
            faq[k] = text;
            changes += count;
          }
        }
      }
    }
  }
  return { out: JSON.stringify(data, null, 2), changes };
}

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const files = await listArticles();
  console.log(`[fix-links] ${files.length} articles inspectés — mode ${APPLY ? "APPLY" : "DRY-RUN"}`);
  let touched = 0;
  let total = 0;
  for (const name of files) {
    const path = `${PREFIX}${name}`;
    const raw = await download(path);
    const { out, changes } = fixArticle(raw);
    if (!changes) continue;
    touched += 1;
    total += changes;
    console.log(`  ${name}: ${changes} lien(s) hérité(s)`);
    if (APPLY) {
      await upload(`_backups/${stamp}/${name}`, raw);
      await upload(path, out);
    }
  }
  console.log(
    `[fix-links] ${touched} article(s) concerné(s), ${total} lien(s)${APPLY ? " corrigé(s), sauvegardes dans articles/_backups/" + stamp : " (aucune écriture)"}.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
