
import React, { Suspense } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Dashboard from '@/components/dashboard/Dashboard';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import PartnersCarousel from '@/components/partners/PartnersCarousel';
import EbooksSection from '@/components/ebooks/EbooksSection';
import ArticleSection from '@/components/articles/ArticleSection';
import ProductsSection from '@/components/products/ProductsSection';
import ToolsSection from '@/components/tools/ToolsSection';
import ContactSection from '@/components/ContactSection';
import NewsletterForm from '@/components/NewsletterForm';
import Footer from '@/components/Footer';

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
