
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleImageProps {
  image: string;
  title: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ image, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  if (!image || image === "/placeholder.svg") {
    return null;
  }
  
  return (
    <div className="mb-8 w-full overflow-hidden rounded-lg shadow-md bg-muted relative" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover absolute inset-0"
        loading="eager"
        decoding="async"
        width="1200"
        height="675"
        onLoad={() => setIsLoading(false)}
        style={{ 
          opacity: isLoading ? 0 : 1, 
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default ArticleImage;
