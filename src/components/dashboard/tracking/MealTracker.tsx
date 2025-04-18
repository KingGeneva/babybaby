
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Baby, Calendar, MoreVertical } from 'lucide-react';

interface Meal {
  type: string;
  time: string;
  quantity: string;
}

const MealTracker = () => {
  const meals: Meal[] = [
    { type: 'Biberon', time: '8:30', quantity: '150ml' },
    { type: 'Purée de carottes', time: '12:15', quantity: '100g' },
    { type: 'Biberon', time: '16:45', quantity: '120ml' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-babybaby-cosmic" />
            Suivi des repas
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-pink-400 text-sm bg-pink-50 px-3 py-1 rounded-full">
              Aujourd'hui
            </span>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Baby className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">{meal.type}</p>
                  <p className="text-sm text-gray-500">{meal.time} - {meal.quantity}</p>
                </div>
              </div>
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealTracker;
