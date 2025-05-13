
import React from 'react';
import { Button } from '@/components/ui/button';
import { FAQCategory, faqCategories } from './faqData';

interface FAQCategoryFilterProps {
  selectedCategory: FAQCategory;
  setSelectedCategory: (category: FAQCategory) => void;
}

const FAQCategoryFilter: React.FC<FAQCategoryFilterProps> = ({ 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <div className="flex overflow-x-auto space-x-2 pb-4 justify-center">
      <Button
        key="Tous"
        variant={selectedCategory === "Tous" ? "default" : "outline"}
        className="whitespace-nowrap"
        onClick={() => setSelectedCategory("Tous")}
      >
        Tous
      </Button>
      {faqCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="whitespace-nowrap"
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default FAQCategoryFilter;
