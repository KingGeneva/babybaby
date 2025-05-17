import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import des outils
import NameGenerator from '@/components/tools/NameGenerator';
import CostCalculator from '@/components/tools/CostCalculator';
import GiftRegistry from '@/components/tools/GiftRegistry';
import WhiteNoiseGenerator from '@/components/tools/WhiteNoiseGenerator';
import LullabyPlayer from '@/components/tools/LullabyPlayer';
import BabyChecklist from '@/components/tools/BabyChecklist';
import OvulationCalculator from '@/components/tools/OvulationCalculator';
import SleepTracker from '@/components/tools/SleepTracker';

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-babybaby-cosmic">Tous nos Outils Parents</h1>
            <p className="max-w-2xl mx-auto text-gray-700">
              Des outils simples et pratiques pour vous aider dans votre quotidien de parents
            </p>
          </motion.div>
          
          <Tabs
            defaultValue="all"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-8 overflow-x-auto">
              <TabsList className="flex-nowrap">
                <TabsTrigger value="all">Tous les outils</TabsTrigger>
                <TabsTrigger value="names">Prénoms</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="sleep">Sommeil</TabsTrigger>
                <TabsTrigger value="checklist">Liste</TabsTrigger>
                <TabsTrigger value="gifts">Cadeaux</TabsTrigger>
                <TabsTrigger value="health">Santé</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SleepTracker />
                <NameGenerator />
                <CostCalculator />
                <WhiteNoiseGenerator />
                <LullabyPlayer />
                <GiftRegistry />
                <BabyChecklist />
                <OvulationCalculator />
                
                {/* Ajout du lien vers le générateur de certificat */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                >
                  <h3 className="text-2xl font-bold mb-4 text-babybaby-cosmic">Générateur de Certificat</h3>
                  <p className="text-gray-700 mb-4">
                    Créez de jolis certificats d'accomplissement pour célébrer les étapes importantes
                    du développement de votre enfant.
                  </p>
                  <Link 
                    to="/certificate-generator"
                    className="inline-block bg-babybaby-blue text-white px-5 py-2.5 rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Créer un certificat
                  </Link>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="names">
              <div className="max-w-2xl mx-auto">
                <NameGenerator />
              </div>
            </TabsContent>
            
            <TabsContent value="finance">
              <div className="max-w-2xl mx-auto">
                <CostCalculator />
              </div>
            </TabsContent>
            
            <TabsContent value="sleep" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SleepTracker />
                <WhiteNoiseGenerator />
                <LullabyPlayer />
              </div>
            </TabsContent>
            
            <TabsContent value="checklist">
              <div className="max-w-2xl mx-auto">
                <BabyChecklist />
              </div>
            </TabsContent>
            
            <TabsContent value="gifts">
              <div className="max-w-2xl mx-auto">
                <GiftRegistry />
              </div>
            </TabsContent>
            
            <TabsContent value="health">
              <div className="max-w-2xl mx-auto">
                <OvulationCalculator />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ToolsPage;
