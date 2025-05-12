
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import StrollerComparisonContent from '@/components/stroller/StrollerComparisonContent';
import { Helmet } from 'react-helmet-async';

const StrollerComparisonPage = () => {
  // HowTo structured data for the guide
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Comment choisir la meilleure poussette pour votre bébé",
    "description": "Guide complet pour choisir la poussette idéale selon vos besoins, votre style de vie et votre budget.",
    "image": {
      "@type": "ImageObject",
      "url": "/lovable-uploads/cc398d50-38b3-477d-a1a5-9ff5dd303ae8.png"
    },
    "totalTime": "PT10M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Identifiez vos besoins",
        "text": "Déterminez où vous utiliserez la poussette (ville, campagne, voyages) et si vous avez besoin d'un modèle compact ou tout-terrain.",
        "url": "https://babybaby.app/articles/meilleures-poussettes-2025#step-1"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Définissez votre budget",
        "text": "Les prix des poussettes varient considérablement, de 129$ à plus de 999$. Décidez combien vous êtes prêts à investir.",
        "url": "https://babybaby.app/articles/meilleures-poussettes-2025#step-2"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Considérez l'âge de votre bébé",
        "text": "Certaines poussettes sont adaptées dès la naissance, d'autres sont plus appropriées pour les bébés plus âgés.",
        "url": "https://babybaby.app/articles/meilleures-poussettes-2025#step-3"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Examinez les caractéristiques",
        "text": "Vérifiez la facilité de pliage, le poids, la maniabilité et les options de rangement.",
        "url": "https://babybaby.app/articles/meilleures-poussettes-2025#step-4"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Choisissez parmi les modèles recommandés",
        "text": "Basez-vous sur notre sélection des 5 meilleures poussettes pour faire un choix éclairé.",
        "url": "https://babybaby.app/articles/meilleures-poussettes-2025#step-5"
      }
    ]
  };
  
  // Breadcrumbs for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://babybaby.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Articles",
        "item": "https://babybaby.app/articles"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Meilleures Poussettes 2025",
        "item": "https://babybaby.app/articles/meilleures-poussettes-2025"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Top 5 des Meilleures Poussettes en 2025 | Comparatif Complet" 
        description="Découvrez notre comparatif complet des 5 meilleures poussettes de 2025 : performances, prix, avantages et inconvénients pour choisir la poussette idéale pour votre bébé."
        canonicalUrl="https://babybaby.app/articles/meilleures-poussettes-2025"
        ogType="article"
        keywords={["poussette", "poussette bébé", "comparatif poussettes", "meilleures poussettes 2025", "poussette légère", "poussette tout terrain"]}
        articleData={{
          publishedTime: "2025-05-11T10:00:00Z",
          modifiedTime: "2025-05-11T10:00:00Z",
          author: "BabyBaby",
          tags: ["poussette", "équipement bébé", "guide achat", "comparatif"]
        }}
      />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(howToStructuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <NavBar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6 flex justify-center">
            <img 
              src="/lovable-uploads/cc398d50-38b3-477d-a1a5-9ff5dd303ae8.png" 
              alt="Top 5 des Meilleures Poussettes en 2025" 
              className="w-full max-w-3xl rounded-lg shadow-lg" 
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800">
            Top 5 des Meilleures Poussettes en 2025 : Comparatif Complet et Recommandations
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <StrollerComparisonContent />
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StrollerComparisonPage;
