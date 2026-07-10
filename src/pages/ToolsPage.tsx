import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import SEOHead from '@/components/common/SEOHead';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Helmet } from 'react-helmet-async';

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

  // Schema HowTo pour les outils
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Comment utiliser les outils BabyBaby pour le suivi de bébé",
    "description": "Guide pour utiliser les outils gratuits de BabyBaby : générateur de prénoms, suivi du sommeil, bruit blanc, berceuses et plus.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Choisir un outil",
        "text": "Sélectionnez l'outil adapté à votre besoin parmi notre collection: prénoms, finances, sommeil, checklist."
      },
      {
        "@type": "HowToStep", 
        "name": "Configurer les paramètres",
        "text": "Personnalisez les paramètres selon vos préférences et les besoins de votre bébé."
      },
      {
        "@type": "HowToStep",
        "name": "Utiliser et suivre",
        "text": "Utilisez l'outil au quotidien et suivez les progrès de votre bébé."
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Outils Gratuits pour Parents | Générateur Prénoms, Bruit Blanc, Suivi Sommeil"
        description="Découvrez nos outils gratuits pour parents : générateur de prénoms, calculateur budget bébé, suivi du sommeil, bruit blanc, berceuses et checklist naissance."
        canonicalUrl="https://babybaby.org/tools"
        ogImage="https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
        keywords={[
          "outils parents gratuit", "générateur prénoms bébé", "bruit blanc bébé",
          "berceuse bébé", "suivi sommeil bébé", "calculateur budget bébé",
          "checklist naissance", "liste cadeaux naissance", "ovulation calculateur"
        ]}
      />
      <BreadcrumbSchema 
        items={[
          { name: "Accueil", url: "https://babybaby.org" },
          { name: "Outils Parents", url: "https://babybaby.org/tools" }
        ]}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      </Helmet>
      <NavBar />
      <div className="pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-babybaby-cosmic px-2">Outils Gratuits pour Jeunes Parents</h1>
            <p className="max-w-2xl mx-auto text-gray-700 text-sm sm:text-base px-2">
              Générateur de prénoms, suivi du sommeil, bruit blanc et berceuses : tout pour accompagner votre quotidien de parent
            </p>
            <div className="mt-6">
              <Link to="/calculateur-cout-bebe-quebec" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow hover:opacity-90 transition-opacity">
                Nouveau : Calculateur du coût d'un bébé au Québec 2026 →
              </Link>
            </div>
          </motion.div>
          
          <Tabs
            defaultValue="all"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex w-max flex-nowrap mx-auto">
                <TabsTrigger value="all" className="whitespace-nowrap">Tous</TabsTrigger>
                <TabsTrigger value="names" className="whitespace-nowrap">Prénoms</TabsTrigger>
                <TabsTrigger value="finance" className="whitespace-nowrap">Finance</TabsTrigger>
                <TabsTrigger value="sleep" className="whitespace-nowrap">Sommeil</TabsTrigger>
                <TabsTrigger value="checklist" className="whitespace-nowrap">Liste</TabsTrigger>
                <TabsTrigger value="gifts" className="whitespace-nowrap">Cadeaux</TabsTrigger>
                <TabsTrigger value="health" className="whitespace-nowrap">Santé</TabsTrigger>
                <TabsTrigger value="family" className="whitespace-nowrap">Famille</TabsTrigger>
              </TabsList>
            </div>

            
            <TabsContent value="all" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ParentRotationToolCard />
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

            <TabsContent value="family">
              <div className="max-w-2xl mx-auto">
                <ParentRotationToolCard />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ParentRotationToolCard = () => (
  <Card className="h-full border-babybaby-cosmic/20 bg-gradient-to-br from-babybaby-cosmic/5 to-pink-50">
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-babybaby-cosmic/10">
          <Users className="h-6 w-6 text-babybaby-cosmic" />
        </div>
        <div>
          <CardTitle>À qui le tour ?</CardTitle>
          <CardDescription>Répartissez équitablement les tâches entre parents grâce à l'IA</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-4">
        Loggez les levers de nuit, biberons, changes et bains. L'IA analyse l'équité et suggère à qui revient le prochain tour.
      </p>
      <Link to="/outils/rotation-parents">
        <Button className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
          Ouvrir l'outil
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default ToolsPage;
