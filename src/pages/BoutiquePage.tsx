
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/common/SEOHead';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BoutiqueProductShowcase from '@/components/boutique/BoutiqueProductShowcase';
import PromoBanner from '@/components/boutique/PromoBanner';
import FeaturedCategories from '@/components/boutique/FeaturedCategories';
import ProductsSection from '@/components/products/ProductsSection';

const BoutiquePage: React.FC = () => {
  useEffect(() => {
    // Redirect to boutique domain after 3 seconds (allows search engines to index this page)
    const redirectTimer = setTimeout(() => {
      window.location.href = 'https://babybaby.boutique';
    }, 3000);
    
    return () => clearTimeout(redirectTimer);
  }, []);
  
  const alternateLanguages = [
    { lang: "fr", url: "https://babybaby.app/boutique" },
    { lang: "fr-FR", url: "https://babybaby.app/boutique" }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Boutique BabyBaby | Produits pour bébés et parents"
        description="Découvrez notre sélection de produits premium pour bébés et parents. Accessoires, vêtements, jouets et plus encore pour accompagner votre aventure parentale."
        canonicalUrl="https://babybaby.app/boutique"
        alternateLanguages={alternateLanguages}
        keywords={["boutique bébé", "produits parentalité", "accessoires bébé", "vêtements enfant", "jouets éducatifs"]}
      />
      
      <Helmet>
        <link rel="canonical" href="https://babybaby.app/boutique" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Boutique BabyBaby",
            "description": "Boutique en ligne de produits pour bébés et parents",
            "url": "https://babybaby.app/boutique",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accessoires bébé",
                  "url": "https://babybaby.boutique/categories/accessoires"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Vêtements",
                  "url": "https://babybaby.boutique/categories/vetements"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Jouets",
                  "url": "https://babybaby.boutique/categories/jouets"
                }
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "BabyBaby",
              "url": "https://babybaby.app"
            }
          })}
        </script>
      </Helmet>
      
      <NavBar />
      
      <main className="flex-1 flex flex-col w-full bg-gradient-to-b from-white to-sky-50">
        <BoutiqueProductShowcase />
        
        <PromoBanner />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-babybaby-cosmic mb-6">
              Bienvenue à la boutique BabyBaby
            </h1>
            
            <p className="text-gray-700 text-lg mb-8 max-w-3xl mx-auto">
              Vous allez être redirigé vers notre boutique en ligne dans quelques secondes.
              En attendant, découvrez notre sélection de produits premium.
            </p>
            
            <div className="flex justify-center mb-12">
              <div className="animate-pulse bg-babybaby-cosmic h-2 w-64 rounded-full"></div>
            </div>
            
            <a 
              href="https://babybaby.boutique" 
              className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 text-white px-8 py-3 rounded-full font-medium transition-colors inline-block"
            >
              Accéder maintenant à la boutique
            </a>
          </div>
          
          <FeaturedCategories />
        </div>
        
        <ProductsSection />
        
        <div className="container mx-auto px-4 py-12">
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
