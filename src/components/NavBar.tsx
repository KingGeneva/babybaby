import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import { MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const navLinks = [
  { title: 'Accueil', href: '/' },
  { title: 'Tableau de Bord', href: '/dashboard' },
  { title: 'Outils', href: '/tools' },
  { title: 'Communauté', href: '/community' },
  { title: 'Articles', href: '/articles' },
  { title: 'E-books', href: '/ebooks' },
];

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled ? "py-1" : "py-2"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(
        "container mx-auto glass rounded-full px-3 py-2 transition-all duration-500",
        isScrolled ? "cosmic-shadow" : ""
      )}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <img 
                src="/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png" 
                alt="BabyBaby Logo" 
                className="w-7 h-7 md:w-10 md:h-10 object-contain"
                loading="eager"
              />
            </motion.div>
            <Logo />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="relative px-2 py-1 text-gray-800 hover:text-babybaby-cosmic transition-colors duration-300"
              >
                {link.title}
                {activeLink === link.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-babybaby-cosmic"
                    layoutId="activeLink"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <button 
            className="md:hidden text-gray-800 hover:text-babybaby-cosmic transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMenuOpen ? "close" : "menu"}
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 w-full glass mt-1 py-3 px-3 z-50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={cn(
                    "px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium",
                    activeLink === link.href
                      ? "bg-babybaby-cosmic text-white"
                      : "hover:bg-babybaby-cosmic/20"
                  )}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default NavBar;
