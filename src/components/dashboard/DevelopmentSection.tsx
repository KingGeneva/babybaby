
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MilestonesList from './MilestonesList';
import MedicalWidget from '@/components/medical/MedicalWidget';
import { supabase } from '@/integrations/supabase/client';

interface DevelopmentSectionProps {
  childId: string;
}

const DevelopmentSection: React.FC<DevelopmentSectionProps> = ({ childId }) => {
  const [birthDate, setBirthDate] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const fetchChildData = async () => {
      if (childId) {
        const { data, error } = await supabase
          .from('child_profiles')
          .select('birth_date')
          .eq('id', childId)
          .single();
          
        if (!error && data) {
          setBirthDate(data.birth_date);
        }
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
