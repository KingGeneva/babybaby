
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GrowthWidget from './GrowthWidget';
import StatCard from './StatCard';
import MilestonesList from './MilestonesList';
import VaccinationCalendar from './tracking/VaccinationCalendar';
import MealTracker from './tracking/MealTracker';
import SleepTracker from './tracking/SleepTracker';
import { Baby, Heart, Ruler, Weight, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { calculateAge } from '@/lib/date-utils';
import { toast } from '@/components/ui/use-toast';

interface DashboardProps {
  childId?: string;
  demoMode?: boolean;
  demoData?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ childId, demoMode = false, demoData = [] }) => {
  const [childProfile, setChildProfile] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestMeasurement, setLatestMeasurement] = useState<any>(null);

  useEffect(() => {
    if (demoMode) {
      setGrowthData(demoData);
      setChildProfile({
        id: 'demo',
        name: 'Bébé Exemple',
        birth_date: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        gender: 'M'
      });
      setMilestones(defaultMilestones.filter(m => m.expectedAgeMonths <= 6).map(m => ({
        name: m.name,
        age: `${m.expectedAgeMonths} mois`,
        achieved: m.expectedAgeMonths < 5
      })));
      if (demoData.length > 0) {
        setLatestMeasurement({
          height_cm: demoData[demoData.length - 1].taille,
          weight_kg: demoData[demoData.length - 1].poids
        });
      }
      setLoading(false);
      return;
    }

    if (!childId) return;

    const fetchData = async () => {
      try {
        const [profileData, measurementsData, milestonesData] = await Promise.all([
          supabase.from('child_profiles').select('*').eq('id', childId).single(),
          supabase.from('growth_measurements').select('*').eq('child_id', childId).order('measurement_date', { ascending: true }),
          supabase.from('milestones').select('*').eq('child_id', childId)
        ]);

        if (profileData.error) throw profileData.error;
        setChildProfile(profileData.data);

        if (measurementsData.error) throw measurementsData.error;
        if (measurementsData.data?.length > 0) {
          const formattedData = measurementsData.data.map(item => ({
            name: new Date(item.measurement_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
            taille: Number(item.height_cm),
            poids: Number(item.weight_kg),
            eveil: item.head_cm ? Number(item.head_cm) : undefined,
          }));
          setGrowthData(formattedData);
          setLatestMeasurement(measurementsData.data[measurementsData.data.length - 1]);
        }

        if (!milestonesData.error && milestonesData.data) {
          setMilestones(milestonesData.data.map((milestone: any) => ({
            name: milestone.name,
            age: milestone.expected_age_months ? `${milestone.expected_age_months} mois` : '?',
            achieved: !!milestone.achieved_date
          })));
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

    fetchData();
  }, [childId, demoData, demoMode]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (!childProfile && !demoMode) {
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

  const birthDate = new Date(childProfile.birth_date);
  const ageString = calculateAge(childProfile.birth_date);
  const achievedMilestonesCount = milestones.filter((m: any) => m.achieved).length;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {demoMode ? "Exemple de Suivi de Croissance" : `Suivi de Croissance - ${childProfile?.name}`}
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
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
            value={calculateAwarenessLevel(achievedMilestonesCount)}
            icon={<Brain className="text-white" size={24} />}
            color="bg-amber-400"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {growthData && growthData.length > 0 ? (
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
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <VaccinationCalendar />
          <MealTracker />
          <SleepTracker />
        </div>

        {!demoMode && milestones.length > 0 && (
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4">Jalons de Développement</h3>
            <MilestonesList milestones={milestones} />
          </motion.div>
        )}

        {demoMode && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Ces données sont présentées à titre d'exemple. 
              Créez un compte pour suivre la croissance de votre bébé !
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

const calculateAwarenessLevel = (achievedCount: number): string => {
  if (achievedCount >= 8) return "Exceptionnel";
  if (achievedCount >= 6) return "Excellent";
  if (achievedCount >= 4) return "Très bon";
  if (achievedCount >= 2) return "Bon";
  return "Normal";
};

const defaultMilestones = [
  { name: 'Sourire', expectedAgeMonths: 2 },
  { name: 'Tenir sa tête', expectedAgeMonths: 3 },
  { name: 'Rouler', expectedAgeMonths: 4 },
  { name: "S'asseoir", expectedAgeMonths: 6 },
  { name: 'Ramper', expectedAgeMonths: 8 },
  { name: 'Se tenir debout', expectedAgeMonths: 10 },
  { name: 'Marcher', expectedAgeMonths: 12 },
  { name: 'Premier mot', expectedAgeMonths: 12 },
];

export default Dashboard;
