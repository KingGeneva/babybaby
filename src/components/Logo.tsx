
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-5xl',
  };

  return (
    <div 
      className={cn(
        "font-comfortaa font-bold opacity-0 transition-opacity duration-300 ease-in hover:scale-105 transform transition-transform",
        sizeClasses[size],
        className
      )}
      style={{ animation: 'fadeIn 0.3s forwards' }}
    >
      <span className="text-babybaby-cosmic">Baby</span>
      <span className="text-babybaby-pink">Baby</span>
    </div>
  );
};

export default Logo;
