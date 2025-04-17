import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Book className="mx-auto h-10 w-10 text-babybaby-cosmic mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">Nos E-books Gratuits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des ressources expertisées pour vous accompagner dans votre parcours parental
          </p>
        </motion.div>

        <div className="relative">
          <EbookCarouselControls 
            currentIndex={currentIndex}
            totalPages={totalPages}
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            goToPage={goToPage}
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {visibleEbooks.map((ebook) => (
              <EbookCard 
                key={ebook.id} 
                ebook={ebook} 
                onDownload={handleDownload} 
                isLoading={isLoading} 
              />
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button 
            variant="link" 
            className="text-babybaby-cosmic"
            asChild
          >
            <Link to="/ebooks">
              Voir tous nos e-books
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EbooksSection;
