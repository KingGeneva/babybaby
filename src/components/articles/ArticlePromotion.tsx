
import React from 'react';
import { Button } from '@/components/ui/button';

const ArticlePromotion: React.FC = () => {
  return (
    <div className="bg-babybaby-lightblue/30 p-6 rounded-lg mt-8 mb-8">
      <h3 className="text-xl font-semibold mb-3">Pour aller plus loin</h3>
      <p className="mb-4">
        Découvrez des techniques douces et efficaces pour améliorer le sommeil de votre bébé, téléchargez notre guide complet "Sommeil du bébé" gratuitement.
      </p>
      <Button className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
        Télécharger notre guide gratuit
      </Button>
    </div>
  );
};

export default ArticlePromotion;
