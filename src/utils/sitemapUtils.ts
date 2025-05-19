
import fs from 'fs';
import path from 'path';

/**
 * Utilitaires pour la génération dynamique et l'optimisation des sitemaps
 */

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
}

interface SitemapImage {
  loc: string;
  title?: string;
  caption?: string;
}

/**
 * Génère le contenu XML du sitemap à partir d'une liste d'entrées
 */
export const generateSitemapXml = (entries: SitemapEntry[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n';
  xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n';
  xml += '        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  entries.forEach(entry => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    
    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }

    // Ajouter les images si présentes
    if (entry.images && entry.images.length > 0) {
      entry.images.forEach(image => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(image.loc)}</image:loc>\n`;
        if (image.title) {
          xml += `      <image:title>${escapeXml(image.title)}</image:title>\n`;
        }
        if (image.caption) {
          xml += `      <image:caption>${escapeXml(image.caption)}</image:caption>\n`;
        }
        xml += '    </image:image>\n';
      });
    }

    xml += '    <mobile:mobile/>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';
  return xml;
};

/**
 * Génère le fichier robots.txt avec des règles optimisées pour les moteurs de recherche
 */
export const generateRobotsTxt = (sitemapUrl: string): string => {
  return `# www.robotstxt.org/

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /auth/

# Optimisations pour Googlebot
User-agent: Googlebot
Allow: /
Disallow: /admin/
Crawl-delay: 1

# Optimisations pour Googlebot-Image
User-agent: Googlebot-Image
Allow: /
Crawl-delay: 1

# Optimisations pour Bingbot
User-agent: Bingbot
Allow: /
Disallow: /admin/
Crawl-delay: 1

# Prioritize important pages
Crawl-delay: 5

# Sitemap location
Sitemap: ${sitemapUrl}
`;
};

/**
 * Échappe les caractères spéciaux XML
 */
const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

/**
 * Cette fonction peut être utilisée pour générer un sitemap.xml dynamique
 * basé sur le contenu de votre application
 */
export const buildDynamicSitemap = async (baseUrl: string = 'https://babybaby.app'): Promise<void> => {
  // Logic to dynamically generate sitemap entries based on your content
  // Pour une implémentation réelle, vous récupéreriez des données de votre base de données
  // ou API pour construire les URLs dynamiquement
  
  const today = new Date().toISOString().split('T')[0];
  
  const entries: SitemapEntry[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
      images: [
        {
          loc: `${baseUrl}/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png`,
          title: 'BabyBaby - Application de suivi de bébé',
          caption: 'Application pour suivre le développement et la croissance de votre bébé'
        }
      ]
    },
    {
      loc: `${baseUrl}/boutique`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    // Add more entries based on your application routes
  ];

  const xmlContent = generateSitemapXml(entries);
  const robotsTxtContent = generateRobotsTxt(`${baseUrl}/sitemap.xml`);
  
  // Write files
  // Note: This would typically be done in a build script or server-side process
  // For client-side SPA, you'd need a server integration
  
  /* 
  Example server-side implementation:
  
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xmlContent);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robotsTxtContent);
  */
};
