
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

export interface GrowthWidgetProps {
  title: string;
  data: Array<{date: string; value: number}>;
  metricType: string;
  color: string;
  childId?: string;
}

const GrowthWidget: React.FC<GrowthWidgetProps> = ({ title, data, metricType, color, childId }) => {
  const navigate = useNavigate();
  
  const handleAddMeasurement = () => {
    if (childId) {
      navigate(`/dashboard/${childId}/growth/add`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs flex items-center gap-1"
          onClick={handleAddMeasurement}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {data && data.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  domain={['auto', 'auto']}
                  width={30}
                />
                <Tooltip 
                  formatter={(value) => [`${value} ${metricType === 'poids' ? 'kg' : 'cm'}`, metricType.charAt(0).toUpperCase() + metricType.slice(1)]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 0, fill: color }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 w-full flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 mb-2">Aucune donnée disponible</p>
            <p className="text-sm text-gray-400">
              Ajoutez des mesures pour voir l'évolution
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrowthWidget;
