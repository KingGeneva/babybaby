
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import SEOHead from '@/components/common/SEOHead';
import ContestStructuredData from '@/components/contests/ContestStructuredData';

type FormData = {
  email: string;
};

const ContestsPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  
  const onSubmit = (data: FormData) => {
    // Simuler l'envoi d'un email
    console.log('Email submitted:', data.email);
    toast.success("Merci pour votre inscription !");
    reset();
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Concours et Promotions Exclusives | BabyBaby"
        description="Participez à nos concours exclusifs pour gagner des produits pour bébé et profitez d'offres spéciales. Inscrivez-vous pour être informé des prochains concours."
        canonicalUrl="https://babybaby.app/contests"
        keywords={["concours bébé", "promotions puériculture", "gagner produits bébé", "offres parents"]}
      />
      <ContestStructuredData />
      <NavBar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-8 text-babybaby-cosmic">Concours</h1>
            
            <div className="flex flex-col items-center justify-center py-12 px-4 md:px-8 bg-gray-50 rounded-lg shadow-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-2xl md:text-3xl font-medium text-gray-800 mb-6"
              >
                Prochains concours à venir
              </motion.div>
              
              <p className="text-gray-600 max-w-md text-center mb-8">
                Aucun concours n'est actuellement en cours, mais inscrivez-vous à notre newsletter pour être informé(e) en priorité des prochains concours et offres exclusives !
              </p>
              
              <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Ne ratez pas nos prochains concours !</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('email', { 
                          required: 'Email requis', 
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Adresse email invalide'
                          }
                        })}
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-babybaby-cosmic focus:border-transparent"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      type="submit" 
                      className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                    >
                      S'inscrire aux notifications
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    En vous inscrivant, vous acceptez de recevoir nos emails concernant les concours et offres spéciales. Vous pourrez vous désinscrire à tout moment.
                  </p>
                </form>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Suivez-nous sur les réseaux sociaux pour être informé(e) des prochains concours :
                </p>
                <div className="flex justify-center space-x-4 mt-3">
                  <a href="#" className="text-gray-600 hover:text-babybaby-cosmic">Instagram</a>
                  <a href="#" className="text-gray-600 hover:text-babybaby-cosmic">Facebook</a>
                  <a href="#" className="text-gray-600 hover:text-babybaby-cosmic">Twitter</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContestsPage;
