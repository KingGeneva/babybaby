/**
 * Normalisation des liens internes hérités.
 *
 * Certains articles générés automatiquement contiennent des liens absolus vers
 * l'ancien domaine `babybaby.app` (parfois avec l'ancien préfixe de route
 * `/fr/article/...`). Ce module fournit une normalisation commune, utilisée par :
 *   - le rendu Markdown côté frontend (ArticleContent),
 *   - le prérendu statique (scripts/generate-static-pages.ts),
 *   - le script de correction des articles déjà stockés.
 *
 * Règles :
 *   - seul l'hôte EXACT `babybaby.app` / `www.babybaby.app` est réécrit ;
 *     tout autre domaine (y compris `babybaby.app.example.com` ou
 *     `notbabybaby.app`) est laissé intact ;
 *   - le chemin, la query et le fragment sont préservés ;
 *   - les anciens préfixes de route `/fr/article/<x>` et `/article/<x>` sont
 *     ramenés vers la route réellement servie, `/articles/<x>`.
 */

export const CANONICAL_ORIGIN = "https://babybaby.org";

const LEGACY_HOSTS = new Set(["babybaby.app", "www.babybaby.app"]);
const CANONICAL_HOSTS = new Set(["babybaby.org", "www.babybaby.org"]);

/** Ramène les anciens préfixes de route vers `/articles/...`. */
export function normalizeArticlePath(pathname: string): string {
  let p = pathname;
  p = p.replace(/^\/(?:fr|en|fr-ca)\//i, "/");
  p = p.replace(/^\/article\//, "/articles/");
  return p;
}

function parse(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

/**
 * Réécrit une URL absolue vers l'ancien domaine en URL absolue canonique.
 * Retourne l'entrée inchangée si ce n'est pas un lien interne hérité.
 */
export function rewriteLegacyUrl(raw: string): string {
  const url = parse(raw);
  if (!url) return raw;
  if (!LEGACY_HOSTS.has(url.hostname.toLowerCase())) return raw;
  const path = normalizeArticlePath(url.pathname);
  return `${CANONICAL_ORIGIN}${path}${url.search}${url.hash}`;
}

/**
 * Pour le rendu : retourne un chemin relatif quand le lien pointe vers le site
 * (ancien ou nouveau domaine), sinon l'URL d'origine.
 */
export function toInternalHref(raw: string): string | null {
  if (!raw) return null;
  if (raw.startsWith("/") && !raw.startsWith("//")) return normalizeArticlePath(raw);
  const url = parse(raw);
  if (!url) return null;
  const host = url.hostname.toLowerCase();
  if (!LEGACY_HOSTS.has(host) && !CANONICAL_HOSTS.has(host)) return null;
  return `${normalizeArticlePath(url.pathname)}${url.search}${url.hash}`;
}

/** Jetons d'URL absolus, tels qu'ils apparaissent en Markdown ou en HTML. */
const URL_TOKEN = /https?:\/\/[^\s<>"'()\[\]]+/gi;

/**
 * Réécrit les liens hérités dans un texte Markdown ou HTML.
 * Chaque jeton candidat est analysé comme URL : aucun remplacement de
 * sous-chaîne aveugle, donc les autres domaines ne sont jamais touchés.
 */
export function rewriteLegacyLinksInText(text: string): { text: string; count: number } {
  if (!text) return { text, count: 0 };
  let count = 0;
  const out = text.replace(URL_TOKEN, (token) => {
    // La ponctuation finale ne fait pas partie de l'URL.
    const trailing = token.match(/[.,;:!?]+$/)?.[0] ?? "";
    const core = trailing ? token.slice(0, -trailing.length) : token;
    const rewritten = rewriteLegacyUrl(core);
    if (rewritten !== core) count += 1;
    return rewritten + trailing;
  });
  return { text: out, count };
}
