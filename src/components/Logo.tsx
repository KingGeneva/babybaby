
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <motion.div 
      className={cn("font-comfortaa font-bold flex items-center", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src="/lovable-uploads/bb3b1ebf-daac-46dd-82ed-5fc2ae608904.png" 
        alt="BabyBaby Logo"
        className={cn(sizeClasses[size])}
      />
      
      {showText && (
        <span className="ml-2">
          <span className="text-babybaby-cosmic">Baby</span>
          <span className="text-babybaby-pink">Baby</span>
        </span>
      )}
    </motion.div>
  );
};

export default Logo;
