import { describe, it, expect } from "vitest";
import {
  rewriteLegacyUrl,
  rewriteLegacyLinksInText,
  toInternalHref,
} from "../src/lib/internalLinks";

describe("rewriteLegacyUrl", () => {
  it("réécrit l'hôte hérité et mappe l'ancienne route", () => {
    expect(rewriteLegacyUrl("https://www.babybaby.app/fr/article/abc-123")).toBe(
      "https://babybaby.org/articles/abc-123",
    );
    expect(rewriteLegacyUrl("https://babybaby.app/articles/abc-123")).toBe(
      "https://babybaby.org/articles/abc-123",
    );
  });

  it("préserve query et fragment", () => {
    expect(rewriteLegacyUrl("http://babybaby.app/articles/x?a=1&b=2#s")).toBe(
      "https://babybaby.org/articles/x?a=1&b=2#s",
    );
  });

  it("ne touche pas les hôtes similaires ni les domaines externes", () => {
    for (const u of [
      "https://babybaby.app.evil.com/x",
      "https://notbabybaby.app/x",
      "https://sub.babybaby.app.co/x",
      "https://inspq.qc.ca/babybaby.app",
      "https://babybaby.org/articles/x",
    ]) {
      expect(rewriteLegacyUrl(u)).toBe(u);
    }
  });
});

describe("rewriteLegacyLinksInText", () => {
  it("traite les liens Markdown et HTML sans remplacement aveugle", () => {
    const src = [
      "Voir [ce guide](https://www.babybaby.app/fr/article/sommeil-9) et",
      '<a href="https://babybaby.app/articles/x?q=1">x</a>,',
      "puis https://babybaby.app/articles/y.",
      "Source externe : https://www.inspq.qc.ca/babybaby.app/page",
      "Mention littérale babybaby.app sans protocole.",
    ].join("\n");
    const { text, count } = rewriteLegacyLinksInText(src);
    expect(count).toBe(3);
    expect(text).toContain("(https://babybaby.org/articles/sommeil-9)");
    expect(text).toContain('href="https://babybaby.org/articles/x?q=1"');
    expect(text).toContain("https://babybaby.org/articles/y.");
    expect(text).toContain("https://www.inspq.qc.ca/babybaby.app/page");
    expect(text).toContain("Mention littérale babybaby.app sans protocole.");
  });

  it("est idempotent", () => {
    const once = rewriteLegacyLinksInText("[a](https://babybaby.app/fr/article/z)").text;
    const twice = rewriteLegacyLinksInText(once);
    expect(twice.count).toBe(0);
    expect(twice.text).toBe(once);
  });
});

describe("toInternalHref", () => {
  it("renvoie un chemin interne pour les deux domaines du site", () => {
    expect(toInternalHref("https://babybaby.app/fr/article/a-1")).toBe("/articles/a-1");
    expect(toInternalHref("https://babybaby.org/faq?x=1#y")).toBe("/faq?x=1#y");
    expect(toInternalHref("/articles/a-1")).toBe("/articles/a-1");
  });

  it("renvoie null pour un lien externe", () => {
    expect(toInternalHref("https://inspq.qc.ca/page")).toBeNull();
    expect(toInternalHref("mailto:contact@babybaby.org")).toBeNull();
  });
});
