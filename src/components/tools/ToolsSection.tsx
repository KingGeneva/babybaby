
import React from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Import des outils
import NameGenerator from './NameGenerator';
import CostCalculator from './CostCalculator';
import GiftRegistry from './GiftRegistry';
import WhiteNoiseGenerator from './WhiteNoiseGenerator';
import LullabyPlayer from './LullabyPlayer';
import BabyChecklist from './BabyChecklist';
import OvulationCalculator from './OvulationCalculator';

const tools = [
  {
    component: NameGenerator,
    title: "Générateur de prénoms",
    description: "Trouvez le prénom parfait pour votre bébé",
    seoDescription: "Outil de génération de prénoms de bébé avec suggestions personnalisées",
    tags: ["Préparation", "Créativité"]
  },
  {
    component: CostCalculator,
    title: "Calculateur de coûts",
    description: "Estimez les dépenses liées à l'arrivée de bébé",
    seoDescription: "Calculateur des coûts et dépenses pour l'arrivée d'un bébé",
    tags: ["Finance", "Planification"]
  },
  {
    component: GiftRegistry,
    title: "Liste de naissance",
    description: "Gérez votre liste de naissance en ligne",
    seoDescription: "Créez et gérez votre liste de naissance en ligne",
    tags: ["Organisation", "Partage"]
  },
  {
    component: WhiteNoiseGenerator,
    title: "Bruit blanc",
    description: "Sons apaisants pour le sommeil de bébé",
    seoDescription: "Générateur de bruits blancs pour aider bébé à dormir",
    tags: ["Sommeil", "Audio"]
  },
  {
    component: LullabyPlayer,
    title: "Berceuses",
    description: "Musiques douces pour endormir bébé",
    seoDescription: "Collection de berceuses et musiques douces pour bébé",
    tags: ["Sommeil", "Audio"]
  },
  {
    component: BabyChecklist,
    title: "Liste de préparation",
    description: "Préparez l'arrivée de bébé",
    seoDescription: "Checklist complète pour préparer l'arrivée de bébé",
    tags: ["Organisation", "Planification"]
  },
  {
    component: OvulationCalculator,
    title: "Calculateur d'ovulation",
    description: "Suivez votre cycle menstruel",
    seoDescription: "Calculateur d'ovulation et suivi du cycle menstruel",
    tags: ["Santé", "Planification"]
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
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">
            Nos Outils Parents
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Des outils simples et pratiques pour vous aider dans votre quotidien de parents
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full group">
                <div className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-babybaby-cosmic transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600">{tool.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-sky-50 text-babybaby-cosmic rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <meta name="description" content={tool.seoDescription} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
