
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <motion.div 
      className={cn(
        "font-comfortaa font-bold transition-all duration-300",
        sizeClasses[size],
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <span className="text-babybaby-cosmic bg-gradient-to-r from-babybaby-cosmic to-blue-500 bg-clip-text text-transparent">
        Baby
      </span>
      <span className="text-babybaby-pink bg-gradient-to-r from-babybaby-pink to-pink-400 bg-clip-text text-transparent">
        Baby
      </span>
    </motion.div>
  );
};

export default Logo;
