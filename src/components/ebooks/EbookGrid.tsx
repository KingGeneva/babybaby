
import React, { useState } from 'react';
import { Ebook } from './types';
import EbookCard from './EbookCard';
import { downloadEbook } from './ebookService';
import { motion } from 'framer-motion';
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
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {ebooks.map((ebook) => (
        <motion.div
          key={ebook.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EbookCard 
            ebook={ebook} 
            onDownload={handleDownload}
            isLoading={downloadingId === ebook.id}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EbookGrid;
