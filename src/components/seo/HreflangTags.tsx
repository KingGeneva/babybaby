
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
  // Ensure the current URL is using the correct domain
  const normalizedCurrentUrl = currentUrl.replace("babybaby.app", "babybaby.org");
  
  // Normalize all alternate URLs to use the correct domain
  const normalizedAlternateLanguages = alternateLanguages.map(alt => ({
    ...alt,
    url: alt.url.replace("babybaby.app", "babybaby.org")
  }));
  
  return (
    <Helmet>
      {/* Balise hreflang pour la langue courante */}
      <link rel="alternate" hrefLang={currentLang} href={normalizedCurrentUrl} />
      
      {/* Balises hreflang pour les langues alternatives */}
      {normalizedAlternateLanguages.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Balise hreflang x-default pour la langue par défaut (généralement la page d'accueil) */}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={normalizedAlternateLanguages.find(l => l.lang === 'fr')?.url || normalizedCurrentUrl} 
      />
    </Helmet>
  );
};

export default HreflangTags;
