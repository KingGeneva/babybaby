import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MilestonesList from './MilestonesList';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  childId: string;
}

const MilestonesPanel: React.FC<Props> = ({ childId }) => {
  const [birthDate, setBirthDate] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId || childId === 'demo') {
      setBirthDate('2023-01-01');
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase.from('child_profiles').select('birth_date').eq('id', childId).single();
      if (data) setBirthDate(data.birth_date);
      setLoading(false);
    })();
  }, [childId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Étapes de développement</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-babybaby-cosmic" />
          </div>
        ) : (
          <MilestonesList childId={childId} birthDate={birthDate} />
        )}
      </CardContent>
    </Card>
  );
};

export default MilestonesPanel;
