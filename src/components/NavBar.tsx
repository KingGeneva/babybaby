
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import { MenuIcon, X, Globe, Link2, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const navLinks = [
  { title: 'Accueil', href: '/' },
  { title: 'Tableau de Bord', href: '/dashboard' },
  { title: 'Outils', href: '/tools' },
  { title: 'Communauté', href: '/community' },
  { title: 'Articles', href: '/articles' },
  { title: 'E-books', href: '/ebooks' },
];

const resourceLinks = [
  {
    title: "Naître et grandir",
    href: "https://naitreetgrandir.com",
    description: "Guide complet sur le développement des enfants"
  },
  {
    title: "INSPQ",
    href: "https://inspq.qc.ca",
    description: "Institut national de santé publique du Québec"
  },
  {
    title: "Services aux familles",
    href: "https://quebec.ca/famille",
    description: "Portail Québec - Services aux familles"
  },
  {
    title: "Clic Santé",
    href: "https://clicsante.ca",
    description: "Plateforme de prise de rendez-vous médicaux"
  },
  {
    title: "SAAQ - Sièges d'auto",
    href: "https://saaq.gouv.qc.ca",
    description: "Évaluations de sièges d'auto"
  },
  {
    title: "Maman pour la vie",
    href: "https://mamanpourlavie.com",
    description: "Communauté et ressources pour les mamans"
  },
  {
    title: "Éducaloi - Parentalité",
    href: "https://educaloi.qc.ca",
    description: "Informations sur les droits parentaux au Québec"
  },
  {
    title: "Jouer c'est magique",
    href: "https://jouercestmagique.org",
    description: "Ressources des CPE du Québec"
  },
  {
    title: "Papa Positive",
    href: "https://papapositive.fr",
    description: "Ressources pour les papas"
  }
];

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = (href: string) => {
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
                {location.pathname === link.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-babybaby-cosmic"
                    layoutId="activeLink"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-800 hover:text-babybaby-cosmic transition-colors duration-300">
                    <Globe className="mr-2 h-4 w-4" />
                    Ressources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px]">
                      {resourceLinks.map((resource) => (
                        <a
                          key={resource.href}
                          href={resource.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            <div className="text-sm font-medium leading-none">{resource.title}</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {resource.description}
                          </p>
                        </a>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
                    location.pathname === link.href
                      ? "bg-babybaby-cosmic text-white"
                      : "hover:bg-babybaby-cosmic/20"
                  )}
                >
                  {link.title}
                </Link>
              ))}
              
              <div className="relative px-3 py-2">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center w-full text-sm font-medium"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Ressources
                  <ChevronDown className="ml-auto h-4 w-4" />
                </button>
                <div className="mt-2 space-y-2">
                  {resourceLinks.map((resource) => (
                    <a
                      key={resource.href}
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-2 py-1.5 text-sm text-gray-600 hover:text-babybaby-cosmic"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default NavBar;
