
import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAnalyticsData, getWeeklyChartData } from './sleepTrackerStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Baby, Clock } from 'lucide-react';

const SleepAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('week');
  
  useEffect(() => {
    const data = getAnalyticsData();
    setAnalyticsData(data);
    
    const weeklyData = getWeeklyChartData();
    setChartData(weeklyData);
  }, []);
  
  if (!analyticsData) {
    return <div>Chargement des données...</div>;
  }
  
  // Format duration for display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins < 10 ? '0' + mins : mins}`;
  };
  
  // Chart colors
  const chartColors = ['#E5E7EB', '#DBEAFE', '#C7D2FE', '#DDD6FE', '#FAE8FF', '#FCE7F3', '#FEE2E2'];
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded shadow border">
          <p className="font-medium">{format(new Date(data.date), 'EEEE d MMMM', { locale: fr })}</p>
          <p className="text-babybaby-cosmic">
            {Math.floor(data.totalMinutes / 60)}h{(data.totalMinutes % 60).toString().padStart(2, '0')} de sommeil
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total périodes</h3>
            <p className="text-3xl font-bold text-babybaby-cosmic">{analyticsData.totalLogs}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Durée moyenne</h3>
            <p className="text-3xl font-bold text-babybaby-cosmic">
              {formatDuration(analyticsData.averageDuration)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Qualité</h3>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Bon: {analyticsData.qualityDistribution.good}
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                Moyen: {analyticsData.qualityDistribution.medium}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                Mauvais: {analyticsData.qualityDistribution.poor}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Card className="overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="p-4 bg-slate-50">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="week">7 derniers jours</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="week" className="p-0">
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="dayName" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}h`}
                      domain={[0, 24]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="totalHours" name="Heures de sommeil" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10">
                <Clock className="h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-xl font-medium text-slate-700">Pas assez de données</h3>
                <p className="text-slate-500 text-center mt-2">
                  Enregistrez le sommeil de votre bébé pendant quelques jours pour voir des statistiques.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Recommendations based on data */}
      {analyticsData.totalLogs > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Baby className="h-5 w-5 text-babybaby-cosmic" />
              <h3 className="font-medium">Conseils personnalisés</h3>
            </div>
            
            <ul className="space-y-2">
              {analyticsData.averageDuration < 480 && (
                <li className="text-sm text-slate-600">
                  La durée moyenne de sommeil semble insuffisante. Les bébés ont généralement besoin de 12 à 16 heures de sommeil par jour.
                </li>
              )}
              
              {analyticsData.qualityDistribution.poor > analyticsData.qualityDistribution.good && (
                <li className="text-sm text-slate-600">
                  La qualité du sommeil est souvent mauvaise. Essayez d'établir une routine de coucher régulière pour améliorer la qualité du sommeil.
                </li>
              )}
              
              {analyticsData.totalLogs > 3 && (
                <li className="text-sm text-slate-600">
                  Continuez à enregistrer régulièrement les périodes de sommeil pour obtenir des analyses plus précises.
                </li>
              )}
              
              <li className="text-sm text-slate-600">
                Consultez notre article <span className="text-babybaby-cosmic hover:underline cursor-pointer">Comprendre et améliorer le sommeil de votre bébé</span> pour plus de conseils personnalisés.
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SleepAnalytics;
