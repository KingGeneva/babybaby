
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Syringe } from 'lucide-react';
import MedicalCalendar from '@/components/medical/MedicalCalendar';
import VaccinationTracker from '@/components/medical/VaccinationTracker';
import { MedicalAppointment, Vaccination } from '@/types/medical';
import { AppointmentType } from '@/types/medical';
import { convertAppointments } from '@/utils/medicalUtils';

interface MedicalDashboardTabsProps {
  childId: string;
  appointments: MedicalAppointment[];
  vaccinations: Vaccination[];
  birthDate?: string;
  onVaccinationStatusChange: (id: string, completed: boolean, date?: string) => void;
}

const MedicalDashboardTabs: React.FC<MedicalDashboardTabsProps> = ({
  childId,
  appointments,
  vaccinations,
  birthDate,
  onVaccinationStatusChange
}) => {
  const [activeTab, setActiveTab] = useState('calendar');
  
  // Convert appointments to the expected format for MedicalCalendar
  const convertedAppointments = convertAppointments(appointments);
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="calendar" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Calendrier
        </TabsTrigger>
        <TabsTrigger value="vaccinations" className="flex items-center">
          <Syringe className="h-4 w-4 mr-2" />
          Vaccinations
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="calendar">
        <MedicalCalendar 
          appointments={convertedAppointments}
        />
      </TabsContent>
      
      <TabsContent value="vaccinations">
        {birthDate && (
          <VaccinationTracker 
            vaccinations={vaccinations}
            birthDate={birthDate}
            onVaccinationStatusChange={onVaccinationStatusChange}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MedicalDashboardTabs;
