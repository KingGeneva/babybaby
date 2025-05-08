
import React from 'react';

interface ArticleImageProps {
  image: string;
  title: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ image, title }) => {
  if (!image || image === "/placeholder.svg") {
    return null;
  }
  
  // Conversion des URL d'images pour utiliser WebP si possible
  const imageUrl = image.includes('.webp') ? image : image;
  const imageType = image.includes('.webp') ? 'image/webp' : 'image/jpeg';
  
  return (
    <div className="mb-8">
      <picture>
        {/* Fallback pour les navigateurs qui ne supportent pas WebP */}
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]"
          loading="lazy"
          decoding="async"
          fetchPriority="high"
          width="800"
          height="500"
        />
      </picture>
    </div>
  );
};

export default ArticleImage;
