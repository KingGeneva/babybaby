
import React, { Suspense, lazy } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

// Lazy loading components
const Dashboard = lazy(() => import('@/components/dashboard/Dashboard'));
const TestimonialsCarousel = lazy(() => import('@/components/testimonials/TestimonialsCarousel'));
const PartnersCarousel = lazy(() => import('@/components/partners/PartnersCarousel'));
const EbooksSection = lazy(() => import('@/components/ebooks/EbooksSection'));
const ArticleSection = lazy(() => import('@/components/articles/ArticleSection'));
const ProductsSection = lazy(() => import('@/components/products/ProductsSection'));
const ToolsSection = lazy(() => import('@/components/tools/ToolsSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const NewsletterForm = lazy(() => import('@/components/NewsletterForm'));
const Footer = lazy(() => import('@/components/Footer'));

// Fallback loader for loading sections
const SectionLoader = () => (
  <div className="py-6 flex justify-center items-center">
    <div className="animate-pulse w-full max-w-2xl h-24 bg-gray-100 rounded-lg"></div>
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
}

const LazyLoadedSections: React.FC<LazyLoadedSectionsProps> = ({ 
  demoGrowthData, 
  isLoading = false,
  isAuthenticated = false,
  childProfileId
}) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* Dashboard Section */}
      <Suspense fallback={<SectionLoader />}>
        <div className="pt-24 relative">
          <Dashboard demoMode={!isAuthenticated} demoData={demoGrowthData} childId={childProfileId} />
        </div>
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsCarousel />
      </Suspense>

      {/* Section des articles */}
      <Suspense fallback={<SectionLoader />}>
        <ArticleSection />
      </Suspense>

      {/* Section des partenaires */}
      <Suspense fallback={<SectionLoader />}>
        <PartnersCarousel />
      </Suspense>
      
      {/* Sections moins prioritaires avec chargement conditionnel */}
      <Suspense fallback={<SectionLoader />}>
        <ProductsSection />
      </Suspense>
      
      {/* Section ebooks */}
      <Suspense fallback={<SectionLoader />}>
        <EbooksSection />
      </Suspense>
      
      {/* Section outils */}
      <Suspense fallback={isMobile ? null : <SectionLoader />}>
        <ToolsSection />
      </Suspense>
      
      {/* Sections à faible priorité */}
      <Suspense fallback={isMobile ? null : <SectionLoader />}>
        <ContactSection />
      </Suspense>
      
      {/* Newsletter avec loader minimal */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <Suspense fallback={<div className="h-16 animate-pulse bg-gray-100 rounded-lg"></div>}>
              <NewsletterForm />
            </Suspense>
          </div>
        </div>
      </section>
      
      <Suspense fallback={<div className="h-16 bg-gray-50"></div>}>
        <Footer />
      </Suspense>
    </>
  );
};

export default LazyLoadedSections;
