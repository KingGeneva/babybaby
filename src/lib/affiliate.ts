/**
 * Configuration centralisée de l'affiliation Amazon (Canada).
 *
 * Le tag Amazon Associates est lu depuis VITE_AMAZON_ASSOCIATE_TAG, avec
 * un fallback explicite pour éviter une page cassée en cas d'oubli.
 */
import type { Product } from "@/data/babyProductsReport";

const ENV_TAG = (import.meta.env.VITE_AMAZON_ASSOCIATE_TAG as string | undefined)?.trim();
const FALLBACK_TAG = "babybaby047-20";

export const AMAZON_ASSOCIATE_TAG: string = ENV_TAG && ENV_TAG.length > 0 ? ENV_TAG : FALLBACK_TAG;

if (AMAZON_ASSOCIATE_TAG.includes("REMPLACER") || AMAZON_ASSOCIATE_TAG.includes("PLACEHOLDER")) {
  // eslint-disable-next-line no-console
  console.warn(
    `[affiliate] VITE_AMAZON_ASSOCIATE_TAG est manquant — utilisation du fallback "${FALLBACK_TAG}". ` +
      `Définis VITE_AMAZON_ASSOCIATE_TAG dans Project Settings → Secrets pour activer le tracking d'affiliation Amazon.`,
  );
}

function isAmazonDomain(hostname: string): boolean {
  return /(^|\.)amazon\.(ca|com)$/i.test(hostname);
}

function isShortAmazon(hostname: string): boolean {
  return /^(www\.)?a\.co$/i.test(hostname);
}

/**
 * Renvoie l'URL d'affiliation finale pour un produit.
 *
 * Règles :
 * - affiliateLink amazon.ca / amazon.com sans tag → on ajoute ?tag= / &tag=
 * - affiliateLink a.co/* (lien court, déjà tagué côté Amazon) → tel quel
 * - autre marchand → tel quel
 * - pas d'affiliateLink → URL de recherche Amazon.ca taguée (brand + name)
 */
export function buildAmazonUrl(product: Pick<Product, "name" | "brand" | "affiliateLink">): string {
  const link = product.affiliateLink?.trim();
  if (link) {
    try {
      const url = new URL(link);
      const host = url.hostname.toLowerCase();
      if (isShortAmazon(host)) {
        return link;
      }
      if (isAmazonDomain(host)) {
        if (!url.searchParams.has("tag")) {
          url.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
        }
        return url.toString();
      }
      // Autre marchand : on ne touche pas.
      return link;
    } catch {
      return link;
    }
  }

  const query = encodeURIComponent(`${product.brand} ${product.name}`.trim());
  return `https://www.amazon.ca/s?k=${query}&tag=${encodeURIComponent(AMAZON_ASSOCIATE_TAG)}`;
}

export function getProductDestination(product: Pick<Product, "name" | "brand" | "affiliateLink">): string {
  return buildAmazonUrl(product);
}
