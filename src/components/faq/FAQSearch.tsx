
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FAQSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const FAQSearch: React.FC<FAQSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative max-w-xl mx-auto mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Rechercher une question..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 py-6 text-base"
      />
    </div>
  );
};

export default FAQSearch;
