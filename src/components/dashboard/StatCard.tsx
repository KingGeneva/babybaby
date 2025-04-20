
import React from 'react';
import { Baby, Ruler, Weight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: 'baby' | 'ruler' | 'weight' | string;
  trend?: 'up' | 'down' | 'stable';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'baby':
        return <Baby className="h-6 w-6 text-babybaby-cosmic" />;
      case 'ruler':
        return <Ruler className="h-6 w-6 text-babybaby-cosmic" />;
      case 'weight':
        return <Weight className="h-6 w-6 text-babybaby-cosmic" />;
      default:
        return <Baby className="h-6 w-6 text-babybaby-cosmic" />;
    }
  };

  const renderTrendIcon = () => {
    if (!trend) return null;

    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-babybaby-lightblue p-2 rounded-full">
            {renderIcon()}
          </div>
          {renderTrendIcon()}
        </div>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-gray-500">{title}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;
