import React from 'react';
import DashboardHeader from './DashboardHeader';
import GrowthSection from './GrowthSection';
import DevelopmentSection from './DevelopmentSection';
import useDashboardData from './useDashboardData';
import useDemoDashboard from './useDemoDashboard';

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
  const isDemo = demoMode || childId === 'demo';
  const dashboardData = isDemo ? useDemoDashboard() : useDashboardData(childId, isDemo);
  
  const {
    childData,
    latestHeight,
    latestWeight,
    heightData,
    weightData,
    heightTrend,
    weightTrend
  } = dashboardData;

  return (
    <div className="container mx-auto px-4">
      <DashboardHeader
        childData={childData}
        latestHeight={latestHeight}
        latestWeight={latestWeight}
        heightTrend={heightTrend}
        weightTrend={weightTrend}
      />

      <GrowthSection
        heightData={heightData}
        weightData={weightData}
        childId={childId}
      />

      <DevelopmentSection childId={childId} />
    </div>
  );
};

export default Dashboard;
