
import React from 'react';
import { Link } from 'react-router-dom';
import { developpementArticles } from '@/data/articles/developpement';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface DevelopmentArticlesProps {
  ageMonths: number;
}

const DevelopmentArticles: React.FC<DevelopmentArticlesProps> = ({ ageMonths }) => {
  // Filter articles relevant for the current age
  // This is a simple implementation - in a real app you might want to tag articles with age ranges
  const relevantArticles = developpementArticles.slice(0, 2);
  
  return (
    <div className="mt-4">
      <h3 className="text-base font-medium mb-3">Articles recommandés</h3>
      <div className="space-y-3">
        {relevantArticles.map(article => (
          <div 
            key={article.id} 
            className="p-3 bg-white rounded-lg border border-gray-100 hover:border-babybaby-cosmic/30 hover:shadow-sm transition-all"
          >
            <Link to={`/articles/${article.id}`}>
              <h4 className="font-medium text-babybaby-cosmic hover:underline">{article.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{article.excerpt.substring(0, 80)}...</p>
            </Link>
          </div>
        ))}
        
        <Link to="/articles?category=Développement">
          <Button variant="ghost" size="sm" className="w-full mt-1 text-babybaby-cosmic">
            Tous les articles sur le développement
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DevelopmentArticles;
