
import React from 'react';
import Logo from './Logo';
import { Instagram, Facebook, Twitter, ArrowUp, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const Footer: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  };
  
  const socialIcons = [
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/babybabyorg/' },
    { icon: <Facebook size={20} />, href: 'https://www.facebook.com/share/15EvBcNAmu/' },
    { icon: <Twitter size={20} />, href: 'https://x.com/babybaby_org?t=HQ6BT0JV7_aomxxW2riyow&s=09' },
  ];
  
  const footerLinks = [
    { 
      title: 'Application',
      links: [
        { name: 'Accueil', href: '/' },
        { name: 'Tableau de bord', href: '/parental-dashboard' },
        { name: 'Outils', href: '/tools' },
        { name: 'Communauté', href: '/community' },
      ]
    },
    { 
      title: 'Support',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
        { name: 'À propos', href: '/about' },
      ]
    },
    { 
      title: 'Découvrir',
      links: [
        { name: 'E-books', href: '/ebooks' },
        { name: 'Meilleurs produits', href: '/meilleurs-produits-bebe-2026' },
        { name: 'Concours', href: '/contests' },
      ]
    },
  ];

  return (
    <footer className="relative pt-20 pb-28 md:pb-10 px-5 md:px-8 bg-deep text-background border-t border-background/10">
      <div className="container mx-auto">
        <div className="mb-10 relative" data-reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-4 text-background/65 max-w-xs">
                Des guides, comparatifs et outils pratiques de la grossesse aux deux ans de bébé.
              </p>
              <div className="flex mt-4 space-x-3">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="min-w-11 min-h-11 rounded-full border border-background/20 flex items-center justify-center text-background hover:text-accent"
                    aria-label={`Visiter BabyBaby sur ${index === 0 ? 'Instagram' : index === 1 ? 'Facebook' : 'X'}`}
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
                <h4 className="font-display text-xl mb-4 text-background">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.href}
                        className="inline-flex min-h-11 items-center text-background/65 hover:text-background transition-colors"
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
          <div className="mt-10 border-y border-background/15 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
              <div className="flex items-center gap-3">
                <div className="min-w-11 min-h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Rejoignez notre communauté</h4>
                  <p className="text-xs text-background/60">Accédez à nos outils et ressources gratuites</p>
                </div>
              </div>
              <Link to="/free-offers">
                <Button size="sm" variant="secondary" className="w-full md:w-auto min-h-11 rounded-full">
                  Découvrir nos offres
                </Button>
              </Link>
            </div>
          </div>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute -top-5 right-0 min-w-11 min-h-11 rounded-full"
            onClick={scrollToTop}
            aria-label="Retourner en haut de la page"
          >
            <ArrowUp size={20} />
          </Button>
        </div>
        
        <div className="text-center text-sm text-background/55">
          <p>&copy; {new Date().getFullYear()} BabyBaby. Tous droits réservés. babybaby.org</p>
          <p className="mt-1">Conçu avec soin pour accompagner les parents.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
