
import React from 'react';
import { calculateAge } from '@/lib/date-utils';
import StatCard from './StatCard';

interface DashboardHeaderProps {
  childData: { name: string; birth_date: string } | null;
  latestHeight: number | null;
  latestWeight: number | null;
  heightTrend: 'up' | 'down' | 'stable';
  weightTrend: 'up' | 'down' | 'stable';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  childData,
  latestHeight,
  latestWeight,
  heightTrend,
  weightTrend
}) => {
  return (
    <>
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
    </>
  );
};

export default DashboardHeader;
