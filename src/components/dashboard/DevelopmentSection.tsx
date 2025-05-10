
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MilestonesList from './MilestonesList';
import MedicalWidget from '@/components/medical/MedicalWidget';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import DevelopmentStagesGuide from './milestones/DevelopmentStagesGuide';
import BabyAgeDisplay from './milestones/BabyAgeDisplay';
import DevelopmentArticles from './milestones/DevelopmentArticles';

interface DevelopmentSectionProps {
  childId: string;
}

const DevelopmentSection: React.FC<DevelopmentSectionProps> = ({ childId }) => {
  const [birthDate, setBirthDate] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [babyAgeMonths, setBabyAgeMonths] = useState(0);
  
  useEffect(() => {
    // Pour les démos et tests, on définit une date de naissance par défaut
    if (!childId || childId === 'demo') {
      setBirthDate('2023-01-01');
      setBabyAgeMonths(4); // Pour la démo, on suppose un bébé de 4 mois
      setIsLoading(false);
      return;
    }
    
    const fetchChildData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('child_profiles')
          .select('birth_date')
          .eq('id', childId)
          .single();
          
        if (!error && data) {
          setBirthDate(data.birth_date);
          
          // Calculer l'âge en mois
          const birthDateObj = new Date(data.birth_date);
          const today = new Date();
          let months = (today.getFullYear() - birthDateObj.getFullYear()) * 12;
          months -= birthDateObj.getMonth();
          months += today.getMonth();
          
          // Ajustement si le jour du mois n'est pas encore passé
          if (today.getDate() < birthDateObj.getDate()) {
            months--;
          }
          
          setBabyAgeMonths(Math.max(0, months));
        } else if (error) {
          console.error('Error fetching child data:', error);
          setError("Impossible de charger les données de l'enfant");
          toast({
            title: "Erreur de chargement",
            description: "Utilisation des données de démonstration à la place",
            variant: "destructive"
          });
          // Fallback pour éviter les erreurs
          setBirthDate('2023-01-01');
          setBabyAgeMonths(4);
        }
      } catch (error) {
        console.error('Error in fetchChildData:', error);
        setError("Une erreur s'est produite lors du chargement des données");
        // Fallback pour éviter les erreurs
        setBirthDate('2023-01-01');
        setBabyAgeMonths(4);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChildData();
  }, [childId]);

  return (
    <div className="space-y-6 mb-12">
      {/* Guide des étapes de développement */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section principale avec guide de développement */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Développement de votre enfant</CardTitle>
                  {birthDate && <BabyAgeDisplay babyAgeMonths={babyAgeMonths} birthDate={birthDate} />}
                </div>
              </CardHeader>
              <CardContent>
                <DevelopmentStagesGuide babyAgeMonths={babyAgeMonths} />
                <div className="mt-6">
                  <DevelopmentArticles ageMonths={babyAgeMonths} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Widget médical */}
          <div>
            <MedicalWidget childId={childId} />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Jalons de développement</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-babybaby-cosmic"></div>
                </div>
              ) : (
                <MilestonesList childId={childId} birthDate={birthDate} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentSection;
