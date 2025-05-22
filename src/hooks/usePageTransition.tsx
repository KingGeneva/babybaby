
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionOptions {
  duration?: number;
  onExit?: () => void;
  onEnter?: () => void;
}

/**
 * Custom hook to handle page transition animations
 */
export function usePageTransition({
  duration = 300,
  onExit,
  onEnter
}: PageTransitionOptions = {}) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Handle location changes
  useEffect(() => {
    // Skip on initial render
    if (currentPath === location.pathname) return;

    // Start exit animation
    setIsTransitioning(true);
    if (onExit) onExit();

    // Schedule enter animation after exit completes
    const timer = setTimeout(() => {
      setCurrentPath(location.pathname);
      setIsTransitioning(false);
      if (onEnter) onEnter();
      
      // Scroll to top on page change
      window.scrollTo(0, 0);
    }, duration);

    return () => clearTimeout(timer);
  }, [location.pathname, duration, onExit, onEnter, currentPath]);

  return {
    isTransitioning,
    currentPath
  };
}
