
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Volume2, Calculator, Gift, Baby } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  className,
  delay = 0
}) => {
  return (
    <motion.div
      className={cn("glass-card p-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div 
        className="w-12 h-12 rounded-full bg-babybaby-cosmic text-white flex items-center justify-center mb-4"
        whileHover={{ rotate: 10 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </motion.div>
  );
};

const ToolsSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ToolCard
            title="Lecteur de Berceuses"
            description="Une collection de berceuses apaisantes pour aider votre bébé à s'endormir paisiblement."
            icon={<Music size={24} />}
            delay={0.1}
          />
          <ToolCard
            title="Générateur de Bruit Blanc"
            description="Créez l'ambiance sonore parfaite pour calmer votre bébé et favoriser son sommeil."
            icon={<Volume2 size={24} />}
            delay={0.2}
          />
          <ToolCard
            title="Calculateur de Coûts"
            description="Estimez et planifiez les dépenses liées à l'arrivée et l'éducation de votre enfant."
            icon={<Calculator size={24} />}
            delay={0.3}
          />
          <ToolCard
            title="Générateur de Prénoms"
            description="Trouvez l'inspiration pour choisir le prénom parfait pour votre futur bébé."
            icon={<Baby size={24} />}
            delay={0.4}
          />
          <ToolCard
            title="Registre de Cadeaux"
            description="Créez et partagez votre liste de souhaits pour accueillir bébé dans les meilleures conditions."
            icon={<Gift size={24} />}
            className="md:col-span-2 lg:col-span-1"
            delay={0.5}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsSection;
