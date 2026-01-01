import React, { useState, useMemo, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { ebooksData } from '@/components/ebooks/ebooksData';
import EbookGrid from '@/components/ebooks/EbookGrid';
import EbookFilters from '@/components/ebooks/EbookFilters';
import { Ebook } from '@/components/ebooks/types';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import SEOHead from '@/components/common/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Helmet } from 'react-helmet-async';
import { preloadEbooks } from '@/components/ebooks/services';

const EbooksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const filteredEbooks = useMemo(() => {
    return ebooksData.filter(ebook => {
      const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedFileType || ebook.fileType === selectedFileType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedFileType]);

  // Schema pour les ebooks (ItemList)
  const ebooksSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "E-books gratuits pour parents",
    "description": "Collection de guides gratuits sur la parentalité, le développement de bébé et l'éducation positive.",
    "numberOfItems": ebooksData.length,
    "itemListElement": ebooksData.slice(0, 10).map((ebook, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Book",
        "name": ebook.title,
        "description": ebook.description,
        "author": {
          "@type": "Organization",
          "name": "BabyBaby"
        },
        "publisher": {
          "@type": "Organization",
          "name": "BabyBaby"
        },
        "inLanguage": "fr",
        "isAccessibleForFree": true
      }
    }))
  };

  // Précharger les ebooks populaires en arrière-plan
  useEffect(() => {
    if (!isPreloaded) {
      setTimeout(() => {
        preloadEbooks(ebooksData.slice(0, 3))
          .then(() => setIsPreloaded(true))
          .catch(console.error);
      }, 2000);
    }
  }, [isPreloaded]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead 
        title="E-books Gratuits pour Parents | Guides Parentalité, Sommeil, Développement Bébé"
        description="Téléchargez gratuitement nos e-books sur la parentalité : guides sommeil bébé, développement enfant, gentle parenting, diversification alimentaire et plus."
        canonicalUrl="https://babybaby.app/ebooks"
        ogImage="https://babybaby.app/lovable-uploads/etapes-developpement-cover.jpg"
        keywords={[
          "ebook gratuit parentalité", "guide bébé pdf", "livre sommeil bébé gratuit",
          "guide développement enfant", "ebook gentle parenting", "livre diversification alimentaire",
          "guide coliques bébé", "ebook allaitement"
        ]}
      />
      <BreadcrumbSchema 
        items={[
          { name: "Accueil", url: "https://babybaby.app" },
          { name: "E-books", url: "https://babybaby.app/ebooks" }
        ]}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(ebooksSchema)}
        </script>
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-center mb-8 text-babybaby-cosmic">
              E-books Gratuits pour Parents
            </h1>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Téléchargez nos guides gratuits sur le sommeil, le développement et la parentalité positive
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Search bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un e-book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              <EbookFilters
                selectedFileType={selectedFileType}
                onFileTypeChange={setSelectedFileType}
              />
            </div>

            <EbookGrid ebooks={filteredEbooks} />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EbooksPage;
