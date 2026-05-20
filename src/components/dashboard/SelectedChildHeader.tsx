import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { calculateAge } from '@/lib/date-utils';
import { ArrowLeft } from 'lucide-react';

interface Props {
  childId: string;
  onChange: () => void;
}

const SelectedChildHeader: React.FC<Props> = ({ childId, onChange }) => {
  const [child, setChild] = useState<{ name: string; birth_date: string; gender: string | null } | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from('child_profiles')
        .select('name, birth_date, gender')
        .eq('id', childId)
        .single();
      if (!cancel && data) setChild(data as any);
    })();
    return () => { cancel = true; };
  }, [childId]);

  if (!child) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-12 w-12">
            <AvatarFallback className={child.gender === 'fille' ? 'bg-pink-100' : 'bg-blue-100'}>
              {child.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold truncate">{child.name}</div>
            <div className="text-sm text-muted-foreground">{calculateAge(child.birth_date)}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onChange}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Changer d'enfant
        </Button>
      </CardContent>
    </Card>
  );
};

export default SelectedChildHeader;
