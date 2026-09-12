/**
 * Post-build static page generator (prerender léger).
 *
 * Pour chaque route publique, on part de dist/index.html (le shell SPA) et on
 * écrit un fichier HTML avec :
 *   - <title>, meta description, canonical, OG/Twitter par route
 *   - un contenu HTML initial RÉELLEMENT VISIBLE et accessible dans
 *     <div id="root">, cohérent avec ce que React rend ensuite.
 *
 * Ce contenu n'est PAS réservé aux robots : c'est le premier rendu que voit
 * aussi un visiteur humain avant l'hydratation. React (createRoot().render()
 * dans src/main.tsx) remplace les enfants de #root une fois chargé.
 *
 * Sources d'articles (les mêmes que le frontend, cf. src/hooks/useArticles.ts
 * et src/hooks/useArticle.ts) :
 *   1. articles locaux (src/data/articles/*)
 *   2. articles publiés dans le bucket Storage public « articles »
 *      (fichiers articles/<id>.json)
 * La table cms_articles n'est PAS prérendue : aucun écran public du frontend
 * ne la lit aujourd'hui (seule la fonction regenerate-article-images y touche).
 *
 * ACTUALISATION APRÈS PUBLICATION AUTOMATIQUE — limite assumée :
 * ce script s'exécute uniquement au `npm run build` (hook postbuild). Un
 * article publié par la fonction edge auto-publish-article n'apparaît donc
 * dans le HTML statique qu'au prochain build/déploiement. Le ping IndexNow
 * ne reconstruit rien : il ne fait que signaler l'URL aux moteurs, qui
 * verront alors le rendu JavaScript. Pour un rafraîchissement automatique il
 * faudrait un déclencheur de build côté hébergement (deploy hook), qui
 * n'existe pas dans ce projet ; aucune intégration n'est simulée ici.
 *
 * Aucune clé privilégiée n'est utilisée : la lecture Storage se fait avec la
 * clé publishable (anon), déjà présente dans le bundle client, et rien n'est
 * écrit dans dist/ à part du HTML public.
 *
 * Run via `postbuild` npm script.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { marked } from "marked";
import {
  escapeHtml,
  escapeAttr,
  escapeXml,
  sanitizeArticleHtml,
  safeUrl,
  toArticleId,
  articleUrlPath,
  safeRouteDir,
} from "./prerender-utils";

import { nutritionArticles } from "../src/data/articles/nutrition";
import { amenagementArticles } from "../src/data/articles/amenagement";
import { sommeilArticles } from "../src/data/articles/sommeil";
import { developpementArticles } from "../src/data/articles/developpement";
import { preparationArticles } from "../src/data/articles/preparation";
import { croissanceArticles } from "../src/data/articles/croissance";
import { ebooksData } from "../src/components/ebooks/ebooksData";
import type { Article } from "../src/types/article";

const BASE_URL = "https://babybaby.org";
const DIST = resolve(process.cwd(), "dist");
const TEMPLATE_PATH = resolve(DIST, "index.html");
const REMOTE_TIMEOUT_MS = 10_000;
const REMOTE_PAGE_SIZE = 100;

if (!existsSync(TEMPLATE_PATH)) {
  console.error(`[prerender] dist/index.html not found — run vite build first.`);
  process.exit(0);
}

const TEMPLATE = readFileSync(TEMPLATE_PATH, "utf-8");

marked.setOptions({ gfm: true, breaks: false });

/* ---------------- Utils ---------------- */

function truncate(s: string, n: number): string {
  const v = String(s ?? "");
  if (v.length <= n) return v;
  return v.slice(0, n - 1).trimEnd() + "…";
}

const FRENCH_MONTHS: Record<string, number> = {
  janvier: 0, fevrier: 1, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, août: 7, septembre: 8, octobre: 9, novembre: 10,
  decembre: 11, décembre: 11,
};

