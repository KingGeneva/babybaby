
import React from 'react';
import { motion } from 'framer-motion';
import ArticleCard from './ArticleCard';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { ArticleCardSkeleton } from './ArticleSkeleton';

// Animation variants
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const ArticleSection: React.FC = () => {
  const isMobile = useIsMobile();
  const { articles, loading, error } = useArticles("Tous", "");
  
  // Limit to 3 articles for the homepage
  const featuredArticles = articles.slice(0, 3);
  
  return (
    <section className="py-12 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Decorative element */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-babybaby-cosmic rounded-full opacity-70"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic text-center">
            Nos derniers articles
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-center text-sm md:text-base">
            Découvrez nos conseils, astuces et informations pour vous accompagner dans votre aventure parentale.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {loading ? (
            // Display skeletons while loading
            <>
              {Array(isMobile ? 2 : 3).fill(0).map((_, index) => (
                <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                  <ArticleCardSkeleton />
                </motion.div>
              ))}
            </>
          ) : error ? (
            // Display error state
            <div className="col-span-full text-center text-red-500">
              Impossible de charger les articles. Veuillez réessayer plus tard.
            </div>
          ) : (
            // Display loaded articles
            featuredArticles.slice(0, isMobile ? 2 : featuredArticles.length).map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <ArticleCard article={article} />
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/articles">
            <Button 
              size={isMobile ? "default" : "lg"}
              className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explorer tous nos articles
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticleSection;
