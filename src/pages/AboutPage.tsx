
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Users, Award, Mail } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="À propos de BabyBaby" 
        description="Découvrez l'histoire de BabyBaby, née au Québec pour accompagner les parents dans leur parcours."
        canonicalUrl="https://babybaby.app/about"
      />
      
      <NavBar />
      
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-babybaby-cosmic mb-6">
              Notre histoire
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Créé pour des parents par des parents québécois, BabyBaby est né d'une ambition simple : 
              rendre le parcours parental plus serein et épanouissant.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="/lovable-uploads/d50b4331-6d8b-45e6-9e58-e8fc2d198a37.png" 
                alt="L'équipe BabyBaby" 
                className="rounded-2xl shadow-lg w-full"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Une vision québécoise de la parentalité
              </h2>
              <p className="text-gray-600">
                Tout a commencé en 2023 lorsque Kevin Gagné, entrepreneur de Québec, 
                a constaté le manque d'outils numériques adaptés aux besoins des parents d'aujourd'hui.
              </p>
              <p className="text-gray-600">
                Passionné par la technologie et motivé par sa propre expérience parentale, 
                il a créé babybaby.org : une plateforme intuitive qui réunit tout ce dont les parents 
                ont besoin pour suivre et célébrer le développement de leur enfant.
              </p>
              <p className="text-gray-600 font-medium">
                Aujourd'hui, BabyBaby continue de grandir avec une mission claire : 
                accompagner les parents québécois et francophones du monde entier dans leur 
                parcours parental grâce à des outils simples et efficaces.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            className="max-w-4xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
              Nos valeurs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-babybaby-cosmic/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-7 w-7 text-babybaby-cosmic" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Bienveillance</h3>
                <p className="text-gray-600">Nous accompagnons sans juger, en reconnaissant que chaque parcours parental est unique.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-babybaby-cosmic/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-7 w-7 text-babybaby-cosmic" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-600">Nous développons des outils intuitifs et pratiques adaptés aux besoins réels des parents.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-babybaby-cosmic/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-babybaby-cosmic" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Proximité</h3>
                <p className="text-gray-600">Nous créons une communauté bienveillante où les parents peuvent échanger et s'entraider.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-xl font-semibold mb-4">Rejoignez notre aventure !</h3>
              <p className="text-gray-600 mb-6">
                Vous souhaitez nous contacter ou en savoir plus sur BabyBaby ?
                N'hésitez pas à nous écrire.
              </p>
              <Button className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
                <Mail className="mr-2 h-4 w-4" />
                Contactez-nous
              </Button>
            </div>
            
            <div className="text-center text-gray-500 text-sm">
              <p>BabyBaby</p>
              <p>Québec, QC, Canada</p>
              <p>contact@babybaby.org</p>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
