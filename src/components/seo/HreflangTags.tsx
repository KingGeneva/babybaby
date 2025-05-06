
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface LanguageUrl {
  lang: string;
  url: string;
}

interface HreflangTagsProps {
  currentLang: string;
  currentUrl: string;
  alternateLanguages: LanguageUrl[];
}

const HreflangTags: React.FC<HreflangTagsProps> = ({
  currentLang,
  currentUrl,
  alternateLanguages
}) => {
  return (
    <Helmet>
      {/* Balise hreflang pour la langue courante */}
      <link rel="alternate" hrefLang={currentLang} href={currentUrl} />
      
      {/* Balises hreflang pour les langues alternatives */}
      {alternateLanguages.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Balise hreflang x-default pour la langue par défaut (généralement la page d'accueil) */}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={alternateLanguages.find(l => l.lang === 'fr')?.url || currentUrl} 
      />
    </Helmet>
  );
};

export default HreflangTags;
