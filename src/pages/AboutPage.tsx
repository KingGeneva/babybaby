
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Users, Award, Clock, Mail, Target } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="À propos de BabyBaby" 
        description="Découvrez l'histoire de BabyBaby, notre mission et notre équipe passionnée dédiée à accompagner les parents dans leur parcours."
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
              Créé par des parents pour des parents, BabyBaby est né d'une ambition simple : 
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
                Une vision centrée sur le bien-être
              </h2>
              <p className="text-gray-600">
                Tout a commencé en 2022 lorsque notre fondatrice, Sophie Martin, jeune maman, 
                s'est retrouvée submergée par la quantité d'informations contradictoires et 
                les multiples applications nécessaires pour suivre le développement de son premier enfant.
              </p>
              <p className="text-gray-600">
                En collaboration avec des pédiatres, des développeurs et d'autres parents, 
                elle a créé BabyBaby : une solution complète, intuitive et scientifiquement fondée 
                pour accompagner les parents à chaque étape de leur parcours.
              </p>
              <p className="text-gray-600 font-medium">
                Aujourd'hui, BabyBaby compte plus de 50 000 utilisateurs dans 15 pays, 
                et continue de grandir avec une mission claire : simplifier la parentalité 
                grâce à la technologie et l'expertise.
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-gray-600">Nos outils et conseils s'appuient sur les données scientifiques les plus récentes et rigoureuses.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-babybaby-cosmic/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-babybaby-cosmic" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Communauté</h3>
                <p className="text-gray-600">Nous créons des espaces d'échange sécurisants où les parents peuvent partager et s'entraider.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
              Notre équipe
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              {[
                {name: "Sophie Martin", role: "Fondatrice & CEO", image: "/placeholder.svg"},
                {name: "Dr. Thomas Durand", role: "Conseiller médical", image: "/placeholder.svg"},
                {name: "Julie Leroy", role: "Lead Developer", image: "/placeholder.svg"},
                {name: "Marc Dubois", role: "UX Designer", image: "/placeholder.svg"},
                {name: "Laure Wang", role: "Content Manager", image: "/placeholder.svg"},
                {name: "Antoine Legrand", role: "Community Manager", image: "/placeholder.svg"}
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Rejoignez notre équipe !</h3>
              <p className="text-gray-600 mb-6">
                Passionné par l'innovation et le bien-être des familles ? 
                Découvrez nos opportunités de carrière.
              </p>
              <Button className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
                Voir nos offres d'emploi
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-babybaby-cosmic/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Contactez-nous</h2>
            <p className="text-gray-600 mb-8">
              Une question, une suggestion ou une demande de partenariat ? 
              Notre équipe est à votre disposition.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button className="flex items-center gap-2 bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
                <Mail className="h-4 w-4" />
                Nous contacter
              </Button>
              <Button variant="outline">
                FAQ
              </Button>
            </div>
            
            <div className="text-gray-500 text-sm">
              <p>BabyBaby SAS</p>
              <p>123 Avenue des Parents, 75001 Paris</p>
              <p>contact@babybaby.app</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
