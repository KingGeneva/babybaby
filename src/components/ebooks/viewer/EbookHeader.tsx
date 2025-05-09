
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Ebook } from '@/components/ebooks/types';

interface EbookHeaderProps {
  ebook: Ebook | null;
  onNavigateBack: () => void;
}

const EbookHeader: React.FC<EbookHeaderProps> = ({ ebook, onNavigateBack }) => {
  return (
    <>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onNavigateBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à la bibliothèque
        </Button>
      </div>
      
      {ebook && (
        <h1 className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic">
          {ebook.title}
        </h1>
      )}
    </>
  );
};

export default EbookHeader;
