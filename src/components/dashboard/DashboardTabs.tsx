import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChildProfilesList from './ChildProfilesList';
import ChildProfileForm from './ChildProfileForm';
import GrowthDashboard from './growth/GrowthDashboard';
import { Button } from '@/components/ui/button';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedChildId: string | null;
  onChildSelected: (childId: string) => void;
  onMeasurementSuccess: () => void;
  onBackToProfiles: () => void;
  onViewDashboard: () => void;
  growthData: any[];
  isLoadingData: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  selectedChildId,
  onChildSelected,
  onMeasurementSuccess,
  onBackToProfiles,
  onViewDashboard,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
        <TabsTrigger value="profiles">Profils</TabsTrigger>
        <TabsTrigger value="growth" disabled={!selectedChildId}>
          Croissance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profiles" className="space-y-8">
        <ChildProfilesList onSelectChild={onChildSelected} />
        <ChildProfileForm onSuccess={(childId) => {
          onChildSelected(childId);
          onTabChange('growth');
        }} />
      </TabsContent>

      <TabsContent value="growth">
        {selectedChildId && (
          <div className="space-y-6">
            <GrowthDashboard childId={selectedChildId} onMutated={onMeasurementSuccess} />

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onBackToProfiles}>Retour aux profils</Button>
              <Button onClick={onViewDashboard}>Voir le tableau de bord complet</Button>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;

