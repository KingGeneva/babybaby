
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/common/SEOHead';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HreflangTags from '@/components/seo/HreflangTags';
import { Badge } from '@/components/ui/badge';

const BoutiquePage: React.FC = () => {
  // Redirection désactivée car le domaine babybaby.boutique n'est pas accessible
  
  // Configuration avancée des langues alternatives pour la boutique
  const alternateLanguages = [
    { lang: "fr-CA", url: "https://babybaby.org/boutique" },
    { lang: "fr-FR", url: "https://babybaby.org/boutique" },
    { lang: "fr", url: "https://babybaby.org/boutique" },
    { lang: "fr-BE", url: "https://babybaby.org/boutique" },
    { lang: "fr-CH", url: "https://babybaby.org/boutique" }
  ];

  // Structured data for BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://babybaby.org/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Boutique",
        "item": "https://babybaby.org/boutique"
      }
    ]
  };
  
  // Enhanced organization schema with more properties
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BabyBaby Boutique",
    "url": "https://babybaby.boutique",
    "logo": "https://babybaby.org/__l5e/assets-v1/7f28394d-9670-4734-b87e-6cc9cc307285/logo-babybaby.png",
    "description": "Boutique en ligne de produits premium pour bébés et parents.",
    "sameAs": [
      "https://facebook.com/babybaby",
      "https://instagram.com/babybaby_app",
      "https://twitter.com/babybaby_app"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-581-333-3173",
      "contactType": "customer service",
      "availableLanguage": ["French"]
    }
  };

  // Schema for WebSite
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BabyBaby Boutique",
    "url": "https://babybaby.boutique",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://babybaby.boutique/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Store information schema
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "BabyBaby Boutique",
    "description": "Boutique en ligne de produits premium pour bébés et parents",
    "url": "https://babybaby.boutique",
    "logo": "https://babybaby.org/__l5e/assets-v1/7f28394d-9670-4734-b87e-6cc9cc307285/logo-babybaby.png",
    "image": "https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png",
    "telephone": "+1-581-333-3173",
    "priceRange": "€€",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "acceptsReservations": false,
    "paymentAccepted": "Credit Card, PayPal",
    "currenciesAccepted": "EUR"
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Boutique BabyBaby | Produits Premium pour bébés et parents"
        description="Découvrez notre sélection exclusive de produits de haute qualité pour bébés et parents. Accessoires, vêtements bio, jouets éducatifs et plus encore pour un quotidien plus serein."
        canonicalUrl="https://babybaby.org/boutique"
        alternateLanguages={alternateLanguages}
        keywords={["boutique bébé", "produits parentalité bio", "accessoires bébé premium", "vêtements enfant bio", "jouets éducatifs montessori", "produits puériculture"]}
        ogImage="https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
      />
      
      {/* Utilisation du composant HreflangTags pour une gestion centralisée */}
      <HreflangTags
        currentLang="fr"
        currentUrl="https://babybaby.org/boutique"
        alternateLanguages={alternateLanguages}
      />
      
      <Helmet>
        <link rel="canonical" href="https://babybaby.org/boutique" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* DNS Prefetch et Preconnect optimisés */}
        <link rel="preconnect" href="https://babybaby.boutique" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://babybaby.boutique" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        
        {/* Schema.org améliorés */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Boutique BabyBaby",
            "description": "Boutique en ligne de produits premium pour bébés et parents",
            "url": "https://babybaby.org/boutique",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accessoires bébé premium",
                  "url": "https://babybaby.boutique/categories/accessoires",
                  "image": "https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Vêtements bio",
                  "url": "https://babybaby.boutique/categories/vetements",
                  "image": "https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Jouets Montessori",
                  "url": "https://babybaby.boutique/categories/jouets",
                  "image": "https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Puériculture naturelle",
                  "url": "https://babybaby.boutique/categories/puericulture",
                  "image": "https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
                }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "BabyBaby",
              "url": "https://babybaby.org"
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", ".product-description"]
            },
            "breadcrumb": breadcrumbSchema
          })}
        </script>
        
        {/* Schéma d'organisation */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        
        {/* Schéma de site web */}
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        
        {/* Schéma de magasin */}
        <script type="application/ld+json">
          {JSON.stringify(storeSchema)}
        </script>
      </Helmet>
      
      <NavBar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-white to-sky-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-babybaby-cosmic mb-6" id="main-heading">
            Bienvenue à la boutique BabyBaby
          </h1>
          
          <div className="flex items-center justify-center mb-4">
            <Badge variant="success" className="text-sm">Boutique Officielle</Badge>
          </div>
          
          <p className="text-gray-700 text-lg mb-8">
            Notre boutique en ligne sera bientôt disponible. Restez connectés!
          </p>
          
          <div className="flex justify-center mb-12">
            <div className="bg-babybaby-cosmic/20 h-2 w-64 rounded-full" 
                 role="progressbar" 
                 aria-label="Boutique en préparation" 
                 aria-valuenow={0} 
                 aria-valuemin={0} 
                 aria-valuemax={100}></div>
          </div>
          
          <div className="text-muted-foreground text-sm">
            La boutique BabyBaby est actuellement en construction
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up">
              <h2 className="text-xl font-semibold mb-3">Produits de qualité premium</h2>
              <p className="text-gray-600">Tous nos produits sont soigneusement sélectionnés pour leur qualité exceptionnelle et leur sécurité optimale.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="100">
              <h2 className="text-xl font-semibold mb-3">Livraison rapide offerte</h2>
              <p className="text-gray-600">Livraison rapide partout au Canada, expédition depuis le Québec.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-xl font-semibold mb-3">Service client premium</h2>
              <p className="text-gray-600">Notre équipe d'experts est disponible 7j/7 pour répondre à toutes vos questions et vous accompagner.</p>
            </div>
          </div>
          
          {/* Section avec mots-clés SEO naturellement intégrés */}
          <div className="mt-12 text-sm text-gray-500 max-w-2xl mx-auto">
            <p className="mb-2">
              Découvrez notre sélection de produits de puériculture bio et éco-responsables. Notre boutique en ligne propose des accessoires pour bébé haut de gamme, des vêtements bio pour enfants et des jouets Montessori conçus pour le développement optimal de votre enfant.
            </p>
            <p>
              BabyBaby, votre partenaire de confiance pour tous les produits essentiels de la grossesse aux premiers pas de votre enfant.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BoutiquePage;
