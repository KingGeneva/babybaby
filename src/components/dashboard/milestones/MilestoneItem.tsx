
import React from 'react';
import { Milestone } from '@/types/milestone';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface MilestoneItemProps {
  milestone: Milestone;
  isCompleted: boolean;
  isPast: boolean;
  onToggleCompletion: (milestoneId: string) => void;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  isCompleted,
  isPast,
  onToggleCompletion
}) => {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${
        isCompleted 
          ? 'bg-green-50 border-green-200' 
          : isPast 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex-shrink-0 mt-1">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => onToggleCompletion(milestone.id)}
          className={isCompleted ? 'bg-green-500 border-green-500' : ''}
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-900">
            {milestone.title || milestone.name}
          </h3>
          <Badge variant={isCompleted ? "success" : isPast ? "secondary" : "outline"}>
            {isCompleted 
              ? 'Complété' 
              : `${milestone.expected_age_months} mois`}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{milestone.description || milestone.notes}</p>
      </div>
    </div>
  );
};

export default MilestoneItem;
