
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import SEOHead from '@/components/common/SEOHead';
import ArticleStructuredData from '@/components/articles/ArticleStructuredData';
import ArticleHeader from '@/components/articles/ArticleHeader';
import ArticleImage from '@/components/articles/ArticleImage';
import ArticleContent from '@/components/articles/ArticleContent';
import ArticleActions from '@/components/articles/ArticleActions';
import ArticlePromotion from '@/components/articles/ArticlePromotion';
import ArticleNotFound from '@/components/articles/ArticleNotFound';
import { useArticle } from '@/hooks/useArticle';
import { Article } from '@/types/article';

// Import des articles (à terme, cela viendrait d'une API)
import { articles } from '@/data/articles';

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  
  const articleId = parseInt(id || '0');
  const { formatDateForStructuredData, getArticleData } = useArticle(articleId);
  
  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      
      const articleData = await getArticleData(articleId);
      
      if (!articleData) {
        toast({
          title: "Article introuvable",
          description: "L'article que vous recherchez n'existe pas ou a été supprimé.",
          variant: "destructive"
        });
        navigate('/articles');
      } else {
        setArticle(articleData);
      }
      
      setLoading(false);
    };
    
    loadArticle();
  }, [articleId, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!article) {
    return <ArticleNotFound />;
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title={article.title}
        description={article.excerpt}
        ogImage={article.image || "/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"}
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
              <ArticleHeader 
                category={article.category} 
                date={article.date} 
                title={article.title} 
              />
              
              <ArticleImage image={article.image} title={article.title} />
              
              <ArticleContent content={article.content} excerpt={article.excerpt} />
              
              <ArticleActions article={article} />
              
              <ArticlePromotion />
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
