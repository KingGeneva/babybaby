
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import { ForumCategory } from '@/components/forum/types';

interface CategoryHeaderProps {
  category: ForumCategory | null;
  handleCreateTopic: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, handleCreateTopic }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="font-normal p-0"
            onClick={() => navigate('/forum')}
          >
            <ChevronLeft size={16} className="mr-1" />
            Forum
          </Button>
          <span className="text-gray-400">•</span>
          <h1 className="text-2xl font-bold text-babybaby-cosmic">{category?.name}</h1>
        </div>
        <p className="text-gray-600">{category?.description}</p>
      </div>
      <Button 
        className="mt-4 md:mt-0 bg-babybaby-cosmic hover:bg-babybaby-cosmic/90" 
        onClick={handleCreateTopic}
      >
        <PlusCircle size={18} className="mr-2" />
        Nouvelle discussion
      </Button>
    </div>
  );
};

export default CategoryHeader;
