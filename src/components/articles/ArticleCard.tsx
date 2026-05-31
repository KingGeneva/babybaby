import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareArticle from './ShareArticle';
import { articleUrl } from '@/lib/articleUrl';

type Article = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  views?: number;
  featured?: boolean;
  content?: string;
  slug?: string;
};

interface ArticleCardProps {
  article: Article;
}

// Estimate reading time (~200 words/min). Fallback to excerpt length.
const estimateReadingTime = (article: Article): number => {
  const source = article.content || article.excerpt || '';
  const words = source.trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [imageError, setImageError] = React.useState(false);
  const readingTime = estimateReadingTime(article);

  // Choose ONE badge max, by priority: featured > new (id===1) > category
  const isNew = article.id === 1;
  const badge = article.featured
    ? { label: 'À la une', className: 'bg-secondary text-secondary-foreground' }
    : isNew
    ? { label: 'Nouveau', className: 'bg-primary text-primary-foreground' }
    : { label: article.category, className: 'bg-card text-foreground border border-border' };

  return (
    <Card className="group overflow-hidden h-full flex flex-col bg-card border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-2xl">
      <Link to={`/articles/${article.id}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
        {!imageError && (
          <motion.img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur ${badge.className}`}>
            {badge.label}
          </span>
        </div>
      </Link>

      <CardHeader className="pb-2">
        <Link to={`/articles/${article.id}`}>
          <CardTitle className="font-display text-2xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground mt-2 gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {article.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime} min de lecture
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <CardDescription className="line-clamp-3 text-sm leading-relaxed">{article.excerpt}</CardDescription>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center border-t border-border/50 mt-2 pt-4">
        <ShareArticle article={article} />
        <Link to={`/articles/${article.id}`}>
          <motion.div
            className="text-primary flex items-center text-sm font-medium group/link"
            whileHover={{ x: 4 }}
          >
            Lire l'article
            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-0.5" />
          </motion.div>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
