
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import { faqs, faqCategories, type FAQCategory } from '@/components/faq/faqData';
import FAQSearch from '@/components/faq/FAQSearch';
import FAQCategoryFilter from '@/components/faq/FAQCategoryFilter';
import FAQList from '@/components/faq/FAQList';
import FAQContactSection from '@/components/faq/FAQContactSection';
import FAQStructuredData from '@/components/faq/FAQStructuredData';

const FAQPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("Général");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFAQs = faqs.filter(faq => {
    const categoryMatch = selectedCategory === "Tous" || faq.category === selectedCategory;
    const searchMatch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50/50">
      <SEOHead 
        title="FAQ - Questions Fréquentes sur l'Application BabyBaby" 
        description="Découvrez les réponses à toutes vos questions sur l'application BabyBaby. Suivi de développement, outils parentaux, contenu éducatif et plus encore."
        canonicalUrl="https://babybaby.app/faq"
        keywords={["application baby, suivi bébé", "développement enfant", "outils parentaux", "tableau de bord pour bébé", "calendrier vaccination bébé"]}
      />
      <FAQStructuredData />
      
      <NavBar />
      
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-babybaby-cosmic mb-4">
              Questions Fréquentes sur BabyBaby
            </h1>
            <p className="text-gray-600 mb-8">
              Trouvez rapidement des réponses à vos questions sur l'application BabyBaby et la parentalité
            </p>

            <FAQSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <FAQCategoryFilter 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <FAQList filteredFAQs={filteredFAQs} />
          <FAQContactSection />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
