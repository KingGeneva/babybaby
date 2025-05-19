
/**
 * Utilitaire pour audit SEO et recommandations automatisées
 * Fonctionne côté client pour analyser le DOM et suggérer des améliorations SEO
 */

interface SEOAuditResult {
  passed: boolean;
  message: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  element?: string;
  value?: string;
  recommendation?: string;
}

/**
 * Effectue un audit SEO complet de la page
 */
export const runSEOAudit = (): SEOAuditResult[] => {
  const results: SEOAuditResult[] = [];
  
  // Vérifier le titre
  const title = document.title;
  if (!title || title.length < 10) {
    results.push({
      passed: false,
      message: 'Le titre de la page est absent ou trop court',
      importance: 'critical',
      element: 'title',
      value: title,
      recommendation: 'Ajoutez un titre descriptif entre 50 et 60 caractères'
    });
  } else if (title.length > 60) {
    results.push({
      passed: false,
      message: 'Le titre de la page est trop long',
      importance: 'medium',
      element: 'title',
      value: title,
      recommendation: 'Réduisez le titre à 60 caractères ou moins'
    });
  } else {
    results.push({
      passed: true,
      message: 'Le titre de la page est bien optimisé',
      importance: 'high',
      element: 'title',
      value: title
    });
  }
  
  // Vérifier la méta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    results.push({
      passed: false,
      message: 'La méta description est absente',
      importance: 'critical',
      element: 'meta[name="description"]',
      recommendation: 'Ajoutez une méta description entre 120 et 160 caractères'
    });
  } else {
    const content = metaDesc.getAttribute('content') || '';
    if (content.length < 120) {
      results.push({
        passed: false,
        message: 'La méta description est trop courte',
        importance: 'high',
        element: 'meta[name="description"]',
        value: content,
        recommendation: 'Allongez la méta description à au moins 120 caractères'
      });
    } else if (content.length > 160) {
      results.push({
        passed: false,
        message: 'La méta description est trop longue',
        importance: 'medium',
        element: 'meta[name="description"]',
        value: content,
        recommendation: 'Réduisez la méta description à 160 caractères ou moins'
      });
    } else {
      results.push({
        passed: true,
        message: 'La méta description est bien optimisée',
        importance: 'high',
        element: 'meta[name="description"]',
        value: content
      });
    }
  }
  
  // Vérifier la présence de balises H1
  const h1Elements = document.querySelectorAll('h1');
  if (h1Elements.length === 0) {
    results.push({
      passed: false,
      message: 'Aucune balise H1 n\'a été trouvée',
      importance: 'critical',
      element: 'h1',
      recommendation: 'Ajoutez une balise H1 principale à la page'
    });
  } else if (h1Elements.length > 1) {
    results.push({
      passed: false,
      message: 'Plusieurs balises H1 ont été trouvées',
      importance: 'high',
      element: 'h1',
      value: `${h1Elements.length} balises H1`,
      recommendation: 'Utilisez une seule balise H1 principale'
    });
  } else {
    results.push({
      passed: true,
      message: 'La balise H1 est correctement utilisée',
      importance: 'high',
      element: 'h1',
      value: h1Elements[0].textContent || ''
    });
  }
  
  // Vérifier la présence d'URL canonique
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    results.push({
      passed: false,
      message: 'Pas d\'URL canonique définie',
      importance: 'high',
      element: 'link[rel="canonical"]',
      recommendation: 'Ajoutez une balise link avec l\'attribut rel="canonical"'
    });
  } else {
    results.push({
      passed: true,
      message: 'URL canonique correctement définie',
      importance: 'high',
      element: 'link[rel="canonical"]',
      value: canonical.getAttribute('href') || ''
    });
  }
  
  // Vérifier la présence de données structurées
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  if (structuredData.length === 0) {
    results.push({
      passed: false,
      message: 'Aucune donnée structurée (Schema.org) trouvée',
      importance: 'high',
      element: 'script[type="application/ld+json"]',
      recommendation: 'Ajoutez des données structurées appropriées pour votre contenu'
    });
  } else {
    results.push({
      passed: true,
      message: `${structuredData.length} blocs de données structurées trouvés`,
      importance: 'high',
      element: 'script[type="application/ld+json"]'
    });
  }
  
  // Vérifier les images sans attribut alt
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
  if (imagesWithoutAlt.length > 0) {
    results.push({
      passed: false,
      message: `${imagesWithoutAlt.length} images sans attribut alt`,
      importance: 'high',
      element: 'img',
      recommendation: 'Ajoutez des attributs alt descriptifs à toutes les images'
    });
  } else if (images.length > 0) {
    results.push({
      passed: true,
      message: 'Toutes les images ont des attributs alt',
      importance: 'high',
      element: 'img'
    });
  }
  
  // Vérifier les liens sans texte descriptif
  const links = document.querySelectorAll('a');
  const emptyLinks = Array.from(links).filter(link => {
    const text = link.textContent?.trim() || '';
    const hasImage = link.querySelector('img');
    const ariaLabel = link.getAttribute('aria-label');
    return text === '' && !hasImage && !ariaLabel;
  });
  
  if (emptyLinks.length > 0) {
    results.push({
      passed: false,
      message: `${emptyLinks.length} liens sans texte descriptif`,
      importance: 'medium',
      element: 'a',
      recommendation: 'Ajoutez du texte descriptif ou un attribut aria-label à tous les liens'
    });
  } else {
    results.push({
      passed: true,
      message: 'Tous les liens ont du texte descriptif',
      importance: 'medium',
      element: 'a'
    });
  }
  
  return results;
};

