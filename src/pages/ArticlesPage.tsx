import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import P5Canvas from '@/components/P5Canvas';
import ArticleCard from '@/components/articles/ArticleCard';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

import { articles } from '@/data/articles';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

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

              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-base"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 relative z-10">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 md:max-w-[70%]">
                  {categories.map((category) => (
                    <Badge 
                      key={category}
                      variant="outline"
                      className={cn(
                        "cursor-pointer px-4 py-2 whitespace-nowrap",
                        selectedCategory === category 
                          ? "bg-babybaby-cosmic text-white hover:bg-babybaby-cosmic/90" 
                          : "hover:bg-gray-100"
                      )}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <TabsList>
                    <TabsTrigger value="grid" className="px-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                    </TabsTrigger>
                    <TabsTrigger value="list" className="px-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-list"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7"/><path d="M14 9h7"/><path d="M14 15h7"/><path d="M14 20h7"/></svg>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="mt-8">
                {filteredArticles.length > 0 ? (
                  <>
                    <TabsContent value="grid">
                      <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredArticles.map((article) => (
                          <motion.div key={article.id} variants={itemVariants}>
                            <ArticleCard article={article} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="list">
                      <motion.div 
                        className="flex flex-col space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredArticles.map((article) => (
                          <motion.div key={article.id} variants={itemVariants}>
                            <Card className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/4">
                                  <div className="relative h-48 md:h-full">
                                    <img
                                      src={article.image}
                                      alt={article.title}
                                      className="w-full h-full object-cover"
                                    />
                                    {article.featured && (
                                      <Badge className="absolute top-2 right-2 bg-babybaby-cosmic">
                                        À la une
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="md:w-3/4 p-6 flex flex-col">
                                  <div className="flex justify-between items-center mb-2">
                                    <Badge variant="outline">{article.category}</Badge>
                                    <span className="text-xs text-gray-500">{article.date}</span>
                                  </div>
                                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                                  <p className="text-gray-600 flex-grow mb-4">{article.excerpt}</p>
                                  <Link 
                                    to={`/articles/${article.id}`}
                                    className="flex items-center text-babybaby-cosmic self-end hover:underline"
                                  >
                                    Lire l'article <ChevronRight className="ml-1 h-4 w-4" />
                                  </Link>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Aucun article ne correspond à votre recherche.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-12">
                <Button variant="outline" className="mr-2">Précédent</Button>
                <Button className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">Suivant</Button>
              </div>
            </Tabs>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticlesPage;
