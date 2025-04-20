
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ChildProfilesList from './ChildProfilesList';
import ChildProfileForm from './ChildProfileForm';
import GrowthMeasurementForm from './GrowthMeasurementForm';
import GrowthWidget from './GrowthWidget';
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
  growthData,
  isLoadingData,
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
          <div className="space-y-8">
            {isLoadingData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-48">
                <Card className="animate-pulse">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="w-full h-32 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
                <Card className="animate-pulse">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="w-full h-32 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {growthData && growthData.length > 0 ? (
                  <>
                    <GrowthWidget 
                      title="Évolution du Poids (kg)" 
                      data={growthData.map(item => ({
                        date: item.date,
                        value: item.poids
                      }))} 
                      metricType="poids" 
                      color="#33C3F0"
                      childId={selectedChildId}
                    />
                    <GrowthWidget 
                      title="Évolution de la Taille (cm)" 
                      data={growthData.map(item => ({
                        date: item.date,
                        value: item.taille
                      }))} 
                      metricType="taille" 
                      color="#9b87f5"
                      childId={selectedChildId}
                    />
                  </>
                ) : (
                  <Card className="col-span-1 lg:col-span-2">
                    <CardContent className="p-6 text-center">
                      <p>Aucune mesure de croissance n'est enregistrée.</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Ajoutez des mesures pour voir apparaître les graphiques.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <GrowthMeasurementForm
              childId={selectedChildId}
              onSuccess={onMeasurementSuccess}
            />

            <div className="flex justify-center mt-6 gap-4">
              <Button 
                variant="outline" 
                onClick={onBackToProfiles}
              >
                Retour aux profils
              </Button>
              
              <Button onClick={onViewDashboard}>
                Voir le tableau de bord complet
              </Button>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
