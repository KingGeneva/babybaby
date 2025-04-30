
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import ShareArticle from './ShareArticle';
import { Article } from '@/types/article';

interface ArticleActionsProps {
  article: Article;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({ article }) => {
  return (
    <div className="flex justify-between items-center my-8 py-4 border-t border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
          <Heart className="h-5 w-5" />
          <span>42</span>
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-babybaby-cosmic transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span>12 commentaires</span>
        </button>
      </div>
      <div className="flex gap-2">
        <ShareArticle article={article} />
        <Button variant="outline" size="sm">
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default ArticleActions;
