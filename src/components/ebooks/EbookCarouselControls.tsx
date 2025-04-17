
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EbookCarouselControlsProps {
  currentIndex: number;
  totalPages: number;
  prevSlide: () => void;
  nextSlide: () => void;
  goToPage: (pageIndex: number) => void;
}

const EbookCarouselControls: React.FC<EbookCarouselControlsProps> = ({
  currentIndex,
  totalPages,
  prevSlide,
  nextSlide,
  goToPage,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full border-babybaby-cosmic text-babybaby-cosmic"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Précédent</span>
      </Button>
      
      <div className="flex gap-2 justify-center">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`h-2 rounded-full transition-all ${
              Math.floor(currentIndex / totalPages) === idx 
                ? "w-6 bg-babybaby-cosmic" 
                : "w-2 bg-gray-300"
            }`}
            onClick={() => goToPage(idx)}
            aria-label={`Page ${idx + 1}`}
          />
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full border-babybaby-cosmic text-babybaby-cosmic"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Suivant</span>
      </Button>
    </div>
  );
};

export default EbookCarouselControls;
