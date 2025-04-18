
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Volume2, Calculator, Gift, Baby, Check, TabletSmartphone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// Import des outils
import NameGenerator from './NameGenerator';
import CostCalculator from './CostCalculator';
import GiftRegistry from './GiftRegistry';
import WhiteNoiseGenerator from './WhiteNoiseGenerator';
import LullabyPlayer from './LullabyPlayer';
import BabyChecklist from './BabyChecklist';
import OvulationCalculator from './OvulationCalculator';

const ToolsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-babybaby-lightblue/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-babybaby-cosmic">Outils pour Parents</h2>
          <p className="max-w-2xl mx-auto text-gray-700">
            Découvrez nos outils pratiques conçus pour vous faciliter la vie au quotidien avec votre enfant.
          </p>
        </motion.div>

        <Tabs
          defaultValue="all"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">Tous les outils</TabsTrigger>
              <TabsTrigger value="prep">Préparation</TabsTrigger>
              <TabsTrigger value="sleep">Sommeil</TabsTrigger>
              <TabsTrigger value="health">Santé</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <NameGenerator />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CostCalculator />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <WhiteNoiseGenerator />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <LullabyPlayer />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <GiftRegistry />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <BabyChecklist />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <OvulationCalculator />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="prep" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NameGenerator />
              <CostCalculator />
              <GiftRegistry />
              <BabyChecklist />
            </div>
          </TabsContent>

          <TabsContent value="sleep" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WhiteNoiseGenerator />
              <LullabyPlayer />
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OvulationCalculator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ToolsSection;
