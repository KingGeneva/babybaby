/**
 * Post-build SEO static page generator.
 *
 * Reads dist/index.html (the SPA shell) and writes per-route HTML files
 * with:
 *   - Custom <title>, <meta description>, canonical, OG tags
 *   - Static HTML content inside <div id="root"> so crawlers (Google,
 *     Bing, LinkedIn, Facebook, GPTBot, PerplexityBot, etc.) read real
 *     content without executing JavaScript.
 *
 * React's createRoot().render() in src/main.tsx replaces #root's
 * children on hydration, so users still get the live React app.
 *
 * Run via `postbuild` npm script.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { marked } from "marked";

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

if (!existsSync(TEMPLATE_PATH)) {
  console.error(`[prerender] dist/index.html not found — run vite build first.`);
  process.exit(0);
}

const TEMPLATE = readFileSync(TEMPLATE_PATH, "utf-8");

const articles: Article[] = [
  ...nutritionArticles,
  ...amenagementArticles,
  ...sommeilArticles,
  ...developpementArticles,
  ...preparationArticles,
  ...croissanceArticles,
].sort((a, b) => b.id - a.id);

marked.setOptions({ gfm: true, breaks: false });

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  bodyHtml: string;
  jsonLd?: object[];
}

/**
 * Build a route HTML file from the dist/index.html template by:
 *  - Replacing <title>, meta description, canonical, og:url, og:title,
 *    og:description, twitter:title, twitter:description, twitter:image
 *  - Injecting static SEO content inside <div id="root">…</div>
 *  - Appending optional JSON-LD scripts before </head>
 */
function renderPage(meta: PageMeta): string {
  const abs = `${BASE_URL}${meta.path}`;
  const titleSafe = escapeHtml(meta.title);
  const descSafe = escapeHtml(truncate(meta.description, 158));
  const ogImage = meta.ogImage
    ? meta.ogImage.startsWith("http")
      ? meta.ogImage
      : `${BASE_URL}${meta.ogImage.startsWith("/") ? "" : "/"}${meta.ogImage}`
    : "https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png";

  let html = TEMPLATE;

  // 1. Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleSafe}</title>`);

  // 2. Meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${descSafe}" />`,
  );

  // 3. Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${abs}" />`,
  );

  // 4. OG / Twitter tags
  html = html
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${titleSafe}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${descSafe}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${abs}" />`,
    )
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${titleSafe}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${descSafe}" />`,
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`,
    );

  // 5. Append JSON-LD
  if (meta.jsonLd && meta.jsonLd.length > 0) {
    const jsonLdScripts = meta.jsonLd
      .map(
        (j) =>
          `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`,
      )
      .join("\n    ");
    html = html.replace("</head>", `    ${jsonLdScripts}\n  </head>`);
  }

  // 6. Inject body content into #root — React will replace on hydration
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${meta.bodyHtml}</div>`,
  );

  return html;
}

