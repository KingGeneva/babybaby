
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { jour: 'Lun', heures: 11 },
  { jour: 'Mar', heures: 12 },
  { jour: 'Mer', heures: 10 },
  { jour: 'Jeu', heures: 13 },
  { jour: 'Ven', heures: 11.5 },
  { jour: 'Sam', heures: 12.5 },
  { jour: 'Dim', heures: 11.5 },
];

const SleepTracker = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-babybaby-cosmic" />
            Suivi du sommeil
          </CardTitle>
          <Plus className="h-5 w-5 text-pink-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="jour" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                ticks={[0, 4, 8, 12, 16]}
                domain={[0, 16]}
                label={{ value: 'h', position: 'top' }}
              />
              <Bar
                dataKey="heures"
                fill="#86efac"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div>
            <p className="text-2xl font-bold text-pink-400">12h20</p>
            <p className="text-sm text-gray-500">Durée totale</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-400">3</p>
            <p className="text-sm text-gray-500">Siestes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-400">7h</p>
            <p className="text-sm text-gray-500">Nuit</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepTracker;
