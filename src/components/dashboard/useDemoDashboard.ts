
import { useState, useEffect } from 'react';

export const useDemoDashboard = () => {
  const [childData] = useState({ name: "Bébé Démo", birth_date: "2024-01-01" });
  const [latestHeight] = useState(64);
  const [latestWeight] = useState(7.2);
  const [heightData, setHeightData] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any[]>([]);

  useEffect(() => {
    const defaultDemoData = [
      { name: "Jan", taille: 50, poids: 3.5 },
      { name: "Fév", taille: 53, poids: 4.2 },
      { name: "Mar", taille: 57, poids: 5.1 },
      { name: "Avr", taille: 60, poids: 6.0 },
      { name: "Mai", taille: 62, poids: 6.5 },
      { name: "Juin", taille: 64, poids: 7.2 }
    ];
    
    const heightData = defaultDemoData.map(item => ({
      date: item.name,
      value: item.taille
    }));
    
    const weightData = defaultDemoData.map(item => ({
      date: item.name,
      value: item.poids
    }));
    
    setHeightData(heightData);
    setWeightData(weightData);
  }, []);

  return {
    childData,
    latestHeight,
    latestWeight,
    heightData,
    weightData,
    heightTrend: 'up' as const,
    weightTrend: 'up' as const
  };
};

export default useDemoDashboard;
