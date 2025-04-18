
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  logoSrc?: string;  // New prop to allow custom logo
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  logoSrc = '/path/to/default/logo.png'  // Placeholder default logo path
}) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 md:h-12 w-auto',
    lg: 'h-16 md:h-20 w-auto',
  };

  return (
    <motion.img 
      src={logoSrc}
      alt="BabyBaby Logo"
      className={cn(
        "object-contain", 
        sizeClasses[size], 
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default Logo;
