/**
 * Utilitaires purs du prérendu (testés dans scripts/prerender-utils.test.ts).
 *
 * Isolés du générateur pour être testables sans exécuter de build ni d'appel
 * réseau.
 */
import sanitizeHtmlLib from "sanitize-html";
import { resolve, relative, isAbsolute } from "path";

/* ---------------- Échappement ---------------- */

export function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const escapeAttr = escapeHtml;

/** Échappement XML (sitemap : <loc>, <lastmod>). */
export function escapeXml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ---------------- Assainissement HTML ---------------- */

/**
 * Allowlist restrictive : uniquement du contenu éditorial.
 * Tout le reste (script, style, iframe, object, embed, form, svg, math,
 * gestionnaires d'évènements, URL javascript:/data:) est supprimé par
 * sanitize-html, qui parse réellement le HTML (pas de regex).
 */
const SANITIZE_OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: [
    "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "del", "ins", "mark", "small", "sub", "sup",
    "a", "ul", "ol", "li", "dl", "dt", "dd",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "code", "pre", "span", "div", "section", "article", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    col: ["span"],
    "*": ["id"],
  },
  // Aucun data:, aucun javascript:, aucune URL protocole-relative.
  allowedSchemes: ["https", "http", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https", "http"], a: ["https", "http", "mailto", "tel"] },
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  // Les contenus des balises exécutables sont supprimés, pas seulement leurs balises.
  nonTextTags: ["script", "style", "textarea", "option", "noscript", "template", "iframe", "object", "embed"],
  enforceHtmlBoundary: false,
  transformTags: {
    a: (tagName, attribs) => {
      const out: Record<string, string> = { ...attribs };
      if (out.target === "_blank") out.rel = "noopener noreferrer";
      return { tagName, attribs: out };
    },
  },
};

/** Assainit tout fragment HTML destiné au HTML statique. */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtmlLib(String(html ?? ""), SANITIZE_OPTIONS);
}

/**
 * Valide une URL d'image/lien issue d'une source distante.
 * Renvoie undefined si le schéma n'est pas http(s) ou un chemin absolu du site.
 */
export function safeUrl(value?: string | null): string | undefined {
  if (!value || typeof value !== "string") return undefined;
  const v = value.trim();
  if (v.length === 0) return undefined;
  // Chemin interne du site : un seul slash initial, pas de protocole-relatif.
  if (/^\/(?!\/)/.test(v)) return v;
  try {
    const parsed = new URL(v);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

/* ---------------- Validation identifiants / routes ---------------- */

/** Identifiant d'article : entier strictement positif et sûr. */
export function toArticleId(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : Number(String(value ?? "").trim());
  if (!Number.isSafeInteger(n) || n <= 0) return undefined;
  return n;
}

/**
 * Slug : UN SEUL segment de route. Pas de slash, pas de "..", pas de quote,
 * pas de caractère d'échappement d'URL ou de chemin.
 * Renvoie undefined si le slug n'est pas exploitable (URL /articles/<id>).
 */
export function safeSlug(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  if (v.length === 0 || v.length > 120) return undefined;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) return undefined;
  if (v === "." || v === "..") return undefined;
  return v;
}

/** Même résolution d'URL que src/lib/articleUrl.ts (source de vérité frontend). */
export function articleUrlPath(a: { id: unknown; slug?: unknown }): string | undefined {
  const id = toArticleId(a.id);
  if (id === undefined) return undefined;
  const slug = safeSlug(a.slug);
  return slug ? `/articles/${slug}-${id}` : `/articles/${id}`;
}

/**
 * Résout le dossier de sortie d'une route en garantissant qu'il reste
 * strictement à l'intérieur de dist/. Renvoie undefined sinon.
 */
export function safeRouteDir(distDir: string, routePath: string): string | undefined {
  if (typeof routePath !== "string" || !routePath.startsWith("/")) return undefined;
  if (routePath.includes("\0") || routePath.includes("\\")) return undefined;
  const dist = resolve(distDir);
  if (routePath === "/") return dist;
  const target = resolve(dist, routePath.replace(/^\/+/, ""));
  const rel = relative(dist, target);
  if (rel.length === 0 || rel.startsWith("..") || isAbsolute(rel)) return undefined;
  return target;
}
