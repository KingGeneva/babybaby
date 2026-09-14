
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Gift, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const Benefit: React.FC<BenefitProps> = ({ icon, title, description, className }) => {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="bg-babybaby-cosmic/10 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};

interface SubscriptionBenefitsProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const SubscriptionBenefits: React.FC<SubscriptionBenefitsProps> = ({ 
  variant = 'full',
  className
}) => {
  const benefits = [
    {
      icon: <Check className="h-4 w-4 text-babybaby-cosmic" />,
      title: "Contenus exclusifs",
      description: "Accédez à des articles et guides réservés aux utilisateurs inscrits"
    },
    {
      icon: <Star className="h-4 w-4 text-babybaby-cosmic" />,
      title: "Outils avancés",
      description: "Profitez d'outils pour suivre le développement de votre bébé"
    },
    {
      icon: <Gift className="h-4 w-4 text-babybaby-cosmic" />,
      title: "Ebook gratuit",
      description: "Recevez notre guide '60 jours avec bébé' dès votre inscription"
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-2", className)}>
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {benefit.icon}
            <span>{benefit.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("space-y-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {benefits.map((benefit, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Benefit {...benefit} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SubscriptionBenefits;
