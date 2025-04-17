
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

interface GrowthWidgetProps {
  title: string;
  data: any[];
  dataKey: string;
  className?: string;
  color?: string;
}

const GrowthWidget: React.FC<GrowthWidgetProps> = ({
  title,
  data,
  dataKey,
  className,
  color = "#33C3F0"
}) => {
  // Make sure we have valid data to prevent rendering errors
  const validData = Array.isArray(data) && data.length > 0;
  
  // Format data to ensure all values are numbers
  const formattedData = validData ? 
    data.map(item => ({
      ...item,
      [dataKey]: typeof item[dataKey] === 'number' ? item[dataKey] : 0
    })) : [];
  
  return (
    <motion.div
      className={cn("glass-card p-4 sm:p-6 shadow-md rounded-lg", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="h-48">
        {validData ? (
          <ChartContainer 
            config={{
              [dataKey]: {
                color: color
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,155,155,0.2)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#333' }} 
                  fontSize={10}
                  tickMargin={8}
                />
                <YAxis 
                  tick={{ fill: '#333' }} 
                  fontSize={10}
                  tickMargin={8}
                  domain={['auto', 'auto']}
                />
                <ChartTooltip 
                  content={({ active, payload }) => (
                    <ChartTooltipContent active={active} payload={payload} />
                  )}
                />
                <Line 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={color} 
                  strokeWidth={3}
                  dot={{ stroke: color, strokeWidth: 2, fill: 'white', r: 4 }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: 'white' }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GrowthWidget;
