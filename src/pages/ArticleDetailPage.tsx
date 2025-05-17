
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
import { Article } from '@/types/article';
import { useArticle } from '@/hooks/useArticle';
import { ArticleDetailSkeleton } from '@/components/articles/ArticleSkeleton';

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  
  const articleId = parseInt(id || '0');
  const { formatDateForStructuredData, getArticleData } = useArticle(articleId);
  
  // Calculate estimated reading time based on content length
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };
  
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
  }, [articleId, navigate, getArticleData]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center gap-2"
              onClick={() => navigate('/articles')}
              disabled
            >
              <ArrowLeft size={16} />
              Retour aux articles
            </Button>
            
            <ArticleDetailSkeleton />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return <ArticleNotFound />;
  }

  // Calculate reading time for the article
  const readingTime = calculateReadingTime(article.content);
  const wordCount = article.content.split(/\s+/).length;

  // Create canonical URL with babybaby.org domain
  const canonicalUrl = `https://babybaby.org/articles/${article.id}`;

  return (
    <div className="min-h-screen">
      <SEOHead
        title={article.title}
        description={article.excerpt}
        ogImage={article.image || "/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"}
        ogType="article"
        canonicalUrl={canonicalUrl}
        articleData={{
          publishedTime: formatDateForStructuredData(article.date),
          tags: [article.category],
          section: article.category
        }}
      />
      
      <ArticleStructuredData
        title={article.title}
        description={article.excerpt}
        image={article.image}
        datePublished={formatDateForStructuredData(article.date)}
        dateModified={formatDateForStructuredData(new Date().toString())} // Consider tracking real update dates in production
        authorName="BabyBaby"
        url={canonicalUrl}
        category={article.category}
        tags={[article.category, "parentalité", "enfant", "bébé"]}
        wordCount={wordCount}
        readingTime={readingTime}
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
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                <span>Temps de lecture: {readingTime} min</span>
                <span>{wordCount} mots</span>
              </div>
              
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
