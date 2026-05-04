import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';

/**
 * Page affichée quand un article est introuvable ou que l'URL utilise
 * un ancien slug (ex: anciens slugs FreshStore comme
 * /articles/2025-baby-astrology-charts).
 *
 * On envoie un signal "noindex" fort pour que Google retire ces vieilles
 * URLs de l'index au lieu de les marquer comme erreurs persistantes.
 */
const ArticleNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100svh] flex flex-col">
      <SEOHead
        title="Article introuvable | BabyBaby"
        description="Cet article n'existe plus. Découvrez nos nouveaux guides pour parents."
      />
      <Helmet>
        {/* Strong signal to crawlers: do not index this URL, do not follow it */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        {/* Canonical to the articles index so any link equity flows there */}
        <link rel="canonical" href="https://babybaby.org/articles" />
        {/* Hint to Google that this resource is permanently gone */}
        <meta httpEquiv="status" content="410" />
      </Helmet>
      <NavBar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-3xl font-bold mb-4">Article introuvable</h1>
          <p className="mb-6 text-muted-foreground">
            Cet article n'existe plus ou a été déplacé. Consultez notre nouvelle
            collection de guides pour parents.
          </p>
          <Button onClick={() => navigate('/articles')}>
            Voir tous les articles
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleNotFound;
