
import React from 'react';
import NavBar from '@/components/NavBar';
import HomeContent from '@/components/home/HomeContent';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import { getWebsiteSchema, getOrganizationSchema, getProductSchema } from '@/utils/schemaUtils';

// Optimized Homepage without dashboard demo for better performance and SEO
const Index = () => {
  // Website schema structured data - enhanced for SEO
  const websiteSchema = getWebsiteSchema();
  const organizationSchema = getOrganizationSchema();
  const productSchema = getProductSchema();

  return (
    <div className="min-h-screen overflow-hidden">
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
      
      {/* Enhanced Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      
      <NavBar />
      <HomeContent />
      <Footer />
    </div>
  );
};

export default Index;
