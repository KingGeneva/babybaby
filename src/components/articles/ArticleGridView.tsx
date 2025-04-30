
import React from 'react';
import { motion } from 'framer-motion';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article } from '@/types/article';

interface ArticleGridViewProps {
  articles: Article[];
}

const ArticleGridView: React.FC<ArticleGridViewProps> = ({ articles }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {articles.map((article) => (
        <motion.div key={article.id} variants={itemVariants}>
          <ArticleCard article={article} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ArticleGridView;
