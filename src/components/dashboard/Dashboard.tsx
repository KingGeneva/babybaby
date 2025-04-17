
import React from 'react';
import { motion } from 'framer-motion';
import GrowthWidget from './GrowthWidget';
import { Card } from '@/components/ui/card';
import { Baby, Heart, Ruler, Weight, Brain } from 'lucide-react';

const growthData = [
  { name: '1 mois', taille: 50, poids: 3.5, eveil: 2 },
  { name: '2 mois', taille: 54, poids: 4.3, eveil: 3 },
  { name: '3 mois', taille: 58, poids: 5.0, eveil: 4 },
  { name: '4 mois', taille: 61, poids: 5.7, eveil: 5 },
  { name: '5 mois', taille: 64, poids: 6.4, eveil: 6 },
  { name: '6 mois', taille: 66, poids: 7.0, eveil: 7 },
];

const milestonesData = [
  { name: 'Sourire', age: '2 mois', achieved: true },
  { name: 'Tenir sa tête', age: '3 mois', achieved: true },
  { name: 'Rouler', age: '4 mois', achieved: true },
  { name: 'S\'asseoir', age: '6 mois', achieved: false },
  { name: 'Ramper', age: '8 mois', achieved: false },
];

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <motion.div
      className="glass-card p-4 flex items-center gap-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className={`p-3 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Suivi de Croissance
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            title="Âge"
            value="6 mois"
            icon={<Baby className="text-white" size={24} />}
            color="bg-babybaby-cosmic"
          />
          <StatCard
            title="Poids"
            value="7 kg"
            icon={<Weight className="text-white" size={24} />}
            color="bg-green-400"
          />
          <StatCard
            title="Taille"
            value="66 cm"
            icon={<Ruler className="text-white" size={24} />}
            color="bg-purple-400"
          />
          <StatCard
            title="Éveil"
            value="Excellent"
            icon={<Brain className="text-white" size={24} />}
            color="bg-amber-400"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GrowthWidget 
            title="Évolution du Poids (kg)" 
            data={growthData} 
            dataKey="poids" 
            color="#33C3F0"
          />
          <GrowthWidget 
            title="Évolution de la Taille (cm)" 
            data={growthData} 
            dataKey="taille" 
            color="#9b87f5"
          />
        </div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold mb-4">Jalons de Développement</h3>
          <div className="relative">
            <div className="absolute h-full w-1 bg-babybaby-blue/30 left-3 top-0 rounded-full"></div>
            <div className="space-y-4">
              {milestonesData.map((milestone, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-4 ml-7"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`absolute left-2 w-2.5 h-2.5 rounded-full ${milestone.achieved ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="font-medium">{milestone.name}</p>
                    <p className="text-sm text-gray-600">{milestone.age}</p>
                  </div>
                  {milestone.achieved && (
                    <div className="flex-1 text-right">
                      <span className="text-green-500 text-xs">✓ Acquis</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Dashboard;
