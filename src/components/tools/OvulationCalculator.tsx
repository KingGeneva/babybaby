
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';

const OvulationCalculator = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState(28);
  const [ovulationDate, setOvulationDate] = useState<Date | null>(null);
  const [fertilePeriod, setFertilePeriod] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const calculateOvulation = () => {
    if (!lastPeriod) return;

    // L'ovulation se produit généralement 14 jours avant le début des prochaines règles
    const ovulationDay = addDays(lastPeriod, cycleLength - 14);
    setOvulationDate(ovulationDay);

    // La période fertile commence 5 jours avant l'ovulation et se termine 1 jour après
    setFertilePeriod({
      start: subDays(ovulationDay, 5),
      end: addDays(ovulationDay, 1),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-babybaby-cosmic">
          <Baby className="h-6 w-6" />
          Calculateur d'Ovulation
        </CardTitle>
        <CardDescription>
          Calculez votre période d'ovulation et votre fenêtre de fertilité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Premier jour des dernières règles</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !lastPeriod && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {lastPeriod ? format(lastPeriod, 'PPP', { locale: fr }) : <span>Sélectionnez une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={lastPeriod}
                onSelect={setLastPeriod}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Durée du cycle (en jours)</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={cycleLength}
            onChange={(e) => setCycleLength(parseInt(e.target.value))}
          >
            {Array.from({ length: 15 }, (_, i) => i + 21).map((days) => (
              <option key={days} value={days}>
                {days} jours
              </option>
            ))}
          </select>
        </div>

        <Button 
          className="w-full" 
          onClick={calculateOvulation}
          disabled={!lastPeriod}
        >
          Calculer
        </Button>

        {ovulationDate && fertilePeriod.start && fertilePeriod.end && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-4 bg-babybaby-cosmic/5 rounded-lg"
          >
            <div>
              <h4 className="font-semibold text-babybaby-cosmic">Date d'ovulation probable</h4>
              <p>{format(ovulationDate, 'PPP', { locale: fr })}</p>
            </div>
            <div>
              <h4 className="font-semibold text-babybaby-cosmic">Période fertile</h4>
              <p>Du {format(fertilePeriod.start, 'PPP', { locale: fr })}</p>
              <p>Au {format(fertilePeriod.end, 'PPP', { locale: fr })}</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default OvulationCalculator;
