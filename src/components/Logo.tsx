import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import logoPacifier from '@/assets/logo-pacifier.png';

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

  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9 md:h-10 md:w-10',
    lg: 'h-12 w-12 md:h-16 md:w-16',
  };

  return (
    <motion.div
      className={cn('flex items-center gap-2 transition-all duration-300', className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <img
        src={logoPacifier}
        alt="BabyBaby logo"
        className={cn(iconSizes[size], 'object-contain drop-shadow-sm')}
        loading="eager"
        decoding="async"
      />
      <span className={cn('font-comfortaa font-bold leading-none', sizeClasses[size])}>
        <span className="bg-gradient-to-r from-babybaby-cosmic to-blue-500 bg-clip-text text-transparent">
          Baby
        </span>
        <span className="bg-gradient-to-r from-babybaby-pink to-pink-400 bg-clip-text text-transparent">
          Baby
        </span>
      </span>
    </motion.div>
  );
};

export default Logo;
