
import { Button } from '@/components/ui/button';
import { ListFilter, Square, CheckSquare } from 'lucide-react';
import { ViewMode } from './types';

interface ChecklistFiltersProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ChecklistFilters: React.FC<ChecklistFiltersProps> = ({
  viewMode,
  onViewModeChange,
}) => (
  <div className="flex gap-2 mb-4">
    <Button 
      variant={viewMode === 'all' ? "default" : "outline"}
      size="sm"
      onClick={() => onViewModeChange('all')}
      className="flex-1"
    >
      <ListFilter className="h-4 w-4 mr-1" /> Tous
    </Button>
    <Button 
      variant={viewMode === 'todo' ? "default" : "outline"}
      size="sm"
      onClick={() => onViewModeChange('todo')}
      className="flex-1"
    >
      <Square className="h-4 w-4 mr-1" /> À faire
    </Button>
    <Button 
      variant={viewMode === 'done' ? "default" : "outline"}
      size="sm"
      onClick={() => onViewModeChange('done')}
      className="flex-1"
    >
      <CheckSquare className="h-4 w-4 mr-1" /> Complété
    </Button>
  </div>
);
