
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ArticlePromotion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const handleDownloadEbook = async () => {
    // Téléchargement de l'ebook depuis le bucket Supabase
    try {
      // Pour l'article sur le sommeil
      if (id === '4') {
        const { data, error } = await supabase
          .storage
          .from('ebooks')
          .download('sommeil-bebe-astuces.pdf');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Créer une URL pour le blob et télécharger
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'guide-sommeil-du-bebe.pdf';
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast({
            title: "Téléchargement réussi",
            description: "Votre guide sur le sommeil du bébé a bien été téléchargé.",
          });
        }
      } else if (id === '1') {
        // Pour l'article sur les coliques
        const { data, error } = await supabase
          .storage
          .from('ebooks')
          .download('coliques-du-bebe.pdf');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Créer une URL pour le blob et télécharger
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'les-coliques-du-bebe.pdf';
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast({
            title: "Téléchargement réussi",
            description: "Votre guide sur les coliques du bébé a bien été téléchargé.",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur de téléchargement",
        description: "Désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    }
  };
  
  // Personnalisation du contenu en fonction de l'article
  const isSleepArticle = id === '4';
  const isColicsArticle = id === '1';
  
  return (
    <div className="bg-babybaby-lightblue/30 p-6 rounded-lg mt-8 mb-8">
      <h3 className="text-xl font-semibold mb-3">Pour aller plus loin</h3>
      {isSleepArticle ? (
        <>
          <p className="mb-4">
            Pour aller plus loin et découvrir des techniques douces et efficaces pour améliorer le sommeil de votre bébé, téléchargez notre guide complet "Sommeil du bébé" gratuitement.
          </p>
          <Button 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 flex items-center gap-2"
            onClick={handleDownloadEbook}
          >
            <Download size={16} />
            Télécharger notre guide gratuit
          </Button>
        </>
      ) : isColicsArticle ? (
        <>
          <p className="mb-4">
            Pour aller plus loin et découvrir des solutions pour soulager les coliques de votre bébé, téléchargez notre guide complet "Les coliques du bébé" gratuitement.
          </p>
          <Button 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 flex items-center gap-2"
            onClick={handleDownloadEbook}
          >
            <Download size={16} />
            Télécharger notre guide gratuit
          </Button>
        </>
      ) : (
        <>
          <p className="mb-4">
            Découvrez des techniques douces et efficaces pour améliorer le sommeil de votre bébé et soulager ses coliques en téléchargeant gratuitement nos guides complets.
          </p>
          <Button 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
            onClick={() => toast({
              title: "Nos guides",
              description: "Consultez notre section E-books pour découvrir tous nos guides gratuits.",
            })}
          >
            Découvrir nos guides gratuits
          </Button>
        </>
      )}
    </div>
  );
};

export default ArticlePromotion;
