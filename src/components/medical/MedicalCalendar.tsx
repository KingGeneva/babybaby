
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MedicalAppointment } from '@/types/medical';
import { useNavigate } from 'react-router-dom';

interface MedicalCalendarProps {
  appointments: MedicalAppointment[];
  onDateSelect?: (date: Date) => void;
  childId: string;
}

export default function MedicalCalendar({ appointments, onDateSelect, childId }: MedicalCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  
  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const appointmentDate = appointment.date;
    if (!acc[appointmentDate]) {
      acc[appointmentDate] = [];
    }
    acc[appointmentDate].push(appointment);
    return acc;
  }, {} as Record<string, MedicalAppointment[]>);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && onDateSelect) {
      onDateSelect(selectedDate);
    }
  };
  
  // Custom day renderer to show appointments
  const renderDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const hasAppointments = appointmentsByDate[dateStr]?.length > 0;
    
    return (
      <div className="relative w-full h-full">
        <div>{day.getDate()}</div>
        {hasAppointments && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-babybaby-cosmic"></div>
          </div>
        )}
      </div>
    );
  };
  
  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const selectedDateAppointments = appointmentsByDate[selectedDateStr] || [];
  
  const handleAddAppointment = () => {
    navigate(`/medical/appointment/new?childId=${childId}${date ? `&date=${selectedDateStr}` : ''}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Calendrier Médical</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleAddAppointment}
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter</span>
          </Button>
        </div>
        <CardDescription>
          Consultations et vaccinations prévues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mb-4"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("pointer-events-auto")}
                  components={{
                    Day: ({ date: day, ...props }) => (
                      <button {...props} className={`${props.className}`}>
                        {renderDay(day)}
                      </button>
                    ),
                  }}
                />
              </PopoverContent>
            </Popover>
            
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-medium">
                {date ? format(date, 'EEEE d MMMM yyyy', { locale: fr }) : 'Aucune date sélectionnée'}
              </h3>
              
              {selectedDateAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune consultation prévue à cette date.
                </p>
              ) : (
                <ul className="space-y-2">
                  {selectedDateAppointments.map((appointment) => (
                    <li key={appointment.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{appointment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.time || 'Heure non spécifiée'} • {appointment.doctor}
                          </p>
                        </div>
                        <Badge variant={appointment.completed ? "secondary" : "default"}>
                          {appointment.completed ? "Terminé" : "À venir"}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 md:border-l md:pl-6">
            <h3 className="text-lg font-medium mb-4">Consultations à venir</h3>
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune consultation prévue.
                </p>
              ) : (
                appointments
                  .filter(app => {
                    const appDate = new Date(app.date);
                    return appDate >= new Date() && !app.completed;
                  })
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map(appointment => (
                    <div key={appointment.id} className="flex items-center border-b pb-2">
                      <div className="w-12 h-12 bg-babybaby-lightblue rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">
                          {format(new Date(appointment.date), 'dd MMM', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{appointment.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.doctor} • {appointment.type === 'vaccination' ? 'Vaccination' : 'Consultation'}
                        </p>
                      </div>
                      <Badge 
                        className={cn(
                          appointment.type === 'vaccination' ? 'bg-babybaby-cosmic text-white' : '',
                          appointment.type === 'check-up' ? 'bg-green-100 text-green-800' : '',
                          appointment.type === 'specialist' ? 'bg-purple-100 text-purple-800' : ''
                        )}
                      >
                        {appointment.type === 'vaccination' ? 'Vaccin' : 
                         appointment.type === 'check-up' ? 'Routine' : 
                         appointment.type === 'specialist' ? 'Spécialiste' : 'Autre'}
                      </Badge>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
