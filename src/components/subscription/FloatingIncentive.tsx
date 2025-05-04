
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Gift, ArrowRight } from 'lucide-react';
import SocialProof from './SocialProof';

interface FloatingIncentiveProps {
  scrollThreshold?: number;
  dismissForDays?: number;
}

const FloatingIncentive: React.FC<FloatingIncentiveProps> = ({
  scrollThreshold = 300,
  dismissForDays = 7
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has dismissed this component
    const dismissedUntil = localStorage.getItem('incentiveDismissedUntil');
    
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      return; // Still in dismissed period
    }
    
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);
  
  const handleDismiss = () => {
    setVisible(false);
    
    // Set dismissed state for X days
    const dismissUntil = new Date();
    dismissUntil.setDate(dismissUntil.getDate() + dismissForDays);
    localStorage.setItem('incentiveDismissedUntil', dismissUntil.toString());
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 right-4 max-w-xs md:max-w-sm bg-white rounded-lg shadow-xl border border-babybaby-cosmic/20 p-4 z-50"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-babybaby-cosmic/10 p-1.5 rounded-full">
              <Gift className="h-4 w-4 text-babybaby-cosmic" />
            </div>
            <h4 className="font-bold text-sm text-babybaby-cosmic">
              Offre spéciale nouveaux membres
            </h4>
          </div>
          
          <p className="text-xs text-gray-600 mb-3">
            Recevez gratuitement notre guide complet <span className="font-semibold">"Les 30 premiers jours avec bébé"</span> et débloquez des outils exclusifs.
          </p>
          
          <SocialProof compact className="mb-3" />
          
          <div className="flex justify-between items-center gap-2">
            <Link to="/auth" className="block w-full">
              <Button 
                size="sm" 
                className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 group transition-all duration-300"
              >
                <span>S'inscrire gratuitement</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <p className="text-[10px] text-gray-400 mt-3 text-center">
            Rejoignez plus de 15 000 parents satisfaits
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingIncentive;
