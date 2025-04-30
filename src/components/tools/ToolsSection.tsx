
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Calculator, 
  BabyIcon,
  HeartPulse,
  Music2,
  ClipboardCheck,
  Music,
  Gift,
  Binary,
  Moon,
  LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const tools = [
  {
    component: "SleepTracker",
    title: "Suivi du sommeil",
    icon: Moon,
    description: "Suivez et analysez les cycles de sommeil de bébé",
    tags: ["Sommeil", "Analyse"]
  },
  {
    component: "OvulationCalculator",
    title: "Calculateur d'ovulation",
    icon: HeartPulse,
    description: "Suivez votre cycle menstruel",
    tags: ["Santé", "Planification"]
  },
  {
    component: "CostCalculator",
    title: "Calculateur de coûts",
    icon: Calculator,
    description: "Estimez les dépenses liées à l'arrivée de bébé",
    tags: ["Finance", "Planification"]
  },
  {
    component: "NameGenerator",
    title: "Générateur de prénoms",
    icon: Binary,
    description: "Trouvez le prénom parfait pour votre bébé",
    tags: ["Préparation", "Créativité"]
  },
  {
    component: "WhiteNoiseGenerator",
    title: "Bruit blanc",
    icon: Music2,
    description: "Sons apaisants pour le sommeil de bébé",
    tags: ["Sommeil", "Audio"]
  },
  {
    component: "LullabyPlayer",
    title: "Berceuses",
    icon: Music,
    description: "Musiques douces pour endormir bébé",
    tags: ["Sommeil", "Audio"]
  },
  {
    component: "BabyChecklist",
    title: "Liste de préparation",
    icon: ClipboardCheck,
    description: "Préparez l'arrivée de bébé",
    tags: ["Organisation", "Planification"]
  },
  {
    component: "GiftRegistry",
    title: "Liste de naissance",
    icon: Gift,
    description: "Gérez votre liste de naissance en ligne",
    tags: ["Organisation", "Partage"]
  }
];

const ToolsSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <BabyIcon className="mx-auto h-12 w-12 text-babybaby-cosmic mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">
            Nos Outils Parents
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Des outils essentiels pour vous accompagner dans votre parcours parental
          </p>
          
          {!user && (
            <Link to="/auth" className="inline-block">
              <Button 
                className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 text-white flex items-center gap-2 mt-2"
              >
                <LogIn className="h-4 w-4" />
                Connectez-vous pour accéder à tous nos outils
              </Button>
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div 
                  className={`block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group-hover:scale-105 transform-gpu border border-gray-100 group-hover:border-babybaby-cosmic/20 ${!user ? 'opacity-90 pointer-events-none' : ''}`}
                >
                  {!user && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <Link to="/auth">
                        <Button size="sm" variant="secondary" className="flex items-center gap-1">
                          <LogIn className="h-3 w-3" />
                          Connexion requise
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sky-100 to-sky-50 rounded-2xl flex items-center justify-center group-hover:from-sky-200 group-hover:to-sky-100 transition-colors">
                      <Icon className="w-8 h-8 text-babybaby-cosmic" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-babybaby-cosmic transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-sky-50 text-babybaby-cosmic rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link to="/auth">
              <Button 
                size="lg"
                className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 text-white"
              >
                Créer un compte pour accéder à tous les outils
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ToolsSection;
