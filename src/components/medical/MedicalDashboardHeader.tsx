
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Baby } from 'lucide-react';
import { calculateAge } from '@/utils/ageUtils';

interface MedicalDashboardHeaderProps {
  childId: string;
  childName?: string;
  birthDate?: string;
}

const MedicalDashboardHeader: React.FC<MedicalDashboardHeaderProps> = ({
  childId,
  childName,
  birthDate,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate(`/dashboard/${childId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">
          <span className="text-babybaby-cosmic">Suivi Médical</span>
          {childName ? ` - ${childName}` : ''}
        </h1>
      </div>
      
      {birthDate && (
        <div className="flex items-center">
          <Baby className="h-5 w-5 mr-2 text-babybaby-cosmic" />
          <span>{calculateAge(birthDate)}</span>
        </div>
      )}
    </div>
  );
};

export default MedicalDashboardHeader;
