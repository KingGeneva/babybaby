
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
          className="fixed bottom-4 right-4 max-w-xs bg-white rounded-lg shadow-lg p-4 z-50"
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
          
          <h4 className="font-bold text-sm text-babybaby-cosmic mb-2">
            Offre spéciale nouveaux utilisateurs
          </h4>
          
          <p className="text-xs text-gray-600 mb-4">
            Inscrivez-vous aujourd'hui et recevez notre guide exclusif "Les 30 premiers jours avec bébé".
          </p>
          
          <div className="flex justify-between items-center gap-2">
            <Link to="/auth" className="block w-full">
              <Button size="sm" className="w-full bg-babybaby-cosmic">
                S'inscrire gratuitement
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingIncentive;
