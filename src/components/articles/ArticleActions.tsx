import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import ShareArticle from './ShareArticle';
import { Article } from '@/types/article';
import { useArticleFavorites } from '@/hooks/useArticleFavorites';
import { cn } from '@/lib/utils';

interface ArticleActionsProps {
  article: Article;
  commentsCount?: number;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({ article, commentsCount }) => {
  const { isFavorite, toggle } = useArticleFavorites();
  const fav = isFavorite(article.id);

  const scrollToComments = () => {
    const el = document.getElementById('comments');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-wrap justify-between items-center my-8 py-4 border-t border-b border-border gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => toggle(article.id)}
          aria-pressed={fav}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={cn(
            'flex items-center gap-1.5 transition-colors',
            fav ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
          )}
        >
          <Heart className={cn('h-5 w-5', fav && 'fill-current')} />
          <span className="text-sm">{fav ? 'Favori' : 'Favoris'}</span>
        </button>
        <button
          onClick={scrollToComments}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">
            {commentsCount !== undefined ? `${commentsCount} commentaires` : 'Commenter'}
          </span>
        </button>
      </div>
      <div className="flex gap-2">
        <ShareArticle article={article} />
      </div>
    </div>
  );
};

export default ArticleActions;
