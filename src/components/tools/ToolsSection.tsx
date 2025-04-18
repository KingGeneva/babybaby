
import React from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import des outils
import NameGenerator from './NameGenerator';
import CostCalculator from './CostCalculator';
import GiftRegistry from './GiftRegistry';
import WhiteNoiseGenerator from './WhiteNoiseGenerator';
import LullabyPlayer from './LullabyPlayer';
import BabyChecklist from './BabyChecklist';
import OvulationCalculator from './OvulationCalculator';
import { Card } from '@/components/ui/card';

const tools = [
  {
    component: NameGenerator,
    title: "Générateur de prénoms",
    description: "Trouvez le prénom parfait pour votre bébé"
  },
  {
    component: CostCalculator,
    title: "Calculateur de coûts",
    description: "Estimez les dépenses liées à l'arrivée de bébé"
  },
  {
    component: GiftRegistry,
    title: "Liste de naissance",
    description: "Gérez votre liste de naissance"
  },
  {
    component: WhiteNoiseGenerator,
    title: "Bruit blanc",
    description: "Sons apaisants pour le sommeil de bébé"
  },
  {
    component: LullabyPlayer,
    title: "Berceuses",
    description: "Musiques douces pour endormir bébé"
  },
  {
    component: BabyChecklist,
    title: "Liste de préparation",
    description: "Préparez l'arrivée de bébé"
  },
  {
    component: OvulationCalculator,
    title: "Calculateur d'ovulation",
    description: "Suivez votre cycle menstruel"
  }
];

const ToolsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Book className="mx-auto h-10 w-10 text-babybaby-cosmic mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">Nos Outils Parents</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Des outils simples et pratiques pour vous aider dans votre quotidien de parents
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent>
              {tools.map((tool, index) => {
                const ToolComponent = tool.component;
                return (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="p-1"
                    >
                      <Card className="relative overflow-hidden group cursor-pointer">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                          <p className="text-gray-600 mb-4">{tool.description}</p>
                          <ToolComponent />
                        </div>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button 
            variant="link" 
            className="text-babybaby-cosmic"
            asChild
          >
            <Link to="/tools">
              Voir tous nos outils
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsSection;
