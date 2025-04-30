
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/components/ui/use-toast';
import { Clock, Moon, AlarmClock, Baby } from 'lucide-react';
import SleepLogForm from './sleep-tracker/SleepLogForm';
import SleepHistoryView from './sleep-tracker/SleepHistoryView';
import SleepAnalytics from './sleep-tracker/SleepAnalytics';

interface SleepTrackerProps {}

const SleepTracker: React.FC<SleepTrackerProps> = () => {
  const [activeTab, setActiveTab] = useState('log');

  return (
    <Card className="w-full shadow-lg border-sky-100">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="bg-sky-100 p-3 rounded-full">
            <Moon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-babybaby-cosmic">Suivi du sommeil de bébé</CardTitle>
            <CardDescription>Enregistrez et analysez les habitudes de sommeil de votre bébé</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="log" className="flex items-center gap-2">
              <AlarmClock className="h-4 w-4" />
              <span>Enregistrer</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Historique</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Baby className="h-4 w-4" />
              <span>Analyse</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="log" className="space-y-4">
            <SleepLogForm />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <SleepHistoryView />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <SleepAnalytics />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-4 border-t bg-sky-50/30">
        <div className="text-xs text-slate-500">Les données sont stockées localement sur votre appareil</div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sync" className="text-xs">Sauvegarder en ligne</Label>
          <Switch id="sync" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default SleepTracker;
