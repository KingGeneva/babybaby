
import { Bookmark } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChecklistItem as ChecklistItemComponent } from './ChecklistItem';
import type { ChecklistItem, CategoryStats, ViewMode } from './types';

interface CategoryListProps {
  categories: string[];
  itemsByCategory: Record<string, ChecklistItem[]>;
  categoryStats: Record<string, CategoryStats>;
  viewMode: ViewMode;
  accordionExpandedValues: string[];
  onToggleAccordion: (category: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  itemsByCategory,
  categoryStats,
  viewMode,
  accordionExpandedValues,
  onToggleAccordion,
  onToggleItem,
  onDeleteItem,
}) => (
  <div className="max-h-[450px] overflow-y-auto pr-2">
    <Accordion type="multiple" value={accordionExpandedValues}>
      {categories.map((category) => (
        <AccordionItem key={category} value={category}>
          <AccordionTrigger 
            onClick={(e) => {
              e.preventDefault();
              onToggleAccordion(category);
            }} 
            className="py-2"
          >
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center">
                <Bookmark className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{category}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">
                  {categoryStats[category]?.completed || 0}/{categoryStats[category]?.total || 0}
                </span>
                <div className="w-16 h-1.5 bg-gray-100 rounded-full ml-2">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ 
                      width: categoryStats[category]?.total 
                        ? `${(categoryStats[category].completed / categoryStats[category].total) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          
          <AccordionContent>
            {itemsByCategory[category]?.length > 0 ? (
              <div className="space-y-1 pl-2">
                {itemsByCategory[category]
                  .filter(item => {
                    if (viewMode === 'todo') return !item.checked;
                    if (viewMode === 'done') return item.checked;
                    return true;
                  })
                  .map(item => (
                    <ChecklistItemComponent
                      key={item.id}
                      item={item}
                      onToggle={onToggleItem}
                      onDelete={onDeleteItem}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-3 text-muted-foreground">
                <p className="text-sm">Aucun élément dans cette catégorie</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);
