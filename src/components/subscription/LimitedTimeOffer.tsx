
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

interface LimitedTimeOfferProps {
  expiryDays?: number;
  offerText?: string;
  className?: string;
}

const LimitedTimeOffer: React.FC<LimitedTimeOfferProps> = ({ 
  expiryDays = 3,
  offerText = "Offre spéciale de lancement : Accès à tous nos outils et contenus exclusifs !",
  className 
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: expiryDays, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set expiry date to X days from now if not already stored
    const storedExpiryDate = localStorage.getItem('offerExpiryDate');
    const expiryDate = storedExpiryDate 
      ? new Date(storedExpiryDate) 
      : new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    
    if (!storedExpiryDate) {
      localStorage.setItem('offerExpiryDate', expiryDate.toString());
    }

    const updateCountdown = () => {
      const now = new Date();
      const difference = expiryDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [expiryDays]);

  // Don't render if offer has expired
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <motion.div 
      className={`bg-gradient-to-r from-babybaby-cosmic/20 to-babybaby-cosmic/5 p-4 rounded-lg ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-babybaby-cosmic text-white p-2 rounded-full">
          <Bell className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{offerText}</p>
          <div className="flex gap-2 mt-1 text-xs font-medium">
            <span>Se termine dans:</span>
            <div className="flex gap-1">
              {timeLeft.days > 0 && <span>{timeLeft.days}j</span>}
              <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LimitedTimeOffer;
