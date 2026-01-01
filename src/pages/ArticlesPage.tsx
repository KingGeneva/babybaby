import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import P5Canvas from '@/components/P5Canvas';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ArticleSearch from '@/components/articles/ArticleSearch';
import ArticleCategories from '@/components/articles/ArticleCategories';
import ArticleViewToggle from '@/components/articles/ArticleViewToggle';
import ArticleGridView from '@/components/articles/ArticleGridView';
import ArticleListView from '@/components/articles/ArticleListView';
import ArticleEmpty from '@/components/articles/ArticleEmpty';
import ArticlePagination from '@/components/articles/ArticlePagination';
import { useArticles } from '@/hooks/useArticles';
import { ArticleCardSkeleton, ArticleListItemSkeleton } from '@/components/articles/ArticleSkeleton';
import SEOHead from '@/components/common/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

const categories = [
  "Tous",
  "Nutrition", 
  "Sommeil", 
  "Développement", 
  "Santé", 
  "Éducation", 
  "Préparation",
  "Aménagement"
];

const ArticlesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { articles, loading, error } = useArticles(selectedCategory, searchTerm);

  // Display skeletons while loading
  const renderSkeletons = (viewType: 'grid' | 'list') => {
    const skeletons = Array(6).fill(0);
    if (viewType === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletons.map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col space-y-4">
          {skeletons.map((_, index) => (
            <ArticleListItemSkeleton key={index} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Articles sur la Parentalité et le Développement de Bébé | BabyBaby"
        description="Découvrez nos articles experts sur l'alimentation, le sommeil, le développement et la santé de bébé. Conseils pratiques pour les jeunes parents."
        canonicalUrl="https://babybaby.app/articles"
        ogImage="https://babybaby.app/lovable-uploads/f17afad4-d5f6-413a-935d-83d0053d4541.png"
        keywords={[
          "articles bébé", "conseils parents", "développement enfant", "nutrition bébé",
          "sommeil bébé", "santé bébé", "éducation enfant", "parentalité positive",
          "diversification alimentaire", "allaitement", "coliques", "croissance bébé"
        ]}
      />
      <BreadcrumbSchema 
        items={[
          { name: "Accueil", url: "https://babybaby.app" },
          { name: "Articles", url: "https://babybaby.app/articles" }
        ]}
      />
      <NavBar />

      <div className="relative">
        <div className="absolute inset-0 z-0">
          <P5Canvas className="w-full h-full opacity-10" />
        </div>

        <section className="pt-24 pb-8 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-babybaby-cosmic mb-4">
                Articles Parentalité et Développement Bébé
              </h1>
              <p className="text-gray-600 mb-8">
                Conseils d'experts validés pour accompagner chaque étape du développement de votre enfant
              </p>

              <ArticleSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>
        </section>

        <section className="py-8 relative z-10">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                <ArticleCategories 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />

                <div className="flex items-center justify-end space-x-2">
                  <ArticleViewToggle />
                </div>
              </div>

              <div className="mt-8">
                {loading ? (
                  <>
                    <TabsContent value="grid">
                      {renderSkeletons('grid')}
                    </TabsContent>
                    
                    <TabsContent value="list">
                      {renderSkeletons('list')}
                    </TabsContent>
                  </>
                ) : articles.length > 0 ? (
                  <>
                    <TabsContent value="grid">
                      <ArticleGridView articles={articles} />
                    </TabsContent>
                    
                    <TabsContent value="list">
                      <ArticleListView articles={articles} />
                    </TabsContent>
                  </>
                ) : (
                  <ArticleEmpty />
                )}
              </div>

              <ArticlePagination onPrevious={() => {}} onNext={() => {}} />
            </Tabs>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticlesPage;
