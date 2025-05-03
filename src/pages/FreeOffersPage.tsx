
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Gift, Coupon, Baby, ShoppingBag } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SEOHead from '@/components/common/SEOHead';

interface OfferItem {
  id: string;
  title: string;
  brand: string;
  description: string;
  registerLink: string;
  registerText: string;
  icon: React.ElementType;
}

const FreeOffersPage = () => {
  const offers: OfferItem[] = [
    {
      id: 'huggies',
      title: 'Programme « Des câlins pour tous les bébés »',
      brand: 'Huggies',
      description: 'En vous inscrivant, recevez gratuitement une Hug Box contenant des couches Huggies® Little Snugglers et des lingettes Natural Care® pour peaux sensibles. Ce programme offre également des conseils parentaux et des offres exclusives.',
      registerLink: 'https://www.huggies.com/fr-ca/why-huggies/hugs-change-everything/register',
      registerText: 'Inscription au programme Huggies',
      icon: Baby
    },
    {
      id: 'enfamil',
      title: 'Programme « Mes premiers moments »',
      brand: 'Enfamil',
      description: 'Rejoignez le programme « Mes premiers moments » d\'Enfamil A+ pour bénéficier d\'échantillons gratuits de préparations pour nourrissons, de coupons et d\'offres spéciales. Une option Premium, moyennant un paiement unique, offre jusqu\'à 500 $ en économies.',
      registerLink: 'https://www.enfamil.ca/fr/account/register',
      registerText: 'Inscription au programme Enfamil',
      icon: Gift
    },
    {
      id: 'pampers',
      title: 'Programme P&G « Redonne »',
      brand: 'Pampers',
      description: 'Inscrivez-vous au programme P&G « Redonne » pour accéder à des offres exclusives sur les produits Pampers, accumuler des points échangeables contre des récompenses et soutenir des causes sociales par vos interactions.',
      registerLink: 'https://www.pggoodeveryday.ca/fr/inscrivez-vous/pampers/',
      registerText: 'Inscription au programme Pampers',
      icon: Coupon
    },
    {
      id: 'bondepart',
      title: 'Club Bébé',
      brand: 'Bon Départ',
      description: 'Le Club Bébé Bon Départ offre des rabais et des offres exclusives sur les produits de nutrition infantile. Les membres ont également accès à des conseils personnalisés, des outils pratiques et un soutien nutritionnel basé sur la science.',
      registerLink: 'https://goodstartbaby.ca/fr/pages/club-bebe',
      registerText: 'Inscription au Club Bébé Bon Départ',
      icon: Gift
    },
    {
      id: 'babiesrus',
      title: 'Registre de bébé',
      brand: 'Babies "R" Us Canada',
      description: 'Créez gratuitement votre registre de bébé en ligne ou en magasin chez Babies "R" Us Canada. Vous recevrez un sac de bienvenue rempli d\'échantillons et d\'offres, et pourrez partager votre liste avec vos proches pour faciliter les cadeaux.',
      registerLink: 'https://www.babiesrus.ca/fr/faq-babyregistry.html',
      registerText: 'Créer un registre de bébé',
      icon: ShoppingBag
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Offres Gratuites Pour Parents | BabyBaby"
        description="Découvrez une sélection d'offres gratuites, coupons et trousses pour bébé disponibles au Canada et au Québec. Profitez d'échantillons de couches, préparations pour nourrissons et plus encore."
        keywords="offres gratuites bébé, coupons bébé, échantillons gratuits bébé, trousse bébé gratuite, cadeaux bébé canada, offres parents québec"
      />
      <NavBar />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-babybaby-cosmic">Offres Gratuites Pour Parents</h1>
            <p className="max-w-2xl mx-auto text-gray-700">
              Une sélection d'offres gratuites, coupons et trousses pour bébé disponibles au Canada et au Québec
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-babybaby-cosmic/10 p-2 rounded-full mr-3">
                          <offer.icon className="h-5 w-5 text-babybaby-cosmic" />
                        </div>
                        <CardTitle className="text-lg">{offer.brand}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base font-medium mt-2">{offer.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{offer.description}</p>
                  </CardContent>
                  <CardFooter>
                    <a
                      href={offer.registerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-babybaby-cosmic hover:underline font-medium"
                    >
                      👉 {offer.registerText}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-babybaby-cosmic/5 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-babybaby-cosmic">Conseils pour profiter au maximum des offres</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Créez une adresse email spécifique pour les inscriptions aux programmes afin d'éviter de surcharger votre boîte principale</li>
              <li>Consultez les conditions d'adhésion avant de vous inscrire</li>
              <li>Notez les dates d'expiration des coupons et offres reçus</li>
              <li>Partagez ces offres avec d'autres parents qui pourraient en bénéficier</li>
            </ul>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Ces offres sont valables au moment de la publication et peuvent être modifiées par les marques à tout moment.
              BabyBaby n'est pas affilié aux marques mentionnées et ne perçoit aucune commission sur ces offres.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FreeOffersPage;
