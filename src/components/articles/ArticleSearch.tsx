
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ArticleSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ArticleSearch: React.FC<ArticleSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Rechercher un article..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 py-6 text-base"
      />
    </div>
  );
};

export default ArticleSearch;
