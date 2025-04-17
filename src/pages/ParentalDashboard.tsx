
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import P5Canvas from '@/components/P5Canvas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <DashboardLoading />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic">
          Tableau de Bord Parental
        </h1>

        <DashboardTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedChildId={selectedChildId}
          onChildSelected={handleChildSelected}
          onMeasurementSuccess={handleMeasurementSuccess}
          onBackToProfiles={() => {
            setSelectedChildId(null);
            setActiveTab('profiles');
          }}
          onViewDashboard={handleViewDashboard}
          growthData={growthData}
          isLoadingData={isLoadingData}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ParentalDashboard;