/**
 * Analyse si la page utilise correctement les mots-clés
 */
export const analyzeKeywordUsage = (keyword: string): SEOAuditResult[] => {
  const results: SEOAuditResult[] = [];
  const content = document.body.textContent || '';
  const lowerContent = content.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  // Compter les occurrences
  const occurrences = (lowerContent.match(new RegExp(lowerKeyword, 'g')) || []).length;
  const wordCount = content.split(/\s+/).length;
  const keywordDensity = (occurrences / wordCount) * 100;
  
  // Vérifier la densité de mots-clés
  if (keywordDensity < 0.5) {
    results.push({
      passed: false,
      message: `Densité du mot-clé "${keyword}" faible: ${keywordDensity.toFixed(2)}%`,
      importance: 'medium',
      value: `${occurrences} occurrences dans ${wordCount} mots`,
      recommendation: `Augmentez la présence du mot-clé "${keyword}" dans votre contenu`
    });
  } else if (keywordDensity > 3) {
    results.push({
      passed: false,
      message: `Densité du mot-clé "${keyword}" trop élevée: ${keywordDensity.toFixed(2)}%`,
      importance: 'medium',
      value: `${occurrences} occurrences dans ${wordCount} mots`,
      recommendation: `Réduisez la présence du mot-clé "${keyword}" pour éviter le bourrage de mots-clés`
    });
  } else {
    results.push({
      passed: true,
      message: `Densité du mot-clé "${keyword}" optimale: ${keywordDensity.toFixed(2)}%`,
      importance: 'medium',
      value: `${occurrences} occurrences dans ${wordCount} mots`
    });
  }
  
  // Vérifier la présence du mot-clé dans le titre
  const titleContent = document.title.toLowerCase();
  if (titleContent.includes(lowerKeyword)) {
    results.push({
      passed: true,
      message: `Le mot-clé "${keyword}" est présent dans le titre`,
      importance: 'high',
      element: 'title'
    });
  } else {
    results.push({
      passed: false,
      message: `Le mot-clé "${keyword}" n'est pas présent dans le titre`,
      importance: 'high',
      element: 'title',
      recommendation: `Incluez le mot-clé "${keyword}" dans le titre`
    });
  }
  
  // Vérifier la présence du mot-clé dans les balises H1, H2
  const h1 = document.querySelector('h1');
  if (h1 && h1.textContent && h1.textContent.toLowerCase().includes(lowerKeyword)) {
    results.push({
      passed: true,
      message: `Le mot-clé "${keyword}" est présent dans la balise H1`,
      importance: 'high',
      element: 'h1'
    });
  } else if (h1) {
    results.push({
      passed: false,
      message: `Le mot-clé "${keyword}" n'est pas présent dans la balise H1`,
      importance: 'high',
      element: 'h1',
      recommendation: `Incluez le mot-clé "${keyword}" dans la balise H1`
    });
  }
  
  // Vérifier la présence du mot-clé dans la méta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const content = metaDesc.getAttribute('content') || '';
    if (content.toLowerCase().includes(lowerKeyword)) {
      results.push({
        passed: true,
        message: `Le mot-clé "${keyword}" est présent dans la méta description`,
        importance: 'high',
        element: 'meta[name="description"]'
      });
    } else {
      results.push({
        passed: false,
        message: `Le mot-clé "${keyword}" n'est pas présent dans la méta description`,
        importance: 'high',
        element: 'meta[name="description"]',
        recommendation: `Incluez le mot-clé "${keyword}" dans la méta description`
      });
    }
  }
  
  return results;
};

