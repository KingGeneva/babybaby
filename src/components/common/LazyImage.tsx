
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string;
  placeholderClassName?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholderSrc = '/placeholder.svg',
  placeholderClassName,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(placeholderSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) return;
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <img
      src={error ? placeholderSrc : imgSrc}
      alt={alt}
      className={cn(
        className,
        !isLoaded && placeholderClassName,
        'transition-opacity',
        isLoaded ? 'opacity-100' : 'opacity-60'
      )}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default LazyImage;
