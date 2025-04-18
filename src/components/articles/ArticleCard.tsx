
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareArticle from './ShareArticle';

type Article = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
};

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover-scale transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={handleImageError}
          />
          <div className="absolute top-0 left-0 bg-babybaby-cosmic text-white px-3 py-1 m-3 rounded-full text-xs">
            {article.category}
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            {article.date}
          </div>
        </CardHeader>
        
        <CardContent className="pb-4 flex-grow">
          <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
        </CardContent>

        <CardFooter className="pt-0 flex justify-between items-center">
          <ShareArticle article={article} />
          <Link to={`/articles/${article.id}`}>
            <motion.div
              className="text-babybaby-cosmic flex items-center text-sm hover:underline"
              whileHover={{ x: 5 }}
            >
              Lire la suite <ChevronRight className="h-4 w-4 ml-1" />
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ArticleCard;