/** Date ISO réelle (jamais "maintenant") — renvoie undefined si non parsable. */
function toIsoDate(value?: string | null): string | undefined {
  if (!value || typeof value !== "string") return undefined;
  const direct = Date.parse(value);
  if (!Number.isNaN(direct)) return new Date(direct).toISOString();
  const m = value.trim().toLowerCase().match(/^(\d{1,2})\s+([a-zéèûà]+)\s+(\d{4})$/i);
  if (!m) return undefined;
  const month = FRENCH_MONTHS[m[2]];
  if (month === undefined) return undefined;
  return new Date(Date.UTC(Number(m[3]), month, Number(m[1]), 12)).toISOString();
}

/* ---------------- Sources d'articles ---------------- */

const localArticles: Article[] = [
  ...nutritionArticles,
  ...amenagementArticles,
  ...sommeilArticles,
  ...developpementArticles,
  ...preparationArticles,
  ...croissanceArticles,
];

function readEnvFromDotEnv(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return undefined;
  const line = readFileSync(envPath, "utf-8")
    .split("\n")
    .find((l) => l.trim().startsWith(`${key}=`));
  return line ? line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "") : undefined;
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Récupère les articles publiés dans le bucket Storage public « articles ».
 * En cas d'échec (réseau, timeout, config absente) : log explicite et build
 * poursuivi avec les seuls articles locaux — jamais d'échec silencieux.
 */
