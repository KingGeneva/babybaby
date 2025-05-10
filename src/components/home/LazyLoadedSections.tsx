
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LazySection, 
  SectionLoader,
  Dashboard,
  TestimonialsCarousel,
  ArticleSection,
  Footer,
  EbooksSection,
  PartnersCarousel,
  CoursesSection,
  ProductsSection,
  ToolsSection,
  ContactSection,
  NewsletterForm
} from './lazy';

interface LazyLoadedSectionsProps {
  demoGrowthData: Array<{
    name: string;
    taille: number;
    poids: number;
    eveil?: number;
  }>;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  childProfileId?: string;
  showDevelopmentSection?: boolean;
}

const LazyLoadedSections: React.FC<LazyLoadedSectionsProps> = ({ 
  demoGrowthData, 
  isLoading = false,
  isAuthenticated = false,
  childProfileId,
  showDevelopmentSection = true
}) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* Dashboard Section - Priorité 1 */}
      <LazySection 
        Component={Dashboard} 
        childId={childProfileId || 'demo'} 
        demoMode={!isAuthenticated} 
        demoData={demoGrowthData} 
        showDevelopmentSection={showDevelopmentSection}
      />

      {/* Témoignages - Priorité 2 */}
      <LazySection Component={TestimonialsCarousel} />

      {/* Articles - Priorité 2 */}
      <LazySection Component={ArticleSection} />

      {/* Contenu mobile uniquement si sur mobile */}
      {!isMobile && (
        <>
          {/* Partenaires - Priorité 3 */}
          <LazySection Component={PartnersCarousel} />
          
          {/* Produits - Priorité 3 */}
          <LazySection Component={ProductsSection} />
        </>
      )}
      
      {/* Section ebooks - Priorité 3 */}
      <LazySection Component={EbooksSection} />
      
      {/* Section cours - Priorité 3 */}
      <LazySection Component={CoursesSection} />
      
      {/* Contenu basse priorité - uniquement sur desktop ou si défilement */}
      {!isMobile && (
        <>
          {/* Outils - Priorité 4 */}
          <LazySection Component={ToolsSection} />
          
          {/* Contact - Priorité 5 */}
          <LazySection Component={ContactSection} />
        </>
      )}
      
      {/* Newsletter - Priorité basse mais toujours présente */}
      <LazySection 
        Component={NewsletterForm} 
        fallback={<div className="h-16 bg-gray-50"></div>}
      />
      
      {/* Footer - Toujours présent */}
      <LazySection 
        Component={Footer} 
        fallback={<div className="h-16 bg-gray-50"></div>}
      />
    </>
  );
};

export default LazyLoadedSections;
