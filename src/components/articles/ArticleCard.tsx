
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar, ChevronRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareArticle from './ShareArticle';

type Article = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  views?: number;
  featured?: boolean;
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
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-t-babybaby-cosmic/80">
      <div className="relative h-52 overflow-hidden">
        <motion.img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          onError={handleImageError}
        />
        <div className="absolute top-0 left-0 bg-babybaby-cosmic text-white px-3 py-1 m-3 rounded-full text-xs font-semibold shadow-md">
          {article.category}
        </div>
        {article.featured && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 m-3 rounded-full text-xs font-semibold shadow-md">
            À la une
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-2 hover:text-babybaby-cosmic transition-colors">
          {article.title}
        </CardTitle>
        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-4">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {article.date}
          </div>
          {article.views !== undefined && (
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {article.views} vues
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <CardDescription className="line-clamp-3 text-sm">{article.excerpt}</CardDescription>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <ShareArticle article={article} />
        <Link to={`/articles/${article.id}`}>
          <motion.div
            className="text-babybaby-cosmic flex items-center text-sm hover:underline font-medium group"
            whileHover={{ x: 5 }}
          >
            Lire la suite 
            <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
          </motion.div>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
