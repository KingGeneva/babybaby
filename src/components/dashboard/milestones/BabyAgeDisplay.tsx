
import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Baby } from "lucide-react";

interface BabyAgeDisplayProps {
  babyAgeMonths: number;
  birthDate?: string;
}

const BabyAgeDisplay: React.FC<BabyAgeDisplayProps> = ({ babyAgeMonths, birthDate }) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Baby className="h-5 w-5 text-babybaby-cosmic" />
      {birthDate ? (
        <p className="text-sm font-medium">
          <span className="font-semibold">{babyAgeMonths}</span> mois ({format(parseISO(birthDate), 'dd/MM/yyyy', { locale: fr })})
        </p>
      ) : (
        <p className="text-sm font-medium">Âge non disponible</p>
      )}
    </div>
  );
};

export default BabyAgeDisplay;
