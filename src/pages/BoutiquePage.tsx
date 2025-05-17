
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/common/SEOHead';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const BoutiquePage: React.FC = () => {
  useEffect(() => {
    // Redirect to boutique domain after 3 seconds (allows search engines to index this page)
    const redirectTimer = setTimeout(() => {
      window.location.href = 'https://babybaby.boutique';
    }, 3000);
    
    return () => clearTimeout(redirectTimer);
  }, []);
  
  const alternateLanguages = [
    { lang: "fr", url: "https://babybaby.org/boutique" },
    { lang: "fr-FR", url: "https://babybaby.org/boutique" },
    { lang: "en", url: "https://babybaby.org/en/boutique" },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Boutique BabyBaby | Produits pour bébés et parents"
        description="Découvrez notre sélection de produits premium pour bébés et parents. Accessoires, vêtements, jouets et plus encore pour accompagner votre aventure parentale."
        canonicalUrl="https://babybaby.org/boutique"
        alternateLanguages={alternateLanguages}
        keywords={["boutique bébé", "produits parentalité", "accessoires bébé", "vêtements enfant", "jouets éducatifs", "puériculture", "boutique en ligne bébé"]}
      />
      
      <Helmet>
        <link rel="canonical" href="https://babybaby.org/boutique" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Boutique BabyBaby",
            "description": "Boutique en ligne de produits pour bébés et parents",
            "url": "https://babybaby.org/boutique",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accessoires bébé",
                  "url": "https://babybaby.boutique/categories/accessoires",
                  "image": "https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Vêtements",
                  "url": "https://babybaby.boutique/categories/vetements",
                  "image": "https://babybaby.org/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Jouets",
                  "url": "https://babybaby.boutique/categories/jouets",
                  "image": "https://babybaby.org/lovable-uploads/e7c9766d-1027-49c9-a9f7-1ac07f49b8b9.png"
                }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "BabyBaby",
              "url": "https://babybaby.org"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accueil",
                  "item": "https://babybaby.org"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Boutique",
                  "item": "https://babybaby.org/boutique"
                }
              ]
            }
          })}
        </script>
        <link rel="alternate" href="https://babybaby.boutique" />
      </Helmet>
      
      <NavBar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-white to-sky-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-babybaby-cosmic mb-6">
            Bienvenue à la boutique BabyBaby
          </h1>
          
          <p className="text-gray-700 text-lg mb-8">
            Vous allez être redirigé vers notre boutique en ligne dans quelques secondes...
          </p>
          
          <div className="flex justify-center mb-12">
            <div className="animate-pulse bg-babybaby-cosmic h-2 w-64 rounded-full"></div>
          </div>
          
          <a 
            href="https://babybaby.boutique" 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 text-white px-8 py-3 rounded-full font-medium transition-colors inline-block"
            rel="noopener"
          >
            Accéder maintenant à la boutique
          </a>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Produits de qualité</h3>
              <p className="text-gray-600">Tous nos produits sont soigneusement sélectionnés pour leur qualité et leur sécurité.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Livraison rapide</h3>
              <p className="text-gray-600">Profitez d'une livraison rapide pour recevoir vos articles en quelques jours.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Service client</h3>
              <p className="text-gray-600">Notre équipe est disponible pour répondre à toutes vos questions.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BoutiquePage;
