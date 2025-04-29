
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import P5Canvas from '@/components/P5Canvas';
import MedicalDashboardHeader from '@/components/medical/MedicalDashboardHeader';
import MedicalDashboardTabs from '@/components/medical/MedicalDashboardTabs';
import { useMedicalDashboard } from '@/hooks/useMedicalDashboard';

export default function MedicalDashboardPage() {
  const { childId } = useParams<{ childId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    childData,
    appointments,
    vaccinations,
    isLoading,
    handleVaccinationStatusChange
  } = useMedicalDashboard({ childId });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <MedicalDashboardHeader 
          childId={childId!}
          childName={childData?.name}
          birthDate={childData?.birth_date}
        />
        
        <MedicalDashboardTabs 
          childId={childId!}
          appointments={appointments}
          vaccinations={vaccinations}
          birthDate={childData?.birth_date}
          onVaccinationStatusChange={handleVaccinationStatusChange}
        />
      </div>
      
      <Footer />
    </div>
  );
}