/**
 * Vérifie la conformité aux Core Web Vitals
 */
export const checkCoreWebVitals = async (): Promise<SEOAuditResult[]> => {
  const results: SEOAuditResult[] = [];
  
  // Cette fonction est donnée à titre d'exemple, en réalité l'implémentation
  // complète nécessiterait l'utilisation de l'API Web Vitals ou des mesures côté serveur

  // Exemple simplifié pour démonstration
  const lcpElement = document.querySelector('img, video, svg, canvas');
  if (!lcpElement) {
    results.push({
      passed: false,
      message: "Aucun élément LCP potentiel détecté",
      importance: "high",
      recommendation: "Assurez-vous que votre page contient une image, vidéo ou contenu visible principal"
    });
  }
  
  // Vérifiez si les ressources critiques sont préchargées
  const preloads = document.querySelectorAll('link[rel="preload"]');
  if (preloads.length < 2) {
    results.push({
      passed: false,
      message: "Peu de ressources critiques sont préchargées",
      importance: "medium",
      recommendation: "Utilisez <link rel=\"preload\"> pour précharger les ressources critiques comme les polices, CSS et JavaScript essentiels"
    });
  } else {
    results.push({
      passed: true,
      message: `${preloads.length} ressources critiques sont préchargées`,
      importance: "medium"
    });
  }
  
  return results;
};

/**
 * Lance un audit SEO complet et suggère des améliorations
 */
export const runFullSEOAudit = async (keywords: string[] = []): Promise<{
  score: number;
  results: SEOAuditResult[];
}> => {
  const baseResults = runSEOAudit();
  let keywordResults: SEOAuditResult[] = [];
  
  // Analyser l'utilisation des mots-clés si fournis
  keywords.forEach(keyword => {
    keywordResults = [...keywordResults, ...analyzeKeywordUsage(keyword)];
  });
  
  // Vérifier les Core Web Vitals
  const webVitalsResults = await checkCoreWebVitals();
  
  // Combiner tous les résultats
  const allResults = [...baseResults, ...keywordResults, ...webVitalsResults];
  
  // Calculer un score approximatif
  const passedTests = allResults.filter(result => result.passed).length;
  const totalTests = allResults.length;
  const score = Math.round((passedTests / totalTests) * 100);
  
  return {
    score,
    results: allResults
  };
};

// Export de fonctions utilitaires pour être utilisées directement dans les composants React
export default {
  runSEOAudit,
  analyzeKeywordUsage,
  checkCoreWebVitals,
  runFullSEOAudit
};
