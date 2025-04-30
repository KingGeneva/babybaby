
import React from 'react';
import { Button } from '@/components/ui/button';

interface ArticlePaginationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const ArticlePagination: React.FC<ArticlePaginationProps> = ({ 
  onPrevious, 
  onNext,
  hasPrevious = true,
  hasNext = true
}) => {
  return (
    <div className="flex justify-center mt-12">
      <Button 
        variant="outline" 
        className="mr-2" 
        onClick={onPrevious}
        disabled={!hasPrevious}
      >
        Précédent
      </Button>
      <Button 
        className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
        onClick={onNext}
        disabled={!hasNext}
      >
        Suivant
      </Button>
    </div>
  );
};

export default ArticlePagination;
