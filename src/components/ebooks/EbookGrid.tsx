
import React, { useState } from 'react';
import { Ebook } from './types';
import EbookCard from './EbookCard';
import { downloadEbook } from './ebookService';
import { toast } from 'sonner';

interface EbookGridProps {
  ebooks: Ebook[];
}

const EbookGrid: React.FC<EbookGridProps> = ({ ebooks }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (ebook: Ebook) => {
    // Prevent multiple downloads at once
    if (downloadingId) return;
    
    setDownloadingId(ebook.id);
    
    try {
      console.log(`Tentative de téléchargement de l'ebook: ${ebook.title} (${ebook.fileUrl})`);
      await downloadEbook(ebook);
      toast.success(`Téléchargement de "${ebook.title}" réussi`);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error(`Impossible de télécharger ${ebook.title}`);
    } finally {
      // S'assurer que l'état de chargement est toujours réinitialisé
      setDownloadingId(null);
    }
  };

  if (ebooks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun e-book ne correspond à votre recherche</p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in"
    >
      {ebooks.map((ebook, index) => (
        <div
          key={ebook.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <EbookCard 
            ebook={ebook} 
            onDownload={handleDownload}
            isLoading={downloadingId === ebook.id}
          />
        </div>
      ))}
    </div>
  );
};

export default EbookGrid;
