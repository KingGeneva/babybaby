
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import P5Canvas from '@/components/P5Canvas';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { articles } from '@/data/articles';
import ArticleSearch from '@/components/articles/ArticleSearch';
import ArticleCategories from '@/components/articles/ArticleCategories';
import ArticleViewToggle from '@/components/articles/ArticleViewToggle';
import ArticleGridView from '@/components/articles/ArticleGridView';
import ArticleListView from '@/components/articles/ArticleListView';
import ArticleEmpty from '@/components/articles/ArticleEmpty';
import ArticlePagination from '@/components/articles/ArticlePagination';

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
  
  const filteredArticles = articles.filter(article => {
    const categoryMatch = selectedCategory === "Tous" || article.category === selectedCategory;
    const searchMatch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen">
      <NavBar />

      <div className="relative">
        <div className="absolute inset-0 z-0">
          <P5Canvas className="w-full h-full opacity-10" />
        </div>

        <section className="pt-24 pb-8 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-babybaby-cosmic mb-4">
                Tous nos articles
              </h1>
              <p className="text-gray-600 mb-8">
                Découvrez nos conseils d'experts et astuces pour accompagner votre parentalité
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
                {filteredArticles.length > 0 ? (
                  <>
                    <TabsContent value="grid">
                      <ArticleGridView articles={filteredArticles} />
                    </TabsContent>
                    
                    <TabsContent value="list">
                      <ArticleListView articles={filteredArticles} />
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
