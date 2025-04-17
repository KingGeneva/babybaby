
import React, { useState } from 'react';
import { Ebook } from './types';
import EbookCard from './EbookCard';
import { downloadEbook } from './ebookService';

interface EbookGridProps {
  ebooks: Ebook[];
}

const EbookGrid: React.FC<EbookGridProps> = ({ ebooks }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (ebook: Ebook) => {
    setIsLoading(true);
    await downloadEbook(ebook);
    setIsLoading(false);
  };

  if (ebooks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun e-book ne correspond à votre recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ebooks.map((ebook) => (
        <EbookCard 
          key={ebook.id} 
          ebook={ebook} 
          onDownload={handleDownload}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default EbookGrid;
