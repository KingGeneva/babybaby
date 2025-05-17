
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOTags = () => {
  return (
    <Helmet>
      <title>Générateur de Certificat d'Accomplissement | BabyBaby</title>
      <meta 
        name="description" 
        content="Créez et partagez facilement des certificats d'accomplissement personnalisés pour les étapes importantes de votre enfant." 
      />
      <meta 
        name="keywords" 
        content="certificat enfant, accomplissement bébé, étape importante, souvenir enfant, générateur certificat" 
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Créez un Certificat d'Accomplissement Personnalisé | BabyBaby" />
      <meta 
        property="og:description" 
        content="Marquez les étapes importantes du développement de votre enfant avec un joli certificat personnalisé à partager." 
      />
    </Helmet>
  );
};

export default SEOTags;
