import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Baby, Calendar, Syringe } from 'lucide-react';
import { MedicalAppointment, Vaccination, VACCINATION_SCHEDULE } from '@/types/medical';
import MedicalCalendar from '@/components/medical/MedicalCalendar';
import VaccinationTracker from '@/components/medical/VaccinationTracker';
import { toast } from '@/components/ui/use-toast';
import P5Canvas from '@/components/P5Canvas';
import { convertAppointments } from '@/utils/medicalUtils';

export default function MedicalDashboardPage() {
  const { childId } = useParams<{ childId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar');
  const [childData, setChildData] = useState<{ name: string; birth_date: string } | null>(null);
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!childId) return;

    const fetchChildData = async () => {
      try {
        const { data: childData, error: childError } = await supabase
          .from('child_profiles')
          .select('name, birth_date')
          .eq('id', childId)
          .single();

        if (childError) throw childError;
        setChildData(childData);
      } catch (error) {
        console.error('Error fetching child data:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données du profil de l\'enfant',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildData();
  }, [childId, navigate]);
  
  const handleVaccinationStatusChange = async (id: string, completed: boolean, date?: string) => {
    try {
      console.log('Updating vaccination status:', id, completed, date);
      
      setVaccinations(prev => 
        prev.map(v => 
          v.id === id ? { ...v, administeredDate: completed ? date : undefined } : v
        )
      );
      
      toast({
        title: completed ? 'Vaccination enregistrée' : 'Statut mis à jour',
        description: completed 
          ? 'La vaccination a été enregistrée comme effectuée.' 
          : 'Le statut de la vaccination a été mis à jour.',
      });
    } catch (error) {
      console.error('Error updating vaccination status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut de la vaccination',
        variant: 'destructive',
      });
    }
  };
  
  useEffect(() => {
    if (!childId || !childData) return;
    
    const demoAppointments: MedicalAppointment[] = [
      {
        id: '1',
        title: 'Visite des 4 mois',
        date: '2025-05-10',
        time: '14:30',
        doctor: 'Dr. Martin',
        location: 'Cabinet médical',
        completed: false,
        type: 'checkup',
        childId: childId
      },
      {
        id: '2',
        title: 'Vaccination hexavalent',
        date: '2025-05-15',
        doctor: 'Dr. Dupont',
        completed: false,
        type: 'vaccination',
        childId: childId
      }
    ];
    
    const demoVaccinations: Vaccination[] = VACCINATION_SCHEDULE.flatMap(schedule => 
      schedule.vaccines.map((vaccine, index) => ({
        id: `${schedule.ageGroup}-${index}`,
        name: vaccine.name,
        recommendedAge: schedule.ageGroup,
        description: vaccine.description || '',
        mandatory: vaccine.mandatory,
        administeredDate: Math.random() > 0.7 ? '2025-03-01' : undefined
      }))
    );
    
    setAppointments(demoAppointments);
    setVaccinations(demoVaccinations);
  }, [childId, childData]);
  
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => navigate(`/dashboard/${childId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">
              <span className="text-babybaby-cosmic">Suivi Médical</span>
              {childData ? ` - ${childData.name}` : ''}
            </h1>
          </div>
          
          <div className="flex items-center">
            <Baby className="h-5 w-5 mr-2 text-babybaby-cosmic" />
            <span>
              {childData?.birth_date && `${calculateAge(childData.birth_date)}`}
            </span>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="vaccinations" className="flex items-center">
              <Syringe className="h-4 w-4 mr-2" />
              Vaccinations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <MedicalCalendar 
              appointments={convertAppointments(appointments)}
              childId={childId!}
            />
          </TabsContent>
          
          <TabsContent value="vaccinations">
            {childData && (
              <VaccinationTracker 
                vaccinations={vaccinations}
                birthDate={childData.birth_date}
                onVaccinationStatusChange={handleVaccinationStatusChange}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  
  const yearDiff = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  let years = yearDiff;
  let months = monthDiff;
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years--;
    months = 12 + monthDiff;
  }
  
  if (years < 2) {
    const totalMonths = years * 12 + months;
    return `${totalMonths} mois`;
  }
  
  return `${years} an${years > 1 ? 's' : ''}`;
}
