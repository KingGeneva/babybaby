
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArticleHeaderProps {
  category: string;
  date: string;
  title: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ category, date, title }) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Badge variant="outline">{category}</Badge>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {date}
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-babybaby-cosmic">
        {title}
      </h1>
    </>
  );
};

export default ArticleHeader;
