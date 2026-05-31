import React from 'react';
import ArticleSection from '@/components/articles/ArticleSection';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import EbooksSection from '@/components/ebooks/EbooksSection';
import NewsletterForm from '@/components/NewsletterForm';
import KeyFeaturesSection from './KeyFeaturesSection';
import CTASection from './CTASection';
import ParentingQuiz from '@/components/quiz/ParentingQuiz';
import HeritageSection from './HeritageSection';
import { Helmet } from 'react-helmet-async';

const HomePageContent: React.FC = () => {
  const lastMod = new Date().toISOString();

  return (
    <>
      <Helmet>
        <meta name="last-modified" content={lastMod} />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="x-default" />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="fr" />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="fr-FR" />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="fr-CA" />
        <link rel="prefetch" href="/articles" />
        <link rel="prefetch" href="/ebooks" />
        <link rel="prefetch" href="/tools" />
      </Helmet>

      <div className="animate-fade-in">
        {/* 1. Promesse & features */}
        <KeyFeaturesSection />

        {/* 2. Contenu frais (articles) */}
        <ArticleSection />

        {/* 3. Preuve sociale */}
        <TestimonialsCarousel />

        {/* 3bis. Quiz interactif */}
        <section className="py-16 px-4" aria-labelledby="quiz-heading">
          <div className="container mx-auto">
            <h2 id="quiz-heading" className="sr-only">Quiz parental</h2>
            <ParentingQuiz />
          </div>
        </section>

        {/* 4. Ressources gratuites */}
        <EbooksSection />

        {/* 4bis. Héritage du domaine (depuis 1998 / MSLO 2000-2003) */}
        <HeritageSection />

        {/* 5. CTA final + newsletter */}
        <CTASection />

        <section className="py-16 px-4 bg-muted/30" aria-labelledby="newsletter-heading">
          <div className="container mx-auto max-w-2xl">
            <h2 id="newsletter-heading" className="sr-only">Inscription à la newsletter</h2>
            <NewsletterForm />
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePageContent;
