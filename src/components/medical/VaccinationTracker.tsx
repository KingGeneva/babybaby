import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Vaccination, VACCINATION_SCHEDULE } from '@/types/medical';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Syringe, Calendar, CalendarCheck } from 'lucide-react';

interface VaccinationTrackerProps {
  vaccinations: Vaccination[];
  birthDate: string;
  onVaccinationStatusChange: (id: string, completed: boolean, date?: string) => void;
}

export default function VaccinationTracker({
  vaccinations,
  birthDate,
  onVaccinationStatusChange,
}: VaccinationTrackerProps) {
  const birthDateObj = new Date(birthDate);
  
  const today = new Date();
  const ageInMonths = 
    (today.getFullYear() - birthDateObj.getFullYear()) * 12 +
    (today.getMonth() - birthDateObj.getMonth());
  
  const getUpcomingVaccinations = () => {
    let upcoming: { vaccine: string; age: string }[] = [];
    
    VACCINATION_SCHEDULE.forEach(schedule => {
      const ageMonths = parseAgeToMonths(schedule.ageGroup);
      
      if (ageMonths > ageInMonths && ageMonths <= ageInMonths + 6) {
        schedule.vaccines.forEach(vaccine => {
          const isAdministered = vaccinations.some(
            v => v.name === vaccine.name && v.administeredDate
          );
          
          if (!isAdministered) {
            upcoming.push({
              vaccine: vaccine.name,
              age: schedule.ageGroup
            });
          }
        });
      }
    });
    
    return upcoming;
  };
  
  const parseAgeToMonths = (ageString: string): number => {
    if (ageString === "Naissance") return 0;
    
    const match = ageString.match(/(\d+)(?:-(\d+))?\s*mois/);
    if (!match) return 0;
    
    if (match[2]) {
      return parseInt(match[1]);
    } else {
      return parseInt(match[1]);
    }
  };
  
  const upcomingVaccinations = getUpcomingVaccinations();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5 text-babybaby-cosmic" />
                Carnet de Vaccination
              </CardTitle>
              <CardDescription>
                Suivi des vaccinations obligatoires et recommandées
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-babybaby-lightblue/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Prochaines vaccinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingVaccinations.length > 0 ? (
                  <ul className="space-y-2">
                    {upcomingVaccinations.map((item, index) => (
                      <li key={index} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium text-sm">{item.vaccine}</p>
                          <p className="text-xs text-muted-foreground">À {item.age}</p>
                        </div>
                        <Badge variant="outline" className="bg-white">À venir</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Toutes les vaccinations prévues pour l'âge actuel ont été effectuées.
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  Dernières vaccinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vaccinations.filter(v => v.administeredDate).length > 0 ? (
                  <ul className="space-y-2">
                    {vaccinations
                      .filter(v => v.administeredDate)
                      .sort((a, b) => 
                        new Date(b.administeredDate!).getTime() - new Date(a.administeredDate!).getTime()
                      )
                      .slice(0, 5)
                      .map(vaccination => (
                        <li key={vaccination.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium text-sm">{vaccination.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {vaccination.administeredDate && 
                                format(new Date(vaccination.administeredDate), 'dd MMMM yyyy', { locale: fr })}
                            </p>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="bg-green-100 text-green-800"
                          >
                            Fait
                          </Badge>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune vaccination enregistrée pour le moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 overflow-auto">
            <h3 className="text-lg font-medium mb-4">Calendrier vaccinal complet</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Âge</TableHead>
                  <TableHead>Vaccin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-16">Obligatoire</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VACCINATION_SCHEDULE.map((schedule) => (
                  <React.Fragment key={schedule.ageGroup}>
                    {schedule.vaccines.map((vaccine, index) => {
                      const matchedVaccine = vaccinations.find(v => v.name === vaccine.name);
                      const isCompleted = !!matchedVaccine?.administeredDate;
                      
                      return (
                        <TableRow key={`${schedule.ageGroup}-${index}`}>
                          {index === 0 ? (
                            <TableCell rowSpan={schedule.vaccines.length} className="font-medium">
                              {schedule.ageGroup}
                            </TableCell>
                          ) : null}
                          <TableCell>{vaccine.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Checkbox
                                id={`vaccine-${schedule.ageGroup}-${index}`}
                                checked={isCompleted}
                                onCheckedChange={(checked) => {
                                  if (matchedVaccine) {
                                    onVaccinationStatusChange(
                                      matchedVaccine.id, 
                                      !!checked, 
                                      checked ? new Date().toISOString().split('T')[0] : undefined
                                    );
                                  }
                                }}
                              />
                              <Badge className="ml-2" variant={isCompleted ? "secondary" : "outline"}>
                                {isCompleted ? "Fait" : "Non fait"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {matchedVaccine?.administeredDate ? 
                              format(new Date(matchedVaccine.administeredDate), 'dd/MM/yyyy') : 
                              '-'}
                          </TableCell>
                          <TableCell>
                            {vaccine.mandatory ? (
                              <Badge variant="default" className="bg-red-100 text-red-800">
                                Obligatoire
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100">
                                Recommandé
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