async function fetchStorageArticles(): Promise<Article[]> {
  const supabaseUrl = readEnvFromDotEnv("VITE_SUPABASE_URL");
  // Clé publishable (anon) uniquement — jamais de service role dans un build.
  const anonKey = readEnvFromDotEnv("VITE_SUPABASE_PUBLISHABLE_KEY");

  if (!supabaseUrl || !anonKey) {
    console.warn(
      "[prerender] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY absents — articles distants NON prérendus (articles locaux seulement).",
    );
    return [];
  }

  const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}`, "Content-Type": "application/json" };
  const names: string[] = [];

  try {
    for (let offset = 0; ; offset += REMOTE_PAGE_SIZE) {
      const res = await fetchWithTimeout(`${supabaseUrl}/storage/v1/object/list/articles`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          prefix: "articles/",
          limit: REMOTE_PAGE_SIZE,
          offset,
          sortBy: { column: "name", order: "asc" },
        }),
      });
      if (!res.ok) throw new Error(`list HTTP ${res.status}`);
      const page = (await res.json()) as { name: string }[];
      if (!Array.isArray(page) || page.length === 0) break;
      for (const f of page) {
        if (f?.name?.endsWith(".json") && f.name !== "_index.json") names.push(f.name);
      }
      if (page.length < REMOTE_PAGE_SIZE) break;
    }
  } catch (err) {
    console.warn(`[prerender] Listing Storage échoué (${(err as Error).message}) — articles distants NON prérendus.`);
    return [];
  }

  const out: Article[] = [];
  let failures = 0;
  for (const name of names) {
    try {
      const res = await fetchWithTimeout(
        `${supabaseUrl}/storage/v1/object/public/articles/articles/${encodeURIComponent(name)}`,
        { headers: { apikey: anonKey } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const a = (await res.json()) as Article;
      if (!a || typeof a !== "object" || !a.title || !Number.isFinite(Number(a.id))) {
        failures++;
        continue;
      }
      out.push({ ...a, id: Number(a.id) });
    } catch (err) {
      failures++;
      console.warn(`[prerender] Article distant ignoré (${name}) : ${(err as Error).message}`);
    }
  }

  console.log(`[prerender] Articles distants récupérés : ${out.length}/${names.length} (${failures} ignorés).`);
  return out;
}

/* ---------------- Rendu ---------------- */

interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  bodyHtml: string;
  canonical?: string;
  jsonLd?: object[];
}

function renderPage(meta: PageMeta): string {
  const abs = meta.canonical ?? `${BASE_URL}${meta.path}`;
  const titleSafe = escapeHtml(meta.title);
  const descSafe = escapeHtml(truncate(meta.description, 158));
  const ogImage = meta.ogImage
    ? meta.ogImage.startsWith("http")
      ? meta.ogImage
      : `${BASE_URL}${meta.ogImage.startsWith("/") ? "" : "/"}${meta.ogImage}`
    : `${BASE_URL}/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png`;

  let html = TEMPLATE;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleSafe}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${descSafe}" />`,
  );

  // Canonical + hreflang par route (une seule occurrence, remplacée en place).
  const canonicalTag =
    `<link rel="canonical" href="${escapeAttr(abs)}" />\n` +
    `    <link rel="alternate" hreflang="fr-CA" href="${escapeAttr(abs)}" />\n` +
    `    <link rel="alternate" hreflang="fr" href="${escapeAttr(abs)}" />\n` +
    `    <link rel="alternate" hreflang="x-default" href="${escapeAttr(abs)}" />`;
  if (/<link\s+rel="canonical"[^>]*>/.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, canonicalTag);
  } else {
    html = html.replace("</head>", `    ${canonicalTag}\n  </head>`);
  }
  // Évite les hreflang dupliqués hérités du template.
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="(fr-FR|en|en-CA|en-US)"[^>]*>\s*/gi,
    "",
  );

  html = html
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${titleSafe}" />`)
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${descSafe}" />`,
    )
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeAttr(abs)}" />`)
    .replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${escapeAttr(ogImage)}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${titleSafe}" />`)
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${descSafe}" />`,
    )
    .replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`);

  if (meta.jsonLd && meta.jsonLd.length > 0) {
    const jsonLdScripts = meta.jsonLd
      .map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`)
      .join("\n    ");
    html = html.replace("</head>", `    ${jsonLdScripts}\n  </head>`);
  }

  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${meta.bodyHtml}</div>`);

  return html;
}

function writeRoute(routePath: string, html: string): boolean {
  const outDir = safeRouteDir(DIST, routePath);
  if (!outDir) {
    console.warn(`[prerender] Route ignorée (hors de dist/ ou invalide) : ${routePath}`);
    return false;
  }
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  return true;
}

/* ---------------- Gabarits de contenu (visibles) ---------------- */

const SHELL_STYLE =
  "max-width:880px;margin:0 auto;padding:32px 20px 64px;font-family:system-ui,-apple-system,sans-serif;color:#1f2933;line-height:1.65;";

/** Premier rendu réellement visible et accessible, remplacé par React. */
function shellWrap(inner: string): string {
  return `<div data-prerender="initial" style="${SHELL_STYLE}">${inner}</div>`;
}

function navLinks(): string {
  return `
    <nav aria-label="Navigation principale" style="margin-bottom:24px;font-size:14px;">
      <a href="/" style="margin-right:12px;">Accueil</a>
      <a href="/articles" style="margin-right:12px;">Articles</a>
      <a href="/ebooks" style="margin-right:12px;">Ebooks</a>
      <a href="/meilleurs-produits-bebe-2026" style="margin-right:12px;">Meilleurs produits 2026</a>
      <a href="/calculateur-cout-bebe-quebec" style="margin-right:12px;">Calculateur</a>
      <a href="/faq" style="margin-right:12px;">FAQ</a>
      <a href="/about" style="margin-right:12px;">À propos</a>
    </nav>`;
}

function homepageBody(all: Article[]): string {
  const featured = all.slice(0, 8);
  const items = featured
    .map(
      (a) => `
      <li style="margin-bottom:16px;">
        <a href="${escapeAttr(articleUrlPath(a) || "/articles")}" style="font-weight:600;color:#0a4b8c;">${escapeHtml(a.title)}</a>
        <p style="margin:4px 0 0;color:#444;">${escapeHtml(truncate(a.excerpt || a.summary || "", 180))}</p>
      </li>`,
    )
    .join("");
  return shellWrap(`
    ${navLinks()}
    <p style="text-transform:uppercase;letter-spacing:.12em;font-size:12px;color:#667;">Ressources indépendantes · Fait au Québec</p>
    <h1>Le guide québécois des 1000 premiers jours</h1>
    <p>Comparatifs de produits, calculateurs pratiques et guides gratuits pour t'accompagner de la grossesse aux deux ans de bébé — sans jargon, sans commandites déguisées.</p>
    <p>
      <a href="/meilleurs-produits-bebe-2026" style="font-weight:600;color:#0a4b8c;">Voir les meilleurs produits 2026</a>
      · <a href="/contests">Participe à notre concours</a>
    </p>
    <h2>Articles vedettes</h2>
    <ul style="list-style:none;padding:0;">${items}</ul>
    <h2>Ressources gratuites</h2>
    <ul>
      <li><a href="/ebooks">Bibliothèque d'ebooks PDF</a> — sommeil, coliques, développement, parentalité</li>
      <li><a href="/articles">Tous les articles</a></li>
      <li><a href="/calculateur-cout-bebe-quebec">Calculateur du coût d'un bébé au Québec</a></li>
      <li><a href="/faq">Questions fréquentes</a></li>
    </ul>
    <p style="margin-top:32px;color:#666;font-size:14px;">Gratuit · Sans inscription · Contenu indépendant</p>
  `);
}

function articlesIndexBody(all: Article[]): string {
  const items = all
    .map(
      (a) => `
      <li style="margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:16px;">
        <h2 style="margin:0 0 4px;font-size:18px;">
          <a href="${escapeAttr(articleUrlPath(a) || "/articles")}" style="color:#0a4b8c;text-decoration:none;">${escapeHtml(a.title)}</a>
        </h2>
        <p style="margin:0 0 4px;color:#666;font-size:13px;">${escapeHtml(a.category || "")} · ${escapeHtml(a.author || "BabyBaby")} · ${escapeHtml(String(a.readingTime ?? ""))} min de lecture</p>
        <p style="margin:0;color:#333;">${escapeHtml(truncate(a.excerpt || a.summary || "", 240))}</p>
      </li>`,
    )
    .join("");
  return shellWrap(`
    ${navLinks()}
    <h1>Articles — parentalité, sommeil, nutrition, développement</h1>
    <p>${all.length} articles pour accompagner les parents au quotidien.</p>
    <ul style="list-style:none;padding:0;">${items}</ul>
  `);
}

function articleBody(a: Article, remote: boolean): string {
  const contentHtml = marked.parse(a.content || "") as string;
  const tags = Array.isArray(a.tags) ? a.tags : [];
  const imageUrl = safeUrl(a.image);

  const article = `
    <article>
      <p style="color:#666;font-size:13px;margin:0;">
        <a href="/articles" style="color:#0a4b8c;">← Tous les articles</a> · ${escapeHtml(a.category || "")}
      </p>
      <h1 style="margin-top:16px;">${escapeHtml(a.title)}</h1>
      <p style="color:#666;font-size:14px;">
        Par <strong>${escapeHtml(a.author || "BabyBaby")}</strong> · ${escapeHtml(a.date || "")}${a.readingTime ? ` · ${escapeHtml(String(a.readingTime))} min de lecture` : ""}
      </p>
      ${imageUrl ? `<img src="${escapeAttr(imageUrl)}" alt="${escapeAttr(a.image_alt || a.title)}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;" />` : ""}
      <p style="font-size:18px;color:#222;">${escapeHtml(a.excerpt || a.summary || "")}</p>
      <div>${contentHtml}</div>
      ${
        Array.isArray(a.faqs) && a.faqs.length > 0
          ? `<section><h2>Questions fréquentes</h2>${a.faqs
              .map(
                (f) =>
                  `<h3 style="font-size:16px;margin-bottom:4px;">${escapeHtml(f.question)}</h3><p style="margin-top:0;">${escapeHtml(f.answer)}</p>`,
              )
              .join("")}</section>`
          : ""
      }
      ${
        tags.length > 0
          ? `<p style="margin-top:32px;font-size:13px;color:#666;">Mots-clés : ${tags
              .map((t) => `<span style="background:#f0f4f8;padding:2px 8px;border-radius:12px;margin-right:4px;">${escapeHtml(t)}</span>`)
              .join("")}</p>`
          : ""
      }
    </article>
  `;

  // Contenu distant : TOUT le corps assemblé (titre, image, extrait, contenu,
  // FAQ, tags) repasse par l'allowlist, pas seulement le markdown converti.
  return shellWrap(`
    ${navLinks()}
    ${remote ? sanitizeArticleHtml(article) : article}
  `);
}

function ebooksBody(): string {
  const items = ebooksData
    .map(
      (e) => `
      <li style="margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:16px;">
        <h2 style="margin:0 0 4px;font-size:18px;">
          <a href="/ebooks/${escapeAttr(String(e.id))}" style="color:#0a4b8c;text-decoration:none;">${escapeHtml(e.title)}</a>
        </h2>
        <p style="margin:0 0 4px;color:#666;font-size:13px;">${escapeHtml(e.category)} · ${escapeHtml(e.author)} · ${escapeHtml(e.fileType)} ${escapeHtml(e.fileSize)}</p>
        <p style="margin:0;color:#333;">${escapeHtml(e.description)}</p>
      </li>`,
    )
    .join("");
  return shellWrap(`
    ${navLinks()}
    <h1>Ebooks PDF gratuits pour parents</h1>
    <p>Téléchargez gratuitement nos guides sur le sommeil, les coliques, le développement et la parentalité bienveillante.</p>
    <ul style="list-style:none;padding:0;">${items}</ul>
  `);
}

function staticPageBody(h1: string, intro: string, links?: { href: string; label: string }[]): string {
  const linksHtml = links
    ? `<ul>${links.map((l) => `<li><a href="${escapeAttr(l.href)}">${escapeHtml(l.label)}</a></li>`).join("")}</ul>`
    : "";
  return shellWrap(`
    ${navLinks()}
    <h1>${escapeHtml(h1)}</h1>
    <p>${escapeHtml(intro)}</p>
    ${linksHtml}
  `);
}

/* ---------------- Run ---------------- */

async function run() {
  const remote = await fetchStorageArticles();

  // Déduplication par id : l'article local (source de vérité versionnée) gagne.
  const byId = new Map<number, { article: Article; remote: boolean }>();
  const register = (a: Article, isRemote: boolean) => {
    const id = toArticleId(a.id);
    if (id === undefined) {
      console.warn(`[prerender] Article ignoré : id invalide (${String(a.id)}).`);
      return;
    }
    byId.set(id, { article: { ...a, id }, remote: isRemote });
  };
  for (const a of remote) register(a, true);
  for (const a of localArticles) register(a, false);

  const entries = [...byId.values()].sort((x, y) => Number(y.article.id) - Number(x.article.id));
  const all = entries.map((e) => e.article);

  const sitemap: { loc: string; lastmod?: string; priority: number; changefreq: string }[] = [];
  let count = 0;

  const addSitemap = (path: string, priority: number, changefreq: string, lastmod?: string) => {
    sitemap.push({ loc: `${BASE_URL}${path}`, lastmod, priority, changefreq });
  };

  // 1. Accueil
  writeRoute(
    "/",
    renderPage({
      title: "BabyBaby — Le guide québécois des 1000 premiers jours",
      description:
        "Guide québécois indépendant de la grossesse aux 2 ans : comparatifs de produits, calculateur de coûts, articles et ebooks gratuits pour les parents.",
      path: "/",
      bodyHtml: homepageBody(all),
    }),
  );
  addSitemap("/", 1.0, "daily");
  count++;

  // 2. Index des articles
  writeRoute(
    "/articles",
    renderPage({
      title: "Articles parentalité : sommeil, nutrition, développement bébé",
      description: `${all.length} articles de parentalité québécoise : sommeil de bébé, allaitement, diversification, développement, discipline positive.`,
      path: "/articles",
      bodyHtml: articlesIndexBody(all),
    }),
  );
  addSitemap("/articles", 0.9, "daily");
  count++;

  // 3. Chaque article (URL canonique = même résolution que le frontend)
  for (const { article: a, remote: isRemote } of entries) {
    const canonicalPath = articleUrlPath(a);
    if (!canonicalPath) continue;
    const canonical = `${BASE_URL}${canonicalPath}`;
    const published = toIsoDate(a.date);
    const modified = toIsoDate(a.dateModified) || published;

    const jsonLd: object[] = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.excerpt || a.summary,
        image: (() => {
          const img = safeUrl(a.image);
          if (!img) return undefined;
          return img.startsWith("http") ? img : `${BASE_URL}${img}`;
        })(),
        ...(published ? { datePublished: published } : {}),
        ...(modified ? { dateModified: modified } : {}),
        author: { "@type": "Person", name: a.author || "BabyBaby" },
        publisher: {
          "@type": "Organization",
          name: "BabyBaby",
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png`,
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        articleSection: a.category,
        keywords: Array.isArray(a.tags) ? a.tags.join(", ") : undefined,
        inLanguage: "fr-CA",
      },
    ];

    if (Array.isArray(a.faqs) && a.faqs.length > 0) {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: a.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }

    const page = renderPage({
      title: truncate(a.title, 60),
      description: truncate(a.excerpt || a.summary || a.title, 158),
      path: canonicalPath,
      canonical,
      ogImage: safeUrl(a.image),
      bodyHtml: articleBody(a, isRemote),
      jsonLd,
    });

    if (!writeRoute(canonicalPath, page)) continue;
    count++;

    // Variante /articles/<id> (route legacy toujours servie par le frontend) :
    // même contenu, canonical pointant vers l'URL avec slug.
    if (canonicalPath !== `/articles/${a.id}` && writeRoute(`/articles/${a.id}`, page)) {
      count++;
    }

    addSitemap(canonicalPath, 0.8, "monthly", (modified || published)?.slice(0, 10));
  }

  // 4. Ebooks
  writeRoute(
    "/ebooks",
    renderPage({
      title: "Ebooks PDF gratuits pour parents — sommeil, coliques, développement",
      description:
        "Téléchargez gratuitement nos ebooks PDF : sommeil de bébé, coliques, parentalité bienveillante, développement 0-12 mois et plus.",
      path: "/ebooks",
      bodyHtml: ebooksBody(),
    }),
  );
  addSitemap("/ebooks", 0.7, "weekly");
  count++;

  // 5. Pages statiques
  const staticPages: { path: string; title: string; description: string; h1: string; intro: string; priority: number }[] = [
    {
      path: "/faq",
      title: "FAQ — Questions fréquentes des parents de bébé",
      description:
        "Réponses claires aux questions les plus posées par les jeunes parents : sommeil, alimentation, santé, croissance et développement de bébé.",
      h1: "Questions fréquentes",
      intro:
        "Toutes les réponses aux questions que se posent les parents de bébé, par catégorie : sommeil, nutrition, santé, développement.",
      priority: 0.6,
    },
    {
      path: "/about",
      title: "À propos de BabyBaby — notre mission",
      description:
        "BabyBaby publie des guides et outils gratuits pour les parents québécois, de la grossesse aux deux ans de l'enfant. Découvrez notre mission et l'histoire du domaine.",
      h1: "À propos de BabyBaby",
      intro:
        "BabyBaby publie gratuitement des guides, comparatifs et outils pour les parents québécois, de la grossesse aux deux ans de l'enfant. Le domaine babybaby.org existe depuis 1998 et a servi à d'autres projets avant nous ; la plateforme actuelle, elle, est récente.",
      priority: 0.5,
    },
    {
      path: "/free-offers",
      title: "Offres gratuites pour parents — ebooks, outils, échantillons",
      description:
        "Profitez de nos offres gratuites : ebooks PDF, outils en ligne, échantillons et ressources pour les jeunes parents au Québec.",
      h1: "Offres gratuites pour parents",
      intro: "Toutes nos ressources et offres gratuites pour accompagner les parents : ebooks, outils, échantillons, partenariats.",
      priority: 0.5,
    },
    {
      path: "/boutique",
      title: "Boutique BabyBaby — produits sélectionnés pour bébé",
      description:
        "Notre sélection de produits pour bébé : éveil, soin, sommeil, alimentation. Sélection éditoriale de la rédaction BabyBaby.",
      h1: "Boutique BabyBaby",
      intro: "Une sélection éditoriale de produits pour bébé, classés par catégorie d'âge et besoin.",
      priority: 0.6,
    },
    {
      path: "/meilleurs-produits-bebe-2026",
      title: "Meilleurs produits bébé 2026 — comparatif québécois",
      description:
        "Comparatif 2026 des produits pour bébé : poussettes, sièges d'auto, tire-lait, couches. Analyse documentaire des specs, normes et prix au Canada.",
      h1: "Meilleurs produits bébé 2026",
      intro:
        "Notre comparatif 2026, basé sur l'analyse des spécifications, des normes de sécurité canadiennes et des prix constatés au Québec.",
      priority: 0.9,
    },
    {
      path: "/calculateur-cout-bebe-quebec",
      title: "Calculateur du coût d'un bébé au Québec 2026",
      description:
        "Estime le coût réel de la première année de bébé au Québec : alimentation, couches, garde, équipement, et aides comme le RQAP et l'Allocation famille.",
      h1: "Calculateur du coût d'un bébé au Québec",
      intro:
        "Estime le budget de la première année : alimentation, couches, garde, équipement, en tenant compte des aides gouvernementales québécoises.",
      priority: 0.8,
    },
    {
      path: "/contests",
      title: "Concours BabyBaby — panier de naissance québécois",
      description:
        "Participe au concours BabyBaby et cours la chance de gagner un panier de naissance québécois. Inscription gratuite par courriel.",
      h1: "Concours BabyBaby",
      intro: "Notre concours en cours pour les parents et futurs parents du Québec.",
      priority: 0.7,
    },
    {
      path: "/contact",
      title: "Contact — BabyBaby",
      description: "Écris-nous à contact@babybaby.org ou par téléphone au 1 (581) 436-BABY. L'équipe BabyBaby répond aux parents du Québec.",
      h1: "Contacter BabyBaby",
      intro: "Une question, une correction, un partenariat ? Écris-nous à contact@babybaby.org ou appelle au 1 (581) 436-BABY.",
      priority: 0.4,
    },
  ];

  for (const p of staticPages) {
    writeRoute(
      p.path,
      renderPage({
        title: p.title,
        description: p.description,
        path: p.path,
        bodyHtml: staticPageBody(p.h1, p.intro),
      }),
    );
    addSitemap(p.path, p.priority, "monthly");
    count++;
  }

  // 6. Sitemap aligné sur les routes réellement générées
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemap
      .map((u) => {
        // Pas de lastmod inventé : on l'omet quand la vraie date est inconnue.
        const lastmod = u.lastmod ? `\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>` : "";
        return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lastmod}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`;
      })
      .join("\n") +
    `\n</urlset>\n`;
  writeFileSync(resolve(DIST, "sitemap.xml"), xml);

  console.log(
    `[prerender] ✓ ${count} pages statiques générées (${localArticles.length} articles locaux, ${remote.length} distants) + sitemap de ${sitemap.length} URLs.`,
  );
}

run().catch((err) => {
  console.error("[prerender] Échec :", err);
  process.exit(1);
});
