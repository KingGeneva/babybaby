
import React, { useEffect } from 'react';
import SEOHead from '@/components/common/SEOHead';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BoutiqueContent from '@/components/boutique/BoutiqueContent';

const BoutiquePage: React.FC = () => {
  const alternateLanguages = [
    { lang: "fr", url: "https://babybaby.app/boutique" },
    { lang: "fr-FR", url: "https://babybaby.app/boutique" }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Boutique BabyBaby | Produits Premium pour Bébés"
        description="Découvrez notre collection exclusive de produits haut de gamme pour bébés. Accessoires, vêtements, poussettes et plus encore pour accompagner votre parentalité avec style et confort."
        canonicalUrl="https://babybaby.app/boutique"
        alternateLanguages={alternateLanguages}
        keywords={["boutique premium bébé", "produits haut de gamme bébé", "accessoires luxe bébé", "poussette design", "cadeaux naissance"]}
        ogImage="https://babybaby.app/lovable-uploads/c872500f-5877-4395-bb3c-089e296bf56b.png"
      />
      
      <NavBar />
      
      <main className="flex-1 flex flex-col">
        <BoutiqueContent />
      </main>
      
      <Footer />
    </div>
  );
};

export default BoutiquePage;
