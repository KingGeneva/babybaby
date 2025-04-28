
import React from 'react';
import GrowthWidget from './GrowthWidget';

interface GrowthSectionProps {
  heightData: any[];
  weightData: any[];
  childId: string;
}

const GrowthSection: React.FC<GrowthSectionProps> = ({ heightData, weightData, childId }) => {
  return (
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
  );
};

export default GrowthSection;
