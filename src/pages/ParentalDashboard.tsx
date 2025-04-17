
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ChildProfileForm from '@/components/dashboard/ChildProfileForm';
import ChildProfilesList from '@/components/dashboard/ChildProfilesList';
import GrowthMeasurementForm from '@/components/dashboard/GrowthMeasurementForm';
import GrowthWidget from '@/components/dashboard/GrowthWidget';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import P5Canvas from '@/components/P5Canvas';

interface GrowthData {
  name: string;
  taille: number;
  poids: number;
  eveil?: number;
}

const ParentalDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profiles');
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch growth data when a child is selected
  useEffect(() => {
    if (!selectedChildId) return;

    const fetchGrowthData = async () => {
      setIsLoadingData(true);
      try {
        const { data, error } = await supabase
          .from('growth_measurements')
          .select('*')
          .eq('child_id', selectedChildId)
          .order('measurement_date', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedData = data.map(item => ({
            name: new Date(item.measurement_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
            taille: item.height_cm ? Number(parseFloat(item.height_cm.toString()).toFixed(1)) : 0,
            poids: item.weight_kg ? Number(parseFloat(item.weight_kg.toString()).toFixed(1)) : 0,
            eveil: item.head_cm ? Number(parseFloat(item.head_cm.toString()).toFixed(1)) : undefined,
          }));
          
          console.log('ParentalDashboard - Growth data formatted:', formattedData);
          setGrowthData(formattedData);
        } else {
          setGrowthData([]);
        }
      } catch (error: any) {
        console.error('Error fetching growth data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de croissance",
          variant: "destructive",
        });
        setGrowthData([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchGrowthData();
  }, [selectedChildId, refreshTrigger]);

  const handleChildSelected = (childId: string) => {
    setSelectedChildId(childId);
    setActiveTab('growth');
  };

  const handleViewDashboard = () => {
    if (selectedChildId) {
      navigate(`/dashboard/${selectedChildId}`);
    }
  };

  const handleMeasurementSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Mise à jour",
      description: "Les graphiques ont été mis à jour avec les nouvelles mesures",
    });
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic">
          Tableau de Bord Parental
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="profiles">Profils</TabsTrigger>
            <TabsTrigger value="growth" disabled={!selectedChildId}>
              Croissance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-8">
            <ChildProfilesList onSelectChild={handleChildSelected} />
            <ChildProfileForm onSuccess={(childId) => {
              setSelectedChildId(childId);
              setActiveTab('growth');
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
                  onSuccess={handleMeasurementSuccess}
                />

                <div className="flex justify-center mt-6 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedChildId(null);
                      setActiveTab('profiles');
                    }}
                  >
                    Retour aux profils
                  </Button>
                  
                  <Button onClick={handleViewDashboard}>
                    Voir le tableau de bord complet
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ParentalDashboard;
