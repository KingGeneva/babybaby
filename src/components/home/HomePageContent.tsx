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
import { useRef } from 'react';
import HomeJourneyNav from './HomeJourneyNav';
import { useHomeScrollOrchestration } from '@/hooks/useHomeScrollOrchestration';

const HomePageContent: React.FC = () => {
  const lastMod = new Date().toISOString();
  const rootRef = useRef<HTMLDivElement>(null);
  useHomeScrollOrchestration(rootRef);

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

      <div ref={rootRef} className="home-editorial" data-active-scene="arrival">
        <HomeJourneyNav />
        {/* 1. Promesse & features */}
        <KeyFeaturesSection />

        {/* 1bis. Calculateur coût bébé Québec (asset partageable) */}
        <section className="calculator-feature" aria-labelledby="calc-promo-heading" data-scene="discover">
          <div className="container mx-auto px-5 md:px-8">
            <Link
              to="/calculateur-cout-bebe-quebec"
              className="calculator-feature-link group"
              data-reveal
            >
              <div className="calculator-copy">
                <div className="feature-icon">
                  <Calculator className="h-7 w-7" />
                </div>
                <div>
                  <p className="section-kicker">Outil gratuit</p>
                  <h2 id="calc-promo-heading" className="section-title">
                    Combien coûte un bébé au Québec en 2026 ?
                  </h2>
                  <p className="section-intro">
                    Calculateur interactif avec RQAP et Allocation famille. Résultat personnalisé en 30 secondes.
                  </p>
                </div>
              </div>
              <div className="calculator-preview" aria-hidden>
                <span>Budget mensuel</span>
                <strong>Personnalisé</strong>
                <div className="calculator-bars"><i /><i /><i /><i /></div>
                <small>Alimentation · Couches · Garde · Équipement</small>
                <ArrowRight className="calculator-arrow" />
              </div>
            </Link>
          </div>
        </section>

        {/* 2. Contenu frais (articles) */}
        <div data-scene="learn"><ArticleSection /></div>

        {/* 3. Preuve sociale */}
        <TestimonialsCarousel />

        {/* 3bis. Quiz interactif */}
        <section className="quiz-band" aria-labelledby="quiz-heading" data-scene="grow">
          <div className="container mx-auto px-5 md:px-8">
            <h2 id="quiz-heading" className="sr-only">Quiz parental</h2>
            <ParentingQuiz />
          </div>
        </section>

        {/* 4. Ressources gratuites */}
        <EbooksSection />

        {/* 4bis. Histoire du nom de domaine (1998 / MSLO 2000-2003), distincte du projet actuel */}
        <HeritageSection />

        {/* 5. CTA final + newsletter */}
        <div data-scene="connect"><CTASection /></div>

        <section className="newsletter-band" aria-labelledby="newsletter-heading">
          <div className="container mx-auto px-5 md:px-8 max-w-5xl">
            <h2 id="newsletter-heading" className="sr-only">Inscription à la newsletter</h2>
            <NewsletterForm />
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePageContent;
