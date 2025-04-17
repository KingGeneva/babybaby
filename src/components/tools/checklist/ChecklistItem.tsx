
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Square, Trash2 } from 'lucide-react';
import { ChecklistItem as ChecklistItemType } from './types';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showCategory?: boolean;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onToggle,
  onDelete,
  showCategory = false,
}) => (
  <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent group">
    <div className="flex items-center gap-2 flex-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => onToggle(item.id)}
      >
        {item.checked ? (
          <CheckSquare className="h-4 w-4 text-green-500" />
        ) : (
          <Square className="h-4 w-4" />
        )}
      </Button>
      <span className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
        {item.text}
      </span>
    </div>
    <div className="flex items-center gap-1">
      {showCategory && (
        <Badge variant="outline" className="h-6">
          {item.category}
        </Badge>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </Button>
    </div>
  </div>
);
