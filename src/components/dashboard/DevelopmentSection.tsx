
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MilestonesList from './MilestonesList';
import MedicalWidget from '@/components/medical/MedicalWidget';

interface DevelopmentSectionProps {
  childId: string;
}

const DevelopmentSection: React.FC<DevelopmentSectionProps> = ({ childId }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Étapes de développement</CardTitle>
          </CardHeader>
          <CardContent>
            <MilestonesList childId={childId} />
          </CardContent>
        </Card>
      </div>
      <div>
        <MedicalWidget childId={childId} />
      </div>
    </div>
  );
};

export default DevelopmentSection;
