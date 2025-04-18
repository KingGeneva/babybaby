
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import Markdown from 'react-markdown';
import SEOHead from '@/components/common/SEOHead';
import ArticleStructuredData from '@/components/articles/ArticleStructuredData';

// Import des articles (à terme, cela viendrait d'une API)
import { articles } from '@/data/articles';
import { toast } from '@/components/ui/use-toast';

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const articleId = parseInt(id || '0');
  const article = articles.find(a => a.id === articleId);
  
  useEffect(() => {
    if (!article) {
      toast({
        title: "Article introuvable",
        description: "L'article que vous recherchez n'existe pas ou a été supprimé.",
        variant: "destructive"
      });
      navigate('/articles');
    }
  }, [article, navigate]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title="Article introuvable"
          description="L'article que vous recherchez n'existe pas ou a été supprimé."
        />
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article introuvable</h1>
            <p className="mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={() => navigate('/articles')}>
              Retourner aux articles
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format date for structured data
  const formatDateForStructuredData = (dateString: string) => {
    const date = new Date(dateString.split(' ')[0] + ', 2025');
    return date.toISOString();
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={article.title}
        description={article.excerpt}
        ogImage={article.image}
        ogType="article"
        canonicalUrl={`https://babybaby.app/articles/${article.id}`}
        articleData={{
          publishedTime: formatDateForStructuredData(article.date),
          tags: [article.category]
        }}
      />
      
      <ArticleStructuredData
        title={article.title}
        description={article.excerpt}
        image={article.image}
        datePublished={formatDateForStructuredData(article.date)}
        authorName="BabyBaby"
        url={`https://babybaby.app/articles/${article.id}`}
      />
      
      <NavBar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center gap-2"
              onClick={() => navigate('/articles')}
            >
              <ArrowLeft size={16} />
              Retour aux articles
            </Button>
            
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">{article.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {article.date}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-babybaby-cosmic">
                {article.title}
              </h1>
              
              {article.image && article.image !== "/placeholder.svg" && (
                <div className="mb-8">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                {/* Contenu de l'article - utilisation de Markdown */}
                {article.content ? (
                  <Markdown>
                    {article.content}
                  </Markdown>
                ) : (
                  <p className="text-gray-700 mb-4">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="flex justify-between items-center my-8 py-4 border-t border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span>42</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-babybaby-cosmic transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>12 commentaires</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Partager
                    </Button>
                    <Button variant="outline" size="sm">
                      Sauvegarder
                    </Button>
                  </div>
                </div>
                
                <div className="bg-babybaby-lightblue/30 p-6 rounded-lg mt-8 mb-8">
                  <h3 className="text-xl font-semibold mb-3">Pour aller plus loin</h3>
                  <p className="mb-4">
                    Découvrez des techniques douces et efficaces pour améliorer le sommeil de votre bébé, téléchargez notre guide complet "Sommeil du bébé" gratuitement.
                  </p>
                  <Button className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
                    Télécharger notre guide gratuit
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
