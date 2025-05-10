
import React from 'react';
import { format, parseISO, differenceInMonths, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Baby } from "lucide-react";

interface BabyAgeDisplayProps {
  babyAgeMonths: number;
  birthDate?: string;
}

const BabyAgeDisplay: React.FC<BabyAgeDisplayProps> = ({ babyAgeMonths, birthDate }) => {
  // Calculer l'âge précis
  const getDetailedAge = (): string => {
    if (!birthDate) return `${babyAgeMonths} mois`;
    
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    
    const monthsDiff = differenceInMonths(today, birthDateObj);
    
    // Si moins d'un mois, afficher en jours
    if (monthsDiff === 0) {
      const daysDiff = differenceInDays(today, birthDateObj);
      return `${daysDiff} jour${daysDiff > 1 ? 's' : ''}`;
    }
    
    // Calculer les jours supplémentaires après les mois complets
    const monthsLater = new Date(birthDateObj);
    monthsLater.setMonth(birthDateObj.getMonth() + monthsDiff);
    const remainingDays = differenceInDays(today, monthsLater);
    
    if (remainingDays > 0) {
      return `${monthsDiff} mois et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`;
    }
    
    return `${monthsDiff} mois`;
  };

  return (
    <div className="mb-3 flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
      <Baby className="h-5 w-5 text-babybaby-cosmic" />
      {birthDate ? (
        <div>
          <p className="text-sm font-medium">
            <span className="font-semibold">{getDetailedAge()}</span>
          </p>
          <p className="text-xs text-gray-500">
            Né(e) le {format(parseISO(birthDate), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>
      ) : (
        <p className="text-sm font-medium">Âge non disponible</p>
      )}
    </div>
  );
};

export default BabyAgeDisplay;
