
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '@/types/article';

interface ArticleListViewProps {
  articles: Article[];
}

const ArticleListView: React.FC<ArticleListViewProps> = ({ articles }) => {
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
      className="flex flex-col space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {articles.map((article) => (
        <motion.div key={article.id} variants={itemVariants}>
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <div className="relative h-48 md:h-full">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  {article.featured && (
                    <Badge className="absolute top-2 right-2 bg-babybaby-cosmic">
                      À la une
                    </Badge>
                  )}
                </div>
              </div>
              <div className="md:w-3/4 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="text-xs text-gray-500">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-gray-600 flex-grow mb-4">{article.excerpt}</p>
                <Link 
                  to={`/articles/${article.id}`}
                  className="flex items-center text-babybaby-cosmic self-end hover:underline"
                >
                  Lire l'article <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ArticleListView;
