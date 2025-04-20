
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateAge } from '@/lib/date-utils';
import GrowthWidget from './GrowthWidget';
import MilestonesList from './MilestonesList';
import { supabase } from '@/integrations/supabase/client';
import StatCard from './StatCard';
import MedicalWidget from '@/components/medical/MedicalWidget';

interface DashboardProps {
  childId: string;
  demoMode?: boolean;
  demoData?: Array<{
    name: string;
    taille: number;
    poids: number;
    eveil?: number;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({ childId, demoMode = false, demoData }) => {
  const [childData, setChildData] = useState<{ name: string; birth_date: string } | null>(null);
  const [latestHeight, setLatestHeight] = useState<number | null>(null);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [heightData, setHeightData] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [heightTrend, setHeightTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [weightTrend, setWeightTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (!childId || demoMode) return;

    const fetchChildData = async () => {
      try {
        const { data, error } = await supabase
          .from('child_profiles')
          .select('name, birth_date')
          .eq('id', childId)
          .single();

        if (error) throw error;
        setChildData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'enfant:", error);
      }
    };

    const fetchLatestMeasurements = async () => {
      try {
        const { data, error } = await supabase
          .from('growth_measurements')
          .select('height_cm, weight_kg, measurement_date')
          .eq('child_id', childId)
          .order('measurement_date', { ascending: false })
          .limit(2);

        if (error) throw error;

        if (data && data.length > 0) {
          setLatestHeight(data[0].height_cm);
          setLatestWeight(data[0].weight_kg);

          // Calcul de la tendance pour la taille
          if (data.length > 1 && data[1].height_cm !== null && data[0].height_cm !== null) {
            if (data[0].height_cm > data[1].height_cm) {
              setHeightTrend('up');
            } else if (data[0].height_cm < data[1].height_cm) {
              setHeightTrend('down');
            } else {
              setHeightTrend('stable');
            }
          } else {
            setHeightTrend('stable');
          }

          // Calcul de la tendance pour le poids
          if (data.length > 1 && data[1].weight_kg !== null && data[0].weight_kg !== null) {
            if (data[0].weight_kg > data[1].weight_kg) {
              setWeightTrend('up');
            } else if (data[0].weight_kg < data[1].weight_kg) {
              setWeightTrend('down');
            } else {
              setWeightTrend('stable');
            }
          } else {
            setWeightTrend('stable');
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des dernières mesures:", error);
      }
    };

    const fetchGrowthData = async () => {
      try {
        const { data, error } = await supabase
          .from('growth_measurements')
          .select('height_cm, weight_kg, measurement_date')
          .eq('child_id', childId)
          .order('measurement_date', { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedHeightData = data.map(item => ({
            date: new Date(item.measurement_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
            value: item.height_cm
          })).filter(item => item.value !== null);

          const formattedWeightData = data.map(item => ({
            date: new Date(item.measurement_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
            value: item.weight_kg
          })).filter(item => item.value !== null);

          setHeightData(formattedHeightData);
          setWeightData(formattedWeightData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de croissance:", error);
      }
    };

    fetchChildData();
    fetchLatestMeasurements();
    fetchGrowthData();
  }, [childId, demoMode]);

  // Use demo data if in demo mode
  useEffect(() => {
    if (demoMode && demoData) {
      // Set demo stats
      setChildData({ name: "Bébé Démo", birth_date: "2024-01-01" });
      setLatestHeight(64);
      setLatestWeight(7.2);
      
      // Format demo data for charts
      const heightData = demoData.map(item => ({
        date: item.name,
        value: item.taille
      }));
      
      const weightData = demoData.map(item => ({
        date: item.name,
        value: item.poids
      }));
      
      setHeightData(heightData);
      setWeightData(weightData);
    }
  }, [demoMode, demoData]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-babybaby-cosmic">
        {childData?.name ? `Tableau de bord de ${childData.name}` : 'Chargement...'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="Âge" 
          value={childData?.birth_date ? calculateAge(childData.birth_date) : '...'} 
          description="Âge actuel" 
          icon="baby"
        />
        <StatCard 
          title="Taille" 
          value={latestHeight ? `${latestHeight} cm` : 'N/A'} 
          description="Dernière mesure" 
          icon="ruler"
          trend={heightTrend}
        />
        <StatCard 
          title="Poids" 
          value={latestWeight ? `${latestWeight} kg` : 'N/A'} 
          description="Dernière mesure" 
          icon="weight"
          trend={weightTrend}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GrowthWidget
          title="Évolution de la taille (cm)"
          data={heightData}
          metricType="taille"
          color="#9b87f5"
          childId={childId}
        />
        <GrowthWidget
          title="Évolution du poids (kg)"
          data={weightData}
          metricType="poids"
          color="#33C3F0"
          childId={childId}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Étapes de développement</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestonesList childId={childId} />
            </CardContent>
          </Card>
        </div>
        <div>
          <MedicalWidget childId={childId} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
