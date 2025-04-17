
import React from 'react';
import { motion } from 'framer-motion';
import ArticleCard from './ArticleCard';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

// Données des articles (à remplacer par des données réelles)
const articles = [
  {
    id: 1,
    title: "Comment choisir le bon lait pour bébé",
    excerpt: "Guide complet pour vous aider à choisir le meilleur lait adapté aux besoins de votre bébé.",
    image: "/placeholder.svg",
    category: "Nutrition",
    date: "15 avril 2025",
  },
  {
    id: 2,
    title: "Astuces pour aider bébé à mieux dormir",
    excerpt: "Des conseils pratiques pour établir une routine de sommeil et aider votre bébé à faire ses nuits.",
    image: "/placeholder.svg",
    category: "Sommeil",
    date: "12 avril 2025",
  },
  {
    id: 3,
    title: "Les étapes du développement de 0 à 12 mois",
    excerpt: "Tout ce que vous devez savoir sur les étapes clés du développement de votre enfant.",
    image: "/placeholder.svg",
    category: "Développement",
    date: "10 avril 2025",
  }
];

// Variantes d'animation pour la section
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const ArticleSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">Nos derniers articles</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Découvrez nos conseils, astuces et informations pour vous accompagner dans votre aventure parentale.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Sur mobile, limiter à 2 articles pour une performance optimale */}
          {articles.slice(0, isMobile ? 2 : articles.length).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-8 md:mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/articles">
            <Button 
              size={isMobile ? "default" : "lg"}
              className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80"
            >
              Voir tous les articles
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticleSection;
