
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
        <Badge 
          key={category}
          variant="outline"
          className={cn(
            "cursor-pointer px-4 py-2 whitespace-nowrap",
            selectedCategory === category 
              ? "bg-babybaby-cosmic text-white hover:bg-babybaby-cosmic/90" 
              : "hover:bg-gray-100"
          )}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default ArticleCategories;
