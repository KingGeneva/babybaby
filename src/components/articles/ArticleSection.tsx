
import React from 'react';
import ArticleCard from './ArticleCard';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { ArticleCardSkeleton } from './ArticleSkeleton';

const ArticleSection: React.FC = () => {
  const isMobile = useIsMobile();
  const { articles, loading, error } = useArticles();
  
  // Limit to 3 articles for the homepage
  const featuredArticles = articles.slice(0, 3);
  
  return (
    <section className="editorial-section article-showcase">
      <div className="container mx-auto px-5 md:px-8">
        <div
          className="editorial-heading editorial-heading-row"
          data-reveal
        >
          <div><p className="section-kicker">À lire maintenant</p><h2 className="section-title">Les derniers guides.</h2></div>
          <p className="section-intro">Des réponses documentées, accessibles et pensées pour les questions qui arrivent vraiment au quotidien.</p>
        </div>

        <div 
          className="article-editorial-grid"
        >
          {loading ? (
            // Display skeletons while loading
            <>
              {Array(isMobile ? 2 : 3).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`}>
                  <ArticleCardSkeleton />
                </div>
              ))}
            </>
          ) : error ? (
            // Display error state
            <div className="col-span-full text-center text-destructive">
              Impossible de charger les articles. Veuillez réessayer plus tard.
            </div>
          ) : (
            // Display loaded articles
            featuredArticles.slice(0, isMobile ? 2 : featuredArticles.length).map((article, index) => (
              <div key={article.id} className={index === 0 ? 'article-lead' : ''} data-reveal>
                <ArticleCard article={article} />
              </div>
            ))
          )}
        </div>

        <div 
          className="mt-10"
          data-reveal
        >
          <Link to="/articles">
            <Button 
              size={isMobile ? "default" : "lg"}
              variant="outline"
              className="rounded-full border-primary/30 min-h-11"
            >
              Explorer tous nos articles
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;
