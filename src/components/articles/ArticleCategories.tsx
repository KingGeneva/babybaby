
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ArticleCategoriesProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const ArticleCategories: React.FC<ArticleCategoriesProps> = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 md:max-w-[70%]">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          className={cn(
            "cursor-pointer px-4 min-h-11 whitespace-nowrap rounded-full",
            selectedCategory === category 
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "text-foreground hover:bg-muted hover:text-foreground"
          )}
          onClick={() => setSelectedCategory(category)}
          aria-pressed={selectedCategory === category}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default ArticleCategories;
