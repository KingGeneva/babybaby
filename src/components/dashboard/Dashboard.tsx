
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GrowthWidget from './GrowthWidget';
import { Card } from '@/components/ui/card';
import { Baby, Heart, Ruler, Weight, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { calculateAge } from '@/lib/date-utils';

interface ChildProfile {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
}

interface GrowthData {
  name: string;
  taille: number;
  poids: number;
  eveil?: number;
}

interface Milestone {
  name: string;
  age: string;
  achieved: boolean;
}

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

// Liste prédéfinie des jalons de développement typiques
const defaultMilestones = [
  { name: 'Sourire', expectedAgeMonths: 2 },
  { name: 'Tenir sa tête', expectedAgeMonths: 3 },
  { name: 'Rouler', expectedAgeMonths: 4 },
  { name: 'S\'asseoir', expectedAgeMonths: 6 },
  { name: 'Ramper', expectedAgeMonths: 8 },
  { name: 'Se tenir debout', expectedAgeMonths: 10 },
  { name: 'Marcher', expectedAgeMonths: 12 },
  { name: 'Premier mot', expectedAgeMonths: 12 },
];

const Dashboard: React.FC<{ childId?: string }> = ({ childId }) => {
  const params = useParams();
  const activeChildId = childId || params.childId;
  
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestMeasurement, setLatestMeasurement] = useState<{
    height_cm?: number;
    weight_kg?: number;
    measurement_date?: string;
  } | null>(null);

  // Fonction pour calculer le niveau d'éveil basé sur l'âge et les jalons atteints
  const calculateAwarenessLevel = (ageInMonths: number, achievedMilestonesCount: number): string => {
    const expectedMilestones = defaultMilestones.filter(m => m.expectedAgeMonths <= ageInMonths).length;
    const ratio = achievedMilestonesCount / Math.max(expectedMilestones, 1);
    
    if (ratio >= 1.1) return "Exceptionnel";
    if (ratio >= 0.9) return "Excellent";
    if (ratio >= 0.75) return "Très bon";
    if (ratio >= 0.5) return "Bon";
    return "Normal";
  };

  useEffect(() => {
    if (!activeChildId) return;
    
    const fetchChildData = async () => {
      setLoading(true);
      try {
        // Récupérer les données du profil de l'enfant
        const { data: profileData, error: profileError } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('id', activeChildId)
          .single();
          
        if (profileError) throw profileError;
        setChildProfile(profileData);
        
        // Récupérer les mesures de croissance
        const { data: measurementsData, error: measurementsError } = await supabase
          .from('growth_measurements')
          .select('*')
          .eq('child_id', activeChildId)
          .order('measurement_date', { ascending: true });
          
        if (measurementsError) throw measurementsError;
        
        if (measurementsData && measurementsData.length > 0) {
          // Formatage des données pour les graphiques
          const formattedData: GrowthData[] = measurementsData.map(item => ({
            name: new Date(item.measurement_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
            taille: Number(item.height_cm),
            poids: Number(item.weight_kg),
            eveil: item.head_cm ? Number(item.head_cm) : undefined,
          }));
          
          setGrowthData(formattedData);
          
          // Récupérer la dernière mesure pour les statistiques
          const latestMeasure = measurementsData[measurementsData.length - 1];
          setLatestMeasurement(latestMeasure);
        }
        
        // Récupérer les jalons atteints
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('milestones')
          .select('*')
          .eq('child_id', activeChildId);
          
        if (milestonesError) throw milestonesError;
        
        // Si nous avons des jalons enregistrés
        if (milestonesData && milestonesData.length > 0) {
          const formattedMilestones = milestonesData.map(item => ({
            name: item.name,
            age: item.expected_age_months ? `${item.expected_age_months} mois` : '?',
            achieved: !!item.achieved_date
          }));
          setMilestones(formattedMilestones);
        } else {
          // Créer des jalons par défaut basés sur l'âge du bébé si aucun n'existe
          if (profileData) {
            const birthDate = new Date(profileData.birth_date);
            const ageInMonths = calculateAgeInMonths(birthDate);
            
            const defaultMilestonesFormatted = defaultMilestones.map(milestone => ({
              name: milestone.name,
              age: `${milestone.expectedAgeMonths} mois`,
              achieved: milestone.expectedAgeMonths <= ageInMonths / 2, // Supposons que la moitié des jalons attendus sont atteints
            }));
            
            setMilestones(defaultMilestonesFormatted);
          }
        }
        
      } catch (error: any) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du bébé",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChildData();
  }, [activeChildId]);

  // Fonction pour calculer l'âge en mois
  const calculateAgeInMonths = (birthDate: Date): number => {
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Si pas d'enfant sélectionné ou chargement en cours
  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!childProfile) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-babybaby-cosmic">
            Aucun bébé sélectionné
          </h2>
          <p>Veuillez sélectionner un profil de bébé pour voir son suivi de croissance.</p>
        </div>
      </section>
    );
  }

  // Calculer l'âge actuel du bébé
  const birthDate = new Date(childProfile.birth_date);
  const ageString = calculateAge(childProfile.birth_date);
  const ageInMonths = calculateAgeInMonths(birthDate);
  
  // Comptez les jalons atteints pour déterminer le niveau d'éveil
  const achievedMilestonesCount = milestones.filter(m => m.achieved).length;
  const awarenessLevel = calculateAwarenessLevel(ageInMonths, achievedMilestonesCount);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Suivi de Croissance - {childProfile.name}
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            title="Âge"
            value={ageString}
            icon={<Baby className="text-white" size={24} />}
            color="bg-babybaby-cosmic"
          />
          <StatCard
            title="Poids"
            value={latestMeasurement?.weight_kg ? `${latestMeasurement.weight_kg} kg` : "Non renseigné"}
            icon={<Weight className="text-white" size={24} />}
            color="bg-green-400"
          />
          <StatCard
            title="Taille"
            value={latestMeasurement?.height_cm ? `${latestMeasurement.height_cm} cm` : "Non renseigné"}
            icon={<Ruler className="text-white" size={24} />}
            color="bg-purple-400"
          />
          <StatCard
            title="Éveil"
            value={awarenessLevel}
            icon={<Brain className="text-white" size={24} />}
            color="bg-amber-400"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {growthData.length > 0 ? (
            <>
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
            </>
          ) : (
            <Card className="col-span-1 lg:col-span-2 p-6">
              <p className="text-center">
                Aucune donnée de croissance n'est enregistrée pour ce bébé.
                <br />
                Veuillez ajouter des mesures dans l'onglet Croissance.
              </p>
            </Card>
          )}
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
              {milestones.map((milestone, index) => (
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
