import { describe, it, expect } from "vitest";
import {
  sanitizeArticleHtml,
  safeUrl,
  safeSlug,
  toArticleId,
  articleUrlPath,
  safeRouteDir,
  escapeXml,
} from "./prerender-utils";

describe("sanitizeArticleHtml", () => {
  it("supprime les scripts et leur contenu", () => {
    const out = sanitizeArticleHtml('<p>ok</p><script>alert(1)</script>');
    expect(out).toContain("<p>ok</p>");
    expect(out).not.toContain("script");
    expect(out).not.toContain("alert(1)");
  });

  it("supprime les gestionnaires d'évènements inline", () => {
    const out = sanitizeArticleHtml('<p onclick="steal()" ONMOUSEOVER=x>texte</p>');
    expect(out).not.toMatch(/on[a-z]+=/i);
    expect(out).toContain("texte");
  });

  it("bloque javascript: y compris avec entités, espaces et casse", () => {
    const cases = [
      '<a href="javascript:alert(1)">a</a>',
      '<a href="JaVaScRiPt:alert(1)">a</a>',
      '<a href="  javascript:alert(1)">a</a>',
      '<a href="java&#115;cript:alert(1)">a</a>',
      '<a href="&#106;avascript:alert(1)">a</a>',
      '<a href="jav\tascript:alert(1)">a</a>',
    ];
    for (const c of cases) {
      const out = sanitizeArticleHtml(c);
      expect(out.toLowerCase()).not.toContain("javascript:");
      expect(out.toLowerCase()).not.toContain("alert(1)");
    }
  });

  it("bloque data: sur les images et les liens", () => {
    const out = sanitizeArticleHtml(
      '<img src="data:text/html;base64,PHNjcmlwdD4="><a href="data:text/html,x">l</a>',
    );
    expect(out).not.toContain("data:");
  });

  it("supprime SVG, MathML, iframe et object", () => {
    const out = sanitizeArticleHtml(
      '<svg><script>alert(1)</script></svg><math><mtext></mtext></math><iframe src="https://evil.test"></iframe><object data="x"></object>',
    );
    expect(out).not.toMatch(/svg|math|iframe|object|alert/i);
  });

  it("préserve liens https, paragraphes, listes, tableaux et images", () => {
    const out = sanitizeArticleHtml(
      '<p>Bonjour <a href="https://inspq.qc.ca">INSPQ</a></p><ul><li>un</li></ul>' +
        '<table><thead><tr><th scope="col">A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>' +
        '<img src="https://babybaby.org/img.jpg" alt="bébé">',
    );
    expect(out).toContain('href="https://inspq.qc.ca"');
    expect(out).toContain("<ul><li>un</li></ul>");
    expect(out).toContain("<table>");
    expect(out).toContain('<th scope="col">A</th>');
    expect(out).toContain('src="https://babybaby.org/img.jpg"');
    expect(out).toContain('alt="bébé"');
  });

  it("ajoute rel noopener sur les liens target=_blank", () => {
    const out = sanitizeArticleHtml('<a href="https://ex.test" target="_blank">x</a>');
    expect(out).toContain('rel="noopener noreferrer"');
  });
});

describe("safeUrl", () => {
  it("accepte http(s) et chemins internes", () => {
    expect(safeUrl("https://a.test/x.png")).toBe("https://a.test/x.png");
    expect(safeUrl("/lovable-uploads/x.png")).toBe("/lovable-uploads/x.png");
  });
  it("rejette javascript:, data: et protocole-relatif", () => {
    expect(safeUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeUrl("data:text/html,x")).toBeUndefined();
    expect(safeUrl("//evil.test/x.png")).toBeUndefined();
    expect(safeUrl("")).toBeUndefined();
    expect(safeUrl(undefined)).toBeUndefined();
  });
});

describe("identifiants et slugs", () => {
  it("n'accepte que des entiers positifs", () => {
    expect(toArticleId(9)).toBe(9);
    expect(toArticleId("1766972127216")).toBe(1766972127216);
    expect(toArticleId(0)).toBeUndefined();
    expect(toArticleId(-3)).toBeUndefined();
    expect(toArticleId(1.5)).toBeUndefined();
    expect(toArticleId("9; rm -rf /")).toBeUndefined();
    expect(toArticleId("../../etc")).toBeUndefined();
  });

  it("n'accepte qu'un segment de route en slug", () => {
    expect(safeSlug("sommeil-bebe-quebec")).toBe("sommeil-bebe-quebec");
    expect(safeSlug("../../etc/passwd")).toBeUndefined();
    expect(safeSlug("a/b")).toBeUndefined();
    expect(safeSlug("a\\b")).toBeUndefined();
    expect(safeSlug('a"b')).toBeUndefined();
    expect(safeSlug("a'b")).toBeUndefined();
    expect(safeSlug("..")).toBeUndefined();
    expect(safeSlug("Accents-Éé")).toBeUndefined();
  });

  it("produit les mêmes URLs que le frontend", () => {
    expect(articleUrlPath({ id: 9, slug: "sommeil-bebe" })).toBe("/articles/sommeil-bebe-9");
    expect(articleUrlPath({ id: 9 })).toBe("/articles/9");
    expect(articleUrlPath({ id: 9, slug: "../../evil" })).toBe("/articles/9");
    expect(articleUrlPath({ id: "abc" })).toBeUndefined();
  });
});

describe("safeRouteDir", () => {
  const DIST = "/tmp/dist";
  it("résout les routes normales dans dist", () => {
    expect(safeRouteDir(DIST, "/")).toBe("/tmp/dist");
    expect(safeRouteDir(DIST, "/articles/sommeil-9")).toBe("/tmp/dist/articles/sommeil-9");
  });
  it("refuse toute sortie de dist", () => {
    expect(safeRouteDir(DIST, "/../evil")).toBeUndefined();
    expect(safeRouteDir(DIST, "/articles/../../evil")).toBeUndefined();
    expect(safeRouteDir(DIST, "/articles/..%2f..")).toBe("/tmp/dist/articles/..%2f..");
    expect(safeRouteDir(DIST, "articles")).toBeUndefined();
    expect(safeRouteDir(DIST, "/a\\b")).toBeUndefined();
    expect(safeRouteDir(DIST, "/a\0b")).toBeUndefined();
  });
});

describe("escapeXml", () => {
  it("échappe les caractères réservés du sitemap", () => {
    expect(escapeXml("https://babybaby.org/a?b=1&c=2")).toBe("https://babybaby.org/a?b=1&amp;c=2");
    expect(escapeXml("<loc>")).toBe("&lt;loc&gt;");
  });
});
