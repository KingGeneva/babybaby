
import React from 'react';
import Logo from './Logo';
import { Instagram, Facebook, Twitter, Youtube, ArrowUp, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const socialIcons = [
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/babybabyorg/' },
    { icon: <Facebook size={20} />, href: 'https://www.facebook.com/share/15EvBcNAmu/' },
    { icon: <Twitter size={20} />, href: 'https://x.com/babybaby_org?t=HQ6BT0JV7_aomxxW2riyow&s=09' },
    { icon: <Youtube size={20} />, href: '#' },
  ];
  
  const footerLinks = [
    { 
      title: 'Application',
      links: [
        { name: 'Accueil', href: '/' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Outils', href: '/tools' },
        { name: 'Communauté', href: '/community' },
      ]
    },
    { 
      title: 'Support',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
        { name: 'Aide', href: '/help' },
      ]
    },
    { 
      title: 'Légal',
      links: [
        { name: 'Conditions d\'utilisation', href: '/terms' },
        { name: 'Politique de confidentialité', href: '/privacy' },
        { name: 'Mentions légales', href: '/legal' },
      ]
    },
  ];

  return (
    <footer className="relative pt-20 pb-10 px-4 bg-gradient-to-b from-babybaby-lightblue/10 to-white dark:from-gray-900/50 dark:to-gray-950">
      <div className="container mx-auto">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-6 relative neu-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                L'application complète pour accompagner les parents modernes dans leur aventure.
              </p>
              <div className="flex mt-4 space-x-3">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-babybaby-cosmic hover-lift"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            
            {footerLinks.map((group, index) => (
              <div key={index} className="md:col-span-1">
                <h4 className="font-bold text-lg mb-4">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-babybaby-cosmic dark:hover:text-babybaby-cosmic transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Subscription incentive banner */}
          <div className="glass-card mt-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-babybaby-cosmic to-blue-400 text-white flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Rejoignez notre communauté</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Accédez à tous nos outils et contenus exclusifs</p>
                </div>
              </div>
              <Link to="/free-offers">
                <Button size="sm" className="cosmic-button hover-lift w-full md:w-auto">
                  Découvrir nos offres
                </Button>
              </Link>
            </div>
          </div>
          
          <button
            className="absolute -top-5 right-5 w-10 h-10 rounded-full cosmic-button flex items-center justify-center hover-lift"
            onClick={scrollToTop}
          >
            <ArrowUp size={20} />
          </button>
        </motion.div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} BabyBaby. Tous droits réservés. babybaby.org</p>
          <p className="mt-1">Conçu avec ❤️ pour les parents du monde entier</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
