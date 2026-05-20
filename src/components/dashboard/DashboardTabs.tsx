import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChildProfilesList from './ChildProfilesList';
import ChildProfileForm from './ChildProfileForm';
import GrowthDashboard from './growth/GrowthDashboard';
import SelectedChildHeader from './SelectedChildHeader';
import MilestonesPanel from './MilestonesPanel';
import MedicalWidget from '@/components/medical/MedicalWidget';
import { Baby, LineChart, Sparkles, Stethoscope } from 'lucide-react';

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
}) => {
  const hasChild = !!selectedChildId;

  return (
    <div>
      {hasChild && activeTab !== 'profiles' && (
        <SelectedChildHeader childId={selectedChildId!} onChange={onBackToProfiles} />
      )}

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8">
          <TabsTrigger value="profiles" className="gap-1.5">
            <Baby className="h-4 w-4" />
            <span className="hidden sm:inline">Profils</span>
          </TabsTrigger>
          <TabsTrigger value="growth" disabled={!hasChild} className="gap-1.5">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Croissance</span>
          </TabsTrigger>
          <TabsTrigger value="milestones" disabled={!hasChild} className="gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Étapes</span>
          </TabsTrigger>
          <TabsTrigger value="medical" disabled={!hasChild} className="gap-1.5">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Médical</span>
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
          {hasChild && (
            <GrowthDashboard childId={selectedChildId!} onMutated={onMeasurementSuccess} />
          )}
        </TabsContent>

        <TabsContent value="milestones">
          {hasChild && <MilestonesPanel childId={selectedChildId!} />}
        </TabsContent>

        <TabsContent value="medical">
          {hasChild && <MedicalWidget childId={selectedChildId!} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
