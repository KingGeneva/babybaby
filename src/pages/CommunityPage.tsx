
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Heart } from 'lucide-react';

const CommunityPage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <motion.h1 
            className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Communauté
          </motion.h1>
          
          <motion.div
            className="glass-card p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Bienvenue dans la Communauté</h2>
                <p className="text-gray-700 mb-4">
                  Rejoignez des milliers de parents pour partager vos expériences, poser vos questions et obtenir du soutien dans votre parcours parental.
                </p>
                <p className="text-gray-700">
                  Notre communauté bienveillante est là pour vous accompagner dans tous les aspects de la parentalité, des premiers jours à la petite enfance.
                </p>
              </div>
              
              <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div 
                  className="glass-card p-4 text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-full bg-babybaby-cosmic text-white flex items-center justify-center mx-auto mb-2">
                    <Users size={24} />
                  </div>
                  <h3 className="font-bold">10K+</h3>
                  <p className="text-sm text-gray-600">Membres</p>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-4 text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto mb-2">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="font-bold">5K+</h3>
                  <p className="text-sm text-gray-600">Discussions</p>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-4 text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center mx-auto mb-2">
                    <Heart size={24} />
                  </div>
                  <h3 className="font-bold">50K+</h3>
                  <p className="text-sm text-gray-600">Entraide</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <div className="text-center mb-12">
            <motion.h2
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Fonctionnalités à venir
            </motion.h2>
            <motion.p
              className="text-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Notre communauté est en cours de développement. Bientôt vous pourrez profiter de forums de discussion, de profils personnalisés, et bien plus encore!
            </motion.p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityPage;
