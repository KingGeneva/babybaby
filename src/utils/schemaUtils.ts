
// Schema structured data for SEO

export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BabyBaby",
  "url": "https://babybaby.app",
  "description": "Application complète pour le suivi de santé et développement de bébé. Outils, conseils et communauté pour parents.",
  "keywords": "suivi bébé, santé bébé, développement enfant, croissance bébé, conseils parents",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://babybaby.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BabyBaby",
  "url": "https://babybaby.app",
  "logo": "https://lovable.dev/opengraph-image-p98pqg.png",
  "description": "Plateforme leader pour le suivi de développement et santé infantile",
  "sameAs": [
    "https://facebook.com/babybaby",
    "https://twitter.com/babybaby_app",
    "https://instagram.com/babybaby_app"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "contact@babybaby.app"
  }
});

export const getProductSchema = () => ({
  "@context": "https://schema.org/",
  "@type": "SoftwareApplication",
  "name": "BabyBaby App",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  }
});
