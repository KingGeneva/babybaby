import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Pill, Syringe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MedicalAppointment } from '@/types/medical';

interface MedicalWidgetProps {
  childId: string;
}

export default function MedicalWidget({ childId }: MedicalWidgetProps) {
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<MedicalAppointment[]>([]);
  const [pendingVaccines, setPendingVaccines] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        // For demo purposes, we'll use mock data since the tables don't exist yet
        const demoAppointments: MedicalAppointment[] = [
          {
            id: '1',
            title: 'Visite des 4 mois',
            date: '2025-05-10',
            time: '14:30',
            doctor: 'Dr. Martin',
            location: 'Cabinet médical',
            notes: 'Apporter le carnet de santé',
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
        
        setUpcomingAppointments(demoAppointments);
        setPendingVaccines(3); // Demo pending vaccines count
      } catch (error) {
        console.error('Error fetching medical data:', error);
        setUpcomingAppointments([]);
        setPendingVaccines(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicalData();
  }, [childId]);

  const handleViewMedical = () => {
    navigate(`/medical/dashboard/${childId}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Suivi médical</CardTitle>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0" 
          onClick={handleViewMedical}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-36">
            <div className="animate-pulse w-full space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-1 text-babybaby-cosmic" />
                  <span className="text-sm font-medium">Rendez-vous</span>
                </div>
                <p className="text-2xl font-bold text-babybaby-cosmic">
                  {upcomingAppointments.length}
                </p>
                <p className="text-xs text-gray-500">À venir</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="flex items-center mb-1">
                  <Syringe className="h-4 w-4 mr-1 text-purple-600" />
                  <span className="text-sm font-medium">Vaccins</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {pendingVaccines}
                </p>
                <p className="text-xs text-gray-500">En attente</p>
              </div>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Prochains rendez-vous</h4>
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center border-b border-gray-100 pb-2">
                    <div className="bg-blue-100 h-8 w-8 rounded flex items-center justify-center mr-3">
                      {appointment.type === 'vaccination' ? (
                        <Syringe className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Pill className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {appointment.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(appointment.date), "dd MMM", { locale: fr })}
                        {appointment.time ? ` à ${appointment.time}` : ''}
                      </p>
                    </div>
                    <Badge 
                      className={appointment.type === 'vaccination' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}
                      variant="outline"
                    >
                      {appointment.type === 'vaccination' ? 'Vaccin' : 'Visite'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-sm text-gray-500">
                  Aucun rendez-vous médical prévu
                </p>
                <Button 
                  variant="link" 
                  className="mt-1 text-babybaby-cosmic" 
                  onClick={() => navigate(`/medical/appointment/new?childId=${childId}`)}
                >
                  Planifier un rendez-vous
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
