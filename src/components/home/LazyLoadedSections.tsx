
import React, { Suspense, lazy, ComponentType } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Standard lazy loading
const Dashboard = lazy(() => import('@/components/dashboard/Dashboard'));
const TestimonialsCarousel = lazy(() => import('@/components/testimonials/TestimonialsCarousel'));
const ArticleSection = lazy(() => import('@/components/articles/ArticleSection'));
const Footer = lazy(() => import('@/components/Footer'));

// Type for delayed lazy loading
type LazyComponentType = Promise<{ default: ComponentType<any> }>;

// Lazy loading with delay for lower priority sections
// Using the correct pattern for lazy loading with delays
const EbooksSection = lazy((): LazyComponentType => {
  return new Promise(resolve => {
    setTimeout(() => {
      import('@/components/ebooks/EbooksSection')
        .then(module => {
          resolve({ default: module.default });
        });
    }, 1000);
  });
});

const PartnersCarousel = lazy((): LazyComponentType => {
  return new Promise(resolve => {
    setTimeout(() => {
      import('@/components/partners/PartnersCarousel')
        .then(module => {
          resolve({ default: module.default });
        });
    }, 1500);
  });
});

const ProductsSection = lazy((): LazyComponentType => {
  return new Promise(resolve => {
    setTimeout(() => {
      import('@/components/products/ProductsSection')
        .then(module => {
          resolve({ default: module.default });
        });
    }, 2000);
  });
});

const ToolsSection = lazy((): LazyComponentType => {
  return new Promise(resolve => {
    setTimeout(() => {
      import('@/components/tools/ToolsSection')
        .then(module => {
          resolve({ default: module.default });
        });
    }, 2500);
  });
});

// Réintégration du module de cours
const CoursesSection = lazy((): LazyComponentType => {
  return new Promise(resolve => {
    setTimeout(() => {
      import('@/components/courses/CoursesSection')
        .then(module => {
          resolve({ default: module.default });
        });
    }, 1800);
  });
});

// Sections les moins critiques chargées en dernier
const ContactSection = lazy((): LazyComponentType => {
  return new Promise(resolve => {
    setTimeout(() => {
      import('@/components/ContactSection')
        .then(module => {
          resolve({ default: module.default });
        });
    }, 3000);
  });
});

const NewsletterForm = lazy((): LazyComponentType => {
  return new Promise(resolve => {
    setTimeout(() => {
      import('@/components/NewsletterForm')
        .then(module => {
          resolve({ default: module.default });
        });
    }, 3500);
  });
});

// Fallback loaders optimisés
const SectionLoader = () => (
  <div className="py-6 flex justify-center items-center">
    <div className="animate-pulse w-full max-w-2xl h-16 bg-gray-100 rounded-lg"></div>
  </div>
);

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
      <Suspense fallback={<SectionLoader />}>
        <div className="pt-24 relative">
          <Dashboard 
            childId={childProfileId || 'demo'} 
            demoMode={!isAuthenticated} 
            demoData={demoGrowthData} 
            showDevelopmentSection={showDevelopmentSection}
          />
        </div>
      </Suspense>

      {/* Témoignages - Priorité 2 */}
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsCarousel />
      </Suspense>

      {/* Articles - Priorité 2 */}
      <Suspense fallback={<SectionLoader />}>
        <ArticleSection />
      </Suspense>

      {/* Contenu mobile uniquement si sur mobile */}
      {!isMobile && (
        <>
          {/* Partenaires - Priorité 3 */}
          <Suspense fallback={<SectionLoader />}>
            <PartnersCarousel />
          </Suspense>
          
          {/* Produits - Priorité 3 */}
          <Suspense fallback={<SectionLoader />}>
            <ProductsSection />
          </Suspense>
        </>
      )}
      
      {/* Section ebooks - Priorité 3 */}
      <Suspense fallback={<SectionLoader />}>
        <EbooksSection />
      </Suspense>
      
      {/* Section cours - Priorité 3 (réintégrée) */}
      <Suspense fallback={<SectionLoader />}>
        <CoursesSection />
      </Suspense>
      
      {/* Contenu basse priorité - uniquement sur desktop ou si défilement */}
      {!isMobile && (
        <>
          {/* Outils - Priorité 4 */}
          <Suspense fallback={<SectionLoader />}>
            <ToolsSection />
          </Suspense>
          
          {/* Contact - Priorité 5 */}
          <Suspense fallback={<SectionLoader />}>
            <ContactSection />
          </Suspense>
        </>
      )}
      
      {/* Newsletter - Priorité basse mais toujours présente */}
      <Suspense fallback={<div className="h-16 bg-gray-50"></div>}>
        <NewsletterForm />
      </Suspense>
      
      {/* Footer - Toujours présent */}
      <Suspense fallback={<div className="h-16 bg-gray-50"></div>}>
        <Footer />
      </Suspense>
    </>
  );
};

export default LazyLoadedSections;
