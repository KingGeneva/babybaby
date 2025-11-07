
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
    <div className="mb-8 relative w-full aspect-video overflow-hidden rounded-lg shadow-md bg-muted">
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img 
        src={image} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        width="800"
        height="450"
        onLoad={() => setIsLoading(false)}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
      />
    </div>
  );
};

export default ArticleImage;
