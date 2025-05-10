
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const ContestsPage = () => {
  return (
    <div className="min-h-screen">
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
            
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg shadow-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl font-medium text-gray-500"
              >
                À venir
              </motion.div>
              <p className="mt-6 text-gray-600 max-w-md text-center">
                Aucun concours n'est actuellement en cours. Revenez bientôt pour découvrir nos prochaines opportunités !
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContestsPage;
