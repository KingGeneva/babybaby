
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
      toast({
        title: "Préparation du téléchargement",
        description: "Veuillez patienter...",
      });
      
      let fileName = "";
      let downloadName = "";
      let successMessage = "";
      
      // Pour l'article sur le sommeil
      if (id === '4') {
        fileName = "sommeil-bebe-astuces.pdf";
        downloadName = "Les secrets d'un sommeil paisible.pdf";
        successMessage = "Votre guide sur le sommeil du bébé a bien été téléchargé.";
      } 
      // Pour l'article sur les coliques
      else if (id === '1') {
        fileName = "Coliques du bebe.pdf";
        downloadName = "Coliques du bébé.pdf";
        successMessage = "Votre guide sur les coliques du bébé a bien été téléchargé.";
      }
      else {
        fileName = "Les 6 premiers mois - Guide.pdf";
        downloadName = "Les 6 premiers mois - Guide essentiel.pdf";
        successMessage = "Votre guide pour les 6 premiers mois a bien été téléchargé.";
      }
      
      if (fileName) {
        console.log(`Téléchargement du fichier: ${fileName}`);
        const { data, error } = await supabase
          .storage
          .from('ebooks')
          .download(fileName);
          
        if (error) {
          console.error("Erreur de téléchargement:", error);
          throw error;
        }
        
        if (data) {
          // Créer une URL pour le blob et télécharger
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = downloadName;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast({
            title: "Téléchargement réussi",
            description: successMessage,
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
            Pour aller plus loin et découvrir des techniques douces et efficaces pour améliorer le sommeil de votre bébé, téléchargez notre guide complet "Les secrets d'un sommeil paisible" gratuitement.
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
            Pour aller plus loin et découvrir des solutions pour soulager les coliques de votre bébé, téléchargez notre guide complet "Coliques du bébé" gratuitement.
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
            Découvrez nos guides complets sur le développement de votre bébé, le sommeil et les coliques en téléchargeant gratuitement nos ressources.
          </p>
          <Button 
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 flex items-center gap-2"
            onClick={handleDownloadEbook}
          >
            <Download size={16} />
            Télécharger notre guide gratuit
          </Button>
        </>
      )}
    </div>
  );
};

export default ArticlePromotion;
