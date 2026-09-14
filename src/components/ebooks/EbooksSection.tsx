
import React, { useState } from 'react';
import { Book, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { Ebook } from './types';
import { ebooksData } from './ebooksData';
import { downloadEbook } from './ebookService';
import EbookCard from './EbookCard';
import EbookCarouselControls from './EbookCarouselControls';

const EbooksSection: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ebooks, setEbooks] = useState<Ebook[]>(ebooksData);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = isMobile ? 1 : 3;
  
  const totalPages = Math.ceil(ebooks.length / itemsPerPage);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + itemsPerPage) >= ebooks.length 
        ? 0 
        : prevIndex + itemsPerPage
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - itemsPerPage) < 0 
        ? Math.max(0, ebooks.length - itemsPerPage) 
        : prevIndex - itemsPerPage
    );
  };

  const goToPage = (pageIndex: number) => {
    setCurrentIndex(pageIndex * itemsPerPage);
  };
  
  const visibleEbooks = ebooks.slice(currentIndex, currentIndex + itemsPerPage);
  
  const handleDownload = async (ebook: Ebook) => {
    setIsLoading(true);
    await downloadEbook(ebook);
    setIsLoading(false);
  };
  
  return (
    <section className="editorial-section library-section">
      <div className="container mx-auto px-5 md:px-8">
        <div
          className="editorial-heading editorial-heading-row"
          data-reveal
        >
          <div><p className="section-kicker"><Book className="inline h-4 w-4 mr-2" />La petite bibliothèque</p><h2 className="section-title">Des guides à garder près de soi.</h2></div>
          <p className="section-intro">Des ressources gratuites à consulter à votre rythme, de la grossesse aux premières années.</p>
        </div>

        <div className="relative">
          <EbookCarouselControls 
            currentIndex={currentIndex}
            totalPages={totalPages}
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            goToPage={goToPage}
          />

          <div
            className="library-grid"
          >
            {visibleEbooks.map((ebook) => (
              <EbookCard 
                key={ebook.id} 
                ebook={ebook} 
                onDownload={handleDownload} 
                isLoading={isLoading} 
              />
            ))}
          </div>
        </div>
        
        <div 
          className="mt-10"
          data-reveal
        >
          <Button 
            variant="link" 
            className="text-primary"
            asChild
          >
            <Link to="/ebooks">
              Voir tous nos e-books
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EbooksSection;