function writeRoute(routePath: string, html: string) {
  const isRoot = routePath === "/";
  const outDir = isRoot ? DIST : resolve(DIST, routePath.replace(/^\//, ""));
  mkdirSync(outDir, { recursive: true });
  const outFile = resolve(outDir, "index.html");
  writeFileSync(outFile, html);
}

/* ---------------- Page generators ---------------- */

function shellWrap(inner: string): string {
  // Hidden-from-layout-style wrapper — visible to crawlers, replaced by React.
  // Uses inline style instead of Tailwind classes (CSS not loaded yet for SSR-less pages).
  return `<div style="max-width:760px;margin:0 auto;padding:24px;font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;line-height:1.6;">${inner}</div>`;
}

function navLinks(): string {
  return `
    <nav aria-label="Navigation principale" style="margin-bottom:24px;font-size:14px;">
      <a href="/" style="margin-right:12px;">Accueil</a>
      <a href="/articles" style="margin-right:12px;">Articles</a>
      <a href="/ebooks" style="margin-right:12px;">Ebooks</a>
      <a href="/faq" style="margin-right:12px;">FAQ</a>
      <a href="/about" style="margin-right:12px;">À propos</a>
      <a href="/boutique" style="margin-right:12px;">Boutique</a>
    </nav>`;
}

function homepageBody(): string {
  const featured = articles.slice(0, 8);
  const items = featured
    .map(
      (a) => `
      <li style="margin-bottom:16px;">
        <a href="/articles/${a.id}" style="font-weight:600;color:#0a4b8c;">${escapeHtml(a.title)}</a>
        <p style="margin:4px 0 0;color:#444;">${escapeHtml(truncate(a.excerpt, 180))}</p>
      </li>`,
    )
    .join("");
  return shellWrap(`
    ${navLinks()}
    <h1>BabyBaby — l'accompagnement complet des parents de 0 à 36 mois</h1>
    <p><strong>Application web gratuite francophone</strong> pour suivre la croissance, la santé et le développement de votre bébé. Courbes OMS, calendrier vaccinal, outils sommeil (bruit blanc, berceuses), articles d'experts et ebooks téléchargeables.</p>
    <h2>Articles vedettes</h2>
    <ul style="list-style:none;padding:0;">${items}</ul>
    <h2>Ressources gratuites</h2>
    <ul>
      <li><a href="/ebooks">Bibliothèque d'ebooks PDF</a> — sommeil, coliques, développement 0-12 mois, gentle parenting…</li>
      <li><a href="/articles">Tous les articles</a></li>
      <li><a href="/meilleurs-produits-bebe-2026">Comparatif des meilleurs produits bébé 2026</a></li>
      <li><a href="/faq">Questions fréquentes</a></li>
    </ul>
    <p style="margin-top:32px;color:#666;font-size:14px;">BabyBaby est édité depuis 1998, héritier du domaine MSLO (2000-2003).</p>
  `);
}

function articlesIndexBody(): string {
  const items = articles
    .map(
      (a) => `
      <li style="margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:16px;">
        <h2 style="margin:0 0 4px;font-size:18px;">
          <a href="/articles/${a.id}" style="color:#0a4b8c;text-decoration:none;">${escapeHtml(a.title)}</a>
        </h2>
        <p style="margin:0 0 4px;color:#666;font-size:13px;">${escapeHtml(a.category)} · ${escapeHtml(a.author)} · ${a.readingTime} min de lecture</p>
        <p style="margin:0;color:#333;">${escapeHtml(truncate(a.excerpt, 240))}</p>
      </li>`,
    )
    .join("");
  return shellWrap(`
    ${navLinks()}
    <h1>Articles — Parentalité, sommeil, nutrition, développement</h1>
    <p>Plus de ${articles.length} articles d'experts pour accompagner les parents au quotidien.</p>
    <ul style="list-style:none;padding:0;">${items}</ul>
  `);
}

function articleBody(a: Article): string {
  const contentHtml = marked.parse(a.content || "") as string;
  return shellWrap(`
    ${navLinks()}
    <article>
      <p style="color:#666;font-size:13px;margin:0;">
        <a href="/articles" style="color:#0a4b8c;">← Tous les articles</a> · ${escapeHtml(a.category)}
      </p>
      <h1 style="margin-top:16px;">${escapeHtml(a.title)}</h1>
      <p style="color:#666;font-size:14px;">
        Par <strong>${escapeHtml(a.author)}</strong> · ${escapeHtml(a.date)} · ${a.readingTime} min de lecture
      </p>
      ${a.image ? `<img src="${escapeAttr(a.image)}" alt="${escapeAttr(a.image_alt || a.title)}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;" />` : ""}
      <p style="font-size:18px;color:#222;font-style:italic;">${escapeHtml(a.excerpt)}</p>
      <div>${contentHtml}</div>
      <p style="margin-top:32px;font-size:13px;color:#666;">
        Mots-clés : ${a.tags.map((t) => `<span style="background:#f0f4f8;padding:2px 8px;border-radius:12px;margin-right:4px;">${escapeHtml(t)}</span>`).join("")}
      </p>
    </article>
  `);
}

function ebooksBody(): string {
  const items = ebooksData
    .map(
      (e) => `
      <li style="margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:16px;">
        <h2 style="margin:0 0 4px;font-size:18px;">
          <a href="/ebooks/${e.id}" style="color:#0a4b8c;text-decoration:none;">${escapeHtml(e.title)}</a>
        </h2>
        <p style="margin:0 0 4px;color:#666;font-size:13px;">${escapeHtml(e.category)} · ${escapeHtml(e.author)} · ${escapeHtml(e.fileType)} ${escapeHtml(e.fileSize)}</p>
        <p style="margin:0;color:#333;">${escapeHtml(e.description)}</p>
      </li>`,
    )
    .join("");
  return shellWrap(`
    ${navLinks()}
    <h1>Ebooks PDF gratuits pour parents</h1>
    <p>Téléchargez gratuitement nos guides complets sur le sommeil, les coliques, le développement et la parentalité bienveillante.</p>
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

let count = 0;

// 1. Homepage
writeRoute(
  "/",
  renderPage({
    title: "BabyBaby — Suivi bébé, croissance OMS & conseils parents",
    description:
      "App gratuite de suivi bébé : courbes OMS, calendrier vaccinal, sommeil, allaitement, diversification. Articles d'experts et communauté de parents francophones.",
    path: "/",
    bodyHtml: homepageBody(),
  }),
);
count++;

// 2. Articles index
writeRoute(
  "/articles",
  renderPage({
    title: `Articles parentalité : sommeil, nutrition, développement bébé`,
    description: `${articles.length} articles d'experts en parentalité francophone : sommeil bébé, allaitement, diversification, développement, gentle parenting.`,
    path: "/articles",
    bodyHtml: articlesIndexBody(),
  }),
);
count++;

// 3. Each article
for (const a of articles) {
  writeRoute(
    `/articles/${a.id}`,
    renderPage({
      title: truncate(a.title, 60),
      description: truncate(a.excerpt || a.summary, 158),
      path: `/articles/${a.id}`,
      ogImage: a.image,
      bodyHtml: articleBody(a),
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt || a.summary,
          image: a.image?.startsWith("http")
            ? a.image
            : `${BASE_URL}${a.image?.startsWith("/") ? "" : "/"}${a.image || ""}`,
          datePublished: a.date,
          dateModified: a.dateModified || a.date,
          author: { "@type": "Person", name: a.author },
          publisher: {
            "@type": "Organization",
            name: "BabyBaby",
            logo: {
              "@type": "ImageObject",
              url: `${BASE_URL}/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png`,
            },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/articles/${a.id}` },
          articleSection: a.category,
          keywords: a.tags?.join(", "),
          inLanguage: "fr-CA",
        },
      ],
    }),
  );
  count++;
}

// 4. Ebooks index
writeRoute(
  "/ebooks",
  renderPage({
    title: "Ebooks PDF gratuits pour parents — Sommeil, coliques, développement",
    description:
      "Téléchargez gratuitement nos ebooks PDF : sommeil de bébé, coliques, gentle parenting, développement 0-12 mois, étapes clés et plus.",
    path: "/ebooks",
    bodyHtml: ebooksBody(),
  }),
);
count++;

// 5. Static pages
writeRoute(
  "/faq",
  renderPage({
    title: "FAQ — Questions fréquentes des parents de bébé",
    description:
      "Réponses claires aux questions les plus posées par les jeunes parents : sommeil, alimentation, santé, croissance et développement de bébé.",
    path: "/faq",
    bodyHtml: staticPageBody(
      "Questions fréquentes",
      "Toutes les réponses aux questions que se posent les parents de bébé, par catégorie : sommeil, nutrition, santé, développement.",
    ),
  }),
);
count++;

writeRoute(
  "/about",
  renderPage({
    title: "À propos — L'histoire de BabyBaby depuis 1998",
    description:
      "Découvrez l'histoire de BabyBaby, plateforme d'accompagnement des parents francophones depuis 1998, héritière du domaine MSLO.",
    path: "/about",
    bodyHtml: staticPageBody(
      "À propos de BabyBaby",
      "BabyBaby accompagne les parents francophones depuis 1998. Notre mission : offrir gratuitement les meilleurs outils et le contenu le plus fiable pour les 0-36 mois.",
    ),
  }),
);
count++;

writeRoute(
  "/free-offers",
  renderPage({
    title: "Offres gratuites pour parents — Ebooks, outils, échantillons",
    description:
      "Profitez de nos offres gratuites : ebooks PDF, outils en ligne, échantillons et ressources exclusives pour les jeunes parents.",
    path: "/free-offers",
    bodyHtml: staticPageBody(
      "Offres gratuites pour parents",
      "Toutes nos ressources et offres gratuites pour accompagner les parents : ebooks, outils, échantillons, partenariats.",
    ),
  }),
);
count++;

writeRoute(
  "/boutique",
  renderPage({
    title: "Boutique BabyBaby — Produits sélectionnés pour bébé",
    description:
      "Notre sélection de produits indispensables pour bébé : éveil, soin, sommeil, alimentation. Produits validés par notre rédaction.",
    path: "/boutique",
    bodyHtml: staticPageBody(
      "Boutique BabyBaby",
      "Une sélection rigoureuse de produits pour bébé, classés par catégorie d'âge et besoin.",
    ),
  }),
);
count++;

writeRoute(
  "/meilleurs-produits-bebe-2026",
  renderPage({
    title: "Meilleurs produits bébé 2026 — Comparatif et tests",
    description:
      "Comparatif annuel 2026 des meilleurs produits bébé : poussettes, sièges auto, transats, biberons, jouets d'éveil. Tests et avis indépendants.",
    path: "/meilleurs-produits-bebe-2026",
    bodyHtml: staticPageBody(
      "Meilleurs produits bébé 2026",
      "Notre comparatif annuel des meilleurs produits pour bébé en 2026, basé sur des critères de sécurité, durabilité et rapport qualité-prix.",
    ),
  }),
);
count++;

writeRoute(
  "/contests",
  renderPage({
    title: "Concours BabyBaby — Gagnez des produits pour bébé",
    description:
      "Participez à nos concours mensuels et gagnez des produits pour bébé : poussettes, jouets, abonnements, bons d'achat et plus.",
    path: "/contests",
    bodyHtml: staticPageBody(
      "Concours BabyBaby",
      "Tous nos concours mensuels pour les parents et leurs bébés.",
    ),
  }),
);
count++;

console.log(`[prerender] ✓ Generated ${count} static SEO pages in dist/`);
