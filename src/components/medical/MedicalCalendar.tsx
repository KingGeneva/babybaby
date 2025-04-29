
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface AppointmentType {
  id: string;
  date: Date | string;
  title: string;
  doctor: string;
  type: 'vaccine' | 'checkup' | 'specialist';
  notes?: string;
}

// Données de démo
const demoAppointments: AppointmentType[] = [
  {
    id: '1',
    date: new Date(2025, 4, 15),
    title: 'Visite pédiatre',
    doctor: 'Dr. Martin',
    type: 'checkup'
  },
  {
    id: '2',
    date: new Date(2025, 4, 22),
    title: 'Vaccination 12 mois',
    doctor: 'Dr. Petit',
    type: 'vaccine'
  },
  {
    id: '3',
    date: new Date(2025, 5, 5),
    title: 'Ophtalmologue',
    doctor: 'Dr. Leblanc',
    type: 'specialist',
    notes: 'Apporter le dossier médical'
  }
];

interface MedicalCalendarProps {
  appointments?: AppointmentType[];
  isDemo?: boolean;
  onAddAppointment?: () => void;
}

const MedicalCalendar: React.FC<MedicalCalendarProps> = ({
  appointments = [],
  isDemo = false,
  onAddAppointment
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  // Utiliser les données de démo si en mode démo
  const displayAppointments = isDemo ? demoAppointments : appointments;

  // Fonction pour formatter la date des rendez-vous
  const formatAppointmentDate = (date: Date | string): string => {
    if (typeof date === 'string') {
      return format(new Date(date), 'PPP', { locale: fr });
    }
    return format(date, 'PPP', { locale: fr });
  };

  // Génère des badges différents selon le type de rendez-vous
  const getAppointmentBadge = (type: string) => {
    switch (type) {
      case 'vaccine':
        return <Badge variant="default" className="bg-green-500">Vaccin</Badge>;
      case 'specialist':
        return <Badge variant="default" className="bg-purple-500">Spécialiste</Badge>;
      default:
        return <Badge variant="outline">Contrôle</Badge>;
    }
  };

  // Fonction pour afficher les détails d'un rendez-vous lorsqu'on clique sur une date
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    setDate(selectedDate);
    
    const appointmentsOnDate = displayAppointments.filter(apt => {
      const aptDate = typeof apt.date === 'string' ? new Date(apt.date) : apt.date;
      return aptDate.toDateString() === selectedDate.toDateString();
    });
    
    if (appointmentsOnDate.length > 0) {
      toast({
        title: `Rendez-vous du ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`,
        description: appointmentsOnDate.map(apt => apt.title).join(', '),
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <CalendarClock className="h-5 w-5" />
          Calendrier médical
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Prochains rendez-vous</h3>
            </div>
            
            {displayAppointments.length > 0 ? (
              <div className="space-y-3">
                {displayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-start gap-2 border-l-2 border-babybaby-cosmic pl-3">
                    <div>
                      <p className="text-sm font-medium">{apt.title}</p>
                      <p className="text-xs text-muted-foreground">{formatAppointmentDate(apt.date)} • {apt.doctor}</p>
                      <div className="mt-1">{getAppointmentBadge(apt.type)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Aucun rendez-vous à venir</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalCalendar;
