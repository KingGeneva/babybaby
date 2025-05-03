
import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { Instagram, Facebook, Twitter, Youtube, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <footer className="relative pt-20 pb-10 px-4 bg-gradient-to-b from-babybaby-lightblue/30 to-white">
      <div className="container mx-auto">
        <div className="glass-card p-8 mb-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-4 text-gray-600">
                L'application complète pour accompagner les parents modernes dans leur aventure.
              </p>
              <div className="flex mt-4 space-x-3">
                {socialIcons.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-8 h-8 rounded-full bg-babybaby-cosmic flex items-center justify-center text-white"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {social.icon}
                  </motion.a>
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
                        className="text-gray-600 hover:text-babybaby-cosmic transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <motion.button
            className="absolute -top-5 right-5 w-10 h-10 rounded-full bg-babybaby-cosmic text-white flex items-center justify-center shadow-lg"
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BabyBaby. Tous droits réservés. babybaby.org</p>
          <p className="mt-1">Conçu avec ❤️ pour les parents du monde entier</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
