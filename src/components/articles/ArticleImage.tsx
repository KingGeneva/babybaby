
import React from 'react';

interface ArticleImageProps {
  image: string;
  title: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ image, title }) => {
  if (!image || image === "/placeholder.svg") {
    return null;
  }
  
  return (
    <div className="mb-8">
      <img 
        src={image} 
        alt={title}
        className="w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]"
        loading="eager"
      />
    </div>
  );
};

export default ArticleImage;
