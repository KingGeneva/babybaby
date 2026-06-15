import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import logoAsset from '@/assets/logo-babybaby.png.asset.json';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const heights = {
    sm: 'h-8',
    md: 'h-10 md:h-12',
    lg: 'h-14 md:h-20',
  };

  return (
    <motion.div
      className={cn('flex items-center transition-all duration-300', className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <img
        src={logoAsset.url}
        alt="BabyBaby"
        className={cn(heights[size], 'w-auto object-contain')}
        loading="eager"
        decoding="async"
        width={1024}
        height={1024}
      />
    </motion.div>
  );
};

export default Logo;

