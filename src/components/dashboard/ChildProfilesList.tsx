
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Baby, Calendar, Ruler, Weight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { calculateAge } from '@/lib/date-utils';

interface ChildProfile {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
}

interface GrowthMeasurement {
  id: string;
  measurement_date: string;
  height_cm: number;
  weight_kg: number;
}

const ChildProfilesList: React.FC<{ 
  onSelectChild: (childId: string) => void 
}> = ({ onSelectChild }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [latestMeasurements, setLatestMeasurements] = useState<Record<string, GrowthMeasurement>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('child_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setProfiles(data || []);
        
        // Fetch latest measurements for each profile
        if (data && data.length > 0) {
          for (const profile of data) {
            const { data: measurementData, error: measurementError } = await supabase
              .from('growth_measurements')
              .select('*')
              .eq('child_id', profile.id)
              .order('measurement_date', { ascending: false })
              .limit(1)
              .single();
              
            if (!measurementError && measurementData) {
              setLatestMeasurements(prev => ({
                ...prev,
                [profile.id]: measurementData
              }));
            }
          }
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les profils",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-pulse w-full h-24 bg-gray-100 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (profiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profils des bébés</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p className="mb-4">Vous n'avez pas encore créé de profil de bébé.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Profils des bébés</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enfant</TableHead>
              <TableHead>Âge</TableHead>
              <TableHead className="hidden md:table-cell">Taille</TableHead>
              <TableHead className="hidden md:table-cell">Poids</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => {
              const measurement = latestMeasurements[profile.id];
              return (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className={profile.gender === 'fille' ? 'bg-pink-100' : 'bg-blue-100'}>
                          {profile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(profile.birth_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{calculateAge(profile.birth_date)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {measurement ? (
                      <div className="flex items-center space-x-1">
                        <Ruler className="h-4 w-4 text-gray-500" />
                        <span>{measurement.height_cm} cm</span>
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {measurement ? (
                      <div className="flex items-center space-x-1">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>{measurement.weight_kg} kg</span>
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSelectChild(profile.id)}
                    >
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ChildProfilesList;

