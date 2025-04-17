
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { categories } from './data';

interface AddItemFormProps {
  newItemText: string;
  newItemCategory: string;
  onNewItemTextChange: (text: string) => void;
  onNewItemCategoryChange: (category: string) => void;
  onAddItem: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  newItemText,
  newItemCategory,
  onNewItemTextChange,
  onNewItemCategoryChange,
  onAddItem,
}) => (
  <div className="space-y-3 pt-2 border-t">
    <h3 className="font-medium text-sm pt-2">Ajouter un élément</h3>
    <div className="flex gap-2">
      <Input
        placeholder="Nouvel élément..."
        value={newItemText}
        onChange={(e) => onNewItemTextChange(e.target.value)}
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onAddItem();
        }}
      />
      <select
        value={newItemCategory}
        onChange={(e) => onNewItemCategoryChange(e.target.value)}
        className="px-3 py-1 rounded-md border border-input bg-background"
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <Button onClick={onAddItem}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
