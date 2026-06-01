
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Ebook } from '@/components/ebooks/types';
import { ebooksData } from '@/components/ebooks/ebooksData';
import { supabase } from '@/integrations/supabase/client';

export const useEbookViewer = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const foundEbook = ebooksData.find(e => e.id === id);

    if (!foundEbook) {
      toast({
        title: "Livre non trouvé",
        description: "Le livre que vous recherchez n'existe pas.",
        variant: "destructive"
      });
      navigate('/ebooks');
      return;
    }

    setEbook(foundEbook);

    try {
      const file = foundEbook.fileUrl;
      let url: string;

      if (file.startsWith('http')) {
        url = file;
      } else if (file.startsWith('/')) {
        url = file;
      } else {
        const { data } = supabase.storage.from('ebooks').getPublicUrl(file);
        url = data.publicUrl;
      }

      setPdfUrl(url);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur de chargement du PDF:", err);
      setError("Impossible de charger ce document.");
      setIsLoading(false);
    }
  }, [id, navigate, toast, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    ebook,
    pdfUrl,
    isLoading,
    error,
    handleRetry
  };
};
