
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MedicalAppointment, Vaccination, VACCINATION_SCHEDULE } from '@/types/medical';
import { toast } from '@/components/ui/use-toast';

interface UseMedicalDashboardProps {
  childId: string | undefined;
}

export function useMedicalDashboard({ childId }: UseMedicalDashboardProps) {
  const [childData, setChildData] = useState<{ name: string; birth_date: string } | null>(null);
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  }, [childId]);
  
  useEffect(() => {
    if (!childId || !childData) return;
    
    // For demo purposes, since we don't have the actual tables yet
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

  return {
    childData,
    appointments,
    vaccinations,
    isLoading,
    handleVaccinationStatusChange
  };
}
