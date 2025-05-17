
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
  
  // Add debug logs
  console.log('Articles in ArticleSection:', articles.map(a => ({ id: a.id, title: a.title })));
  console.log('Featured articles in ArticleSection:', featuredArticles.map(a => ({ id: a.id, title: a.title })));
  
  return (
    <section className="py-12 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <div
          className="relative mb-12 animate-fade-in"
        >
          {/* Decorative element */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-babybaby-cosmic rounded-full opacity-70"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic text-center">
            Nos derniers articles
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-center text-sm md:text-base">
            Découvrez nos conseils, astuces et informations pour vous accompagner dans votre aventure parentale.
          </p>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in"
        >
          {loading ? (
            // Display skeletons while loading
            <>
              {Array(isMobile ? 2 : 3).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <ArticleCardSkeleton />
                </div>
              ))}
            </>
          ) : error ? (
            // Display error state
            <div className="col-span-full text-center text-red-500">
              Impossible de charger les articles. Veuillez réessayer plus tard.
            </div>
          ) : (
            // Display loaded articles
            featuredArticles.slice(0, isMobile ? 2 : featuredArticles.length).map((article, index) => (
              <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ArticleCard article={article} />
              </div>
            ))
          )}
        </div>

        <div 
          className="text-center mt-10 animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          <Link to="/articles">
            <Button 
              size={isMobile ? "default" : "lg"}
              className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 shadow-lg hover:shadow-xl transition-all duration-300"
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
