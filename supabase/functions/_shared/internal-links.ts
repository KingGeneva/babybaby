/**
 * Miroir Deno de `src/lib/internalLinks.ts` (les fonctions edge ne peuvent pas
 * importer depuis `src/`). Garder les deux fichiers synchronisés.
 */

export const CANONICAL_ORIGIN = "https://babybaby.org";

const LEGACY_HOSTS = new Set(["babybaby.app", "www.babybaby.app"]);

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

export function rewriteLegacyUrl(raw: string): string {
  const url = parse(raw);
  if (!url) return raw;
  if (!LEGACY_HOSTS.has(url.hostname.toLowerCase())) return raw;
  return `${CANONICAL_ORIGIN}${normalizeArticlePath(url.pathname)}${url.search}${url.hash}`;
}

const URL_TOKEN = /https?:\/\/[^\s<>"'()\[\]]+/gi;

export function rewriteLegacyLinksInText(text: string): { text: string; count: number } {
  if (!text) return { text, count: 0 };
  let count = 0;
  const out = text.replace(URL_TOKEN, (token) => {
    const trailing = token.match(/[.,;:!?]+$/)?.[0] ?? "";
    const core = trailing ? token.slice(0, -trailing.length) : token;
    const rewritten = rewriteLegacyUrl(core);
    if (rewritten !== core) count += 1;
    return rewritten + trailing;
  });
  return { text: out, count };
}
