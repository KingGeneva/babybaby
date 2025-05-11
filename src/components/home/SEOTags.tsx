
import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import WebsiteSchema from './WebsiteSchema';
import OrganizationSchema from './OrganizationSchema';
import ProductSchema from './ProductSchema';

const SEOTags: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="BabyBaby - Application de suivi de bébé | Santé, Croissance et Développement" 
        description="BabyBaby : L'application complète pour les parents modernes. Suivez la croissance, la santé et le développement de votre bébé avec des outils innovants. Conseils d'experts et communauté bienveillante."
        canonicalUrl="https://babybaby.app"
        keywords={[
          "suivi bébé", "application bébé", "croissance infantile", "santé bébé", 
          "développement enfant", "conseil parental", "outils parents", 
          "carnet santé numérique", "milestones bébé", "courbe croissance"
        ]}
      />
      
      <WebsiteSchema />
      <OrganizationSchema />
      <ProductSchema />
    </>
  );
};

export default SEOTags;
