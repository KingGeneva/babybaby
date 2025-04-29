import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = (childId: string, isDemo = false) => {
  const [childData, setChildData] = useState<{ name: string; birth_date: string } | null>(null);
  const [latestHeight, setLatestHeight] = useState<number | null>(null);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [heightData, setHeightData] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [heightTrend, setHeightTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [weightTrend, setWeightTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (!childId || isDemo) return;

    // Vérifier si l'enfant est en mode démo
    if (childId === 'demo') {
      // Définir des données factices pour le mode démo
      setChildData({ name: 'Bébé démo', birth_date: '2025-01-01' });
      setLatestHeight(65);
      setLatestWeight(7.5);
      setHeightData([
        { date: '1 Jan', value: 50 },
        { date: '1 Fév', value: 55 },
        { date: '1 Mar', value: 60 },
        { date: '1 Avr', value: 65 }
      ]);
      setWeightData([
        { date: '1 Jan', value: 3.5 },
        { date: '1 Fév', value: 5.0 },
        { date: '1 Mar', value: 6.2 },
        { date: '1 Avr', value: 7.5 }
      ]);
      setHeightTrend('up');
      setWeightTrend('up');
      return;
    }

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

          // Calculate trends
          if (data.length > 1) {
            setHeightTrend(data[0].height_cm > data[1].height_cm ? 'up' : 
                          data[0].height_cm < data[1].height_cm ? 'down' : 'stable');
            setWeightTrend(data[0].weight_kg > data[1].weight_kg ? 'up' : 
                          data[0].weight_kg < data[1].weight_kg ? 'down' : 'stable');
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
          const formattedHeightData = data
            .filter(item => item.height_cm !== null)
            .map(item => ({
              date: new Date(item.measurement_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
              value: item.height_cm
            }));

          const formattedWeightData = data
            .filter(item => item.weight_kg !== null)
            .map(item => ({
              date: new Date(item.measurement_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
              value: item.weight_kg
            }));

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
  }, [childId, isDemo]);

  return {
    childData,
    latestHeight,
    latestWeight,
    heightData,
    weightData,
    heightTrend,
    weightTrend
  };
};

export default useDashboardData;
