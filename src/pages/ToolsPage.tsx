
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import SEOHead from '@/components/common/SEOHead';
import P5Canvas from '@/components/P5Canvas';

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page d'authentification si l'utilisateur n'est pas connecté
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  // Afficher un état de chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien rendre (la redirection se fera via l'effet)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Outils Parents | BabyBaby" 
        description="Des outils pratiques pour vous accompagner dans votre parentalité au quotidien."
        canonicalUrl="https://babybaby.app/tools"
      />
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      
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
