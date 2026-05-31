import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import ArticleCard from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useArticleFavorites } from '@/hooks/useArticleFavorites';
import { useArticles } from '@/hooks/useArticles';
import type { Article } from '@/types/article';

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites, loading } = useArticleFavorites();
  const { articles, loading: articlesLoading } = useArticles();
  const [favArticles, setFavArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!articles) return;
    setFavArticles(articles.filter((a) => favorites.has(String(a.id))));
  }, [articles, favorites]);

  return (
    <div className="min-h-[100svh] flex flex-col">
      <SEOHead
        title="Mes favoris"
        description="Retrouvez vos articles BabyBaby sauvegardés."
        canonicalUrl="https://babybaby.org/favoris"
      />
      <NavBar />
      <main className="flex-1 pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
              <h1 className="text-3xl md:text-4xl font-bold">Mes favoris</h1>
            </div>
            <p className="text-muted-foreground">
              {favArticles.length} article{favArticles.length > 1 ? 's' : ''} sauvegardé
              {favArticles.length > 1 ? 's' : ''}
            </p>
          </header>

          {!user ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Connectez-vous pour voir vos favoris.</p>
              <Button asChild>
                <Link to="/auth">Se connecter</Link>
              </Button>
            </div>
          ) : loading || articlesLoading ? (
            <p className="text-muted-foreground">Chargement…</p>
          ) : favArticles.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Aucun favori pour le moment. Cliquez sur le cœur d'un article pour le sauvegarder.
              </p>
              <Button asChild>
                <Link to="/articles">Parcourir les articles</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
