
import React from 'react';
import Markdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ArticleContentProps {
  content: string;
  excerpt: string;
  series?: {
    id: string;
    name: string;
    position: number;
  };
  relatedArticles?: Array<{
    id: number;
    title: string;
    position: number;
  }>;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ 
  content, 
  excerpt, 
  series,
  relatedArticles 
}) => {
  return (
    <div className="space-y-8">
      <div className="prose prose-lg max-w-none">
        {content ? (
          <Markdown>
            {content}
          </Markdown>
        ) : (
          <p className="text-gray-700 mb-4">
            {excerpt}
          </p>
        )}
      </div>
      
      {series && relatedArticles && relatedArticles.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-babybaby-cosmic" size={20} />
            <h3 className="text-xl font-semibold text-babybaby-cosmic">
              Série : {series.name}
            </h3>
          </div>
          
          <div className="space-y-3">
            {relatedArticles
              .sort((a, b) => a.position - b.position)
              .map((article) => (
                <div 
                  key={article.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    article.position === series.position 
                      ? "bg-babybaby-cosmic/10 border border-babybaby-cosmic/30" 
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline"
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center p-1",
                        article.position === series.position 
                          ? "bg-babybaby-cosmic text-white border-babybaby-cosmic" 
                          : ""
                      )}
                    >
                      {article.position}
                    </Badge>
                    <span className={cn(
                      article.position === series.position ? "font-medium" : ""
                    )}>
                      {article.title}
                    </span>
                  </div>
                  
                  {article.position !== series.position && (
                    <Link to={`/articles/${article.id}`}>
                      <Button variant="ghost" size="sm">
                        Lire <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleContent;
