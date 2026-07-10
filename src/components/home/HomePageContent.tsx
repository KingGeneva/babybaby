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
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight } from 'lucide-react';

const HomePageContent: React.FC = () => {
  const lastMod = new Date().toISOString();

  return (
    <>
      <Helmet>
        <meta name="last-modified" content={lastMod} />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="x-default" />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="fr-CA" />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="fr-FR" />
        <link rel="alternate" href="https://babybaby.org/" hrefLang="fr" />
        <link rel="prefetch" href="/articles" />
        <link rel="prefetch" href="/ebooks" />
        <link rel="prefetch" href="/tools" />
      </Helmet>

      <div className="animate-fade-in">
        {/* 1. Promesse & features */}
        <KeyFeaturesSection />

        {/* 1bis. Calculateur coût bébé Québec (asset partageable) */}
        <section className="py-12 px-4" aria-labelledby="calc-promo-heading">
          <div className="container mx-auto max-w-3xl">
            <Link
              to="/calculateur-cout-bebe-quebec"
              className="group block rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 p-8 md:p-10 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Calculator className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">Nouveau · Outil gratuit</p>
                  <h2 id="calc-promo-heading" className="font-display text-2xl md:text-3xl font-bold mb-2">
                    Combien coûte un bébé au Québec en 2026 ?
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Calculateur interactif avec RQAP et Allocation famille. Résultat personnalisé en 30 secondes.
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-primary transition-transform group-hover:translate-x-1 hidden md:block" />
              </div>
            </Link>
          </div>
        </section>

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
