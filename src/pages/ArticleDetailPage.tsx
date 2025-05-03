
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle } from '@/hooks/useArticle';
import { useSeriesArticles } from '@/hooks/useSeriesArticles';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import ArticleHeader from '@/components/articles/ArticleHeader';
import ArticleImage from '@/components/articles/ArticleImage';
import ArticleContent from '@/components/articles/ArticleContent';
import ArticleActions from '@/components/articles/ArticleActions';
import ArticlePromotion from '@/components/articles/ArticlePromotion';
import ArticleNotFound from '@/components/articles/ArticleNotFound';
import ArticleStructuredData from '@/components/articles/ArticleStructuredData';

const ArticleDetailPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { article, loading, error } = useArticle(Number(articleId));
  const { articles: seriesArticles } = useSeriesArticles(article?.series?.id);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 mb-8 rounded-full"></div>
          <div className="h-64 w-full max-w-3xl bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return <ArticleNotFound onBack={() => navigate('/articles')} />;
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${article.title} | BabyBaby`}
        description={article.summary || article.excerpt}
        image={article.image}
      />
      
      <ArticleStructuredData
        title={article.title}
        description={article.summary || article.excerpt}
        image={article.image}
        datePublished={article.date}
        url={`https://babybaby.app/articles/${article.id}`}
        category={article.category}
      />

      <NavBar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <article className="max-w-3xl mx-auto">
          <ArticleHeader
            title={article.title}
            category={article.category}
            date={article.date}
            readingTime={article.readingTime}
            author={article.author}
          />

          <ArticleImage src={article.image} alt={article.title} />

          <div className="mt-8">
            <ArticleContent 
              content={article.content} 
              excerpt={article.excerpt}
              series={article.series}
              relatedArticles={seriesArticles}
            />
          </div>

          <div className="my-8">
            <ArticleActions article={article} />
          </div>
        </article>

        <div className="mt-12">
          <ArticlePromotion />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
