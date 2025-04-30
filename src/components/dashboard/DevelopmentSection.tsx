
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MilestonesList from './MilestonesList';
import MedicalWidget from '@/components/medical/MedicalWidget';

interface DevelopmentSectionProps {
  childId: string;
}

const DevelopmentSection: React.FC<DevelopmentSectionProps> = ({ childId }) => {
  const [birthDate, setBirthDate] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Pour les démos et tests, on définit une date de naissance par défaut
    if (!childId || childId === 'demo') {
      setBirthDate('2023-01-01');
      return;
    }
    
    const fetchChildData = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data, error } = await supabase
          .from('child_profiles')
          .select('birth_date')
          .eq('id', childId)
          .single();
          
        if (!error && data) {
          console.log('Child data fetched:', data);
          setBirthDate(data.birth_date);
        } else if (error) {
          console.error('Error fetching child data:', error);
          // Fallback pour éviter les erreurs
          setBirthDate('2023-01-01');
        }
      } catch (error) {
        console.error('Error in fetchChildData:', error);
        // Fallback pour éviter les erreurs
        setBirthDate('2023-01-01');
      }
    };
    
    fetchChildData();
  }, [childId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Étapes de développement</CardTitle>
          </CardHeader>
          <CardContent>
            <MilestonesList childId={childId} birthDate={birthDate} />
          </CardContent>
        </Card>
      </div>
      <div>
        <MedicalWidget childId={childId} />
      </div>
    </div>
  );
};

export default DevelopmentSection;
