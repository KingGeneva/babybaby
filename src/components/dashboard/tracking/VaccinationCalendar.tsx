
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Syringe, Check, CalendarClock } from 'lucide-react';

interface Vaccine {
  age: string;
  name: string;
  date?: string;
  status: 'completed' | 'upcoming' | 'scheduled';
}

const VaccinationCalendar = () => {
  const vaccines: Vaccine[] = [
    { age: '2 mois', name: 'Hexavalent', date: '15/03/2025', status: 'completed' },
    { age: '4 mois', name: 'Hexavalent + Pneumo', date: '15/05/2025', status: 'scheduled' },
    { age: '11 mois', name: 'Hexavalent + Pneumo', date: '15/12/2025', status: 'upcoming' },
  ];

  const getStatusIcon = (status: Vaccine['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'scheduled':
        return <CalendarClock className="h-5 w-5 text-amber-500" />;
      default:
        return <Syringe className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Syringe className="h-5 w-5 text-babybaby-cosmic" />
          Calendrier de vaccination
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vaccines.map((vaccine, index) => (
            <div key={index} className="flex items-start gap-4">
              <div 
                className={`rounded-full p-2 ${
                  vaccine.status === 'completed' ? 'bg-green-100' :
                  vaccine.status === 'scheduled' ? 'bg-amber-100' : 'bg-gray-100'
                }`}
              >
                {getStatusIcon(vaccine.status)}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">
                  {vaccine.age} - {vaccine.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {vaccine.status === 'completed' 
                    ? `Complété le ${vaccine.date}`
                    : vaccine.status === 'scheduled'
                    ? `Prévu le ${vaccine.date}`
                    : `À planifier`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VaccinationCalendar;
