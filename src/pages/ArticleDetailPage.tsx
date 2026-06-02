
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
import ReadingProgressBar from '@/components/articles/ReadingProgressBar';
import ArticleTOC from '@/components/articles/ArticleTOC';
import ArticleComments from '@/components/articles/ArticleComments';
import FAQPageSchema from '@/components/seo/FAQPageSchema';
import HowToSchema from '@/components/seo/HowToSchema';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Article } from '@/types/article';
import { useArticle } from '@/hooks/useArticle';
import { ArticleDetailSkeleton } from '@/components/articles/ArticleSkeleton';
import { articleUrl, parseArticleIdFromParam } from '@/lib/articleUrl';

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // Accept both `/articles/123` and `/articles/my-slug-123`.
  // Anything else (legacy FreshStore slugs without trailing id) is treated as Gone.
  const articleId = parseArticleIdFromParam(id) ?? 0;
  const isValidNumericId = articleId > 0;
  const { formatDateForStructuredData, getArticleData } = useArticle(articleId);

  useEffect(() => {
    if (!isValidNumericId) {
      setLoading(false);
      return;
    }

    const loadArticle = async () => {
      setLoading(true);

      const articleData = await getArticleData(articleId);

      if (!articleData) {
        // No toast + no redirect: render the 404/410 page so the URL itself
        // signals "gone" to crawlers.
        setArticle(undefined);
      } else {
        setArticle(articleData);
      }

      setLoading(false);
    };

    loadArticle();
  }, [articleId, isValidNumericId, getArticleData]);

  if (loading) {
    return (
      <div className="min-h-[100svh]">
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

  const canonical = `https://babybaby.org${articleUrl(article)}`;
  const publishedIso = formatDateForStructuredData(article.date);
  const modifiedIso = article.dateModified || publishedIso;

  return (
    <div className="min-h-[100svh]">
      <SEOHead
        title={article.title}
        description={article.excerpt}
        ogImage={article.image || "/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"}
        ogType="article"
        canonicalUrl={canonical}
        articleData={{
          publishedTime: publishedIso,
          tags: [article.category, ...(article.tags || [])],
        }}
      />

      <ArticleStructuredData
        title={article.title}
        description={article.excerpt}
        image={article.image}
        datePublished={publishedIso}
        dateModified={modifiedIso}
        authorName={article.author || "BabyBaby"}
        url={canonical}
        category={article.category}
        keywords={article.tags}
        wordCount={article.word_count}
      />

      {article.faqs && article.faqs.length > 0 && (
        <FAQPageSchema faqs={article.faqs} />
      )}

      {article.howTo && (
        <HowToSchema
          name={article.howTo.name}
          description={article.howTo.description}
          steps={article.howTo.steps}
          totalTime={article.howTo.totalTime}
          image={article.image}
        />
      )}

      <ReadingProgressBar />
      <NavBar />
      <ArticleTOC content={article.content || ''} />

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
              
              <ArticleImage image={article.image} title={article.title} alt={article.image_alt} />
              
              <ArticleContent content={article.content} excerpt={article.excerpt} />

              {article.faqs && article.faqs.length > 0 && (
                <section className="mt-12 pt-8 border-t" aria-labelledby="article-faq-heading">
                  <h2 id="article-faq-heading" className="text-2xl md:text-3xl font-bold mb-6">
                    Foire aux questions
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {article.faqs.map((faq, idx) => (
                      <AccordionItem key={idx} value={`faq-${idx}`}>
                        <AccordionTrigger className="text-left text-base font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              <ArticleActions article={article} />
              
              <ArticlePromotion />
            </div>

            <ArticleComments articleId={article.id} />
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
