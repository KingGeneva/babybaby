import React, { useState, useEffect, useMemo } from 'react';
import { FolderTree, Undo2, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ProgressBar } from './checklist/ProgressBar';
import { ChecklistFilters } from './checklist/ChecklistFilters';
import { AddItemForm } from './checklist/AddItemForm';
import { CategoryList } from './checklist/CategoryList';
import { ChecklistItem as ChecklistItemComponent } from './checklist/ChecklistItem';
import { categories, defaultItems } from './checklist/data';
import type { ChecklistItem, ViewMode } from './checklist/types';

interface BabyChecklistProps {
  className?: string;
}

const BabyChecklist: React.FC<BabyChecklistProps> = ({ className }) => {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<string>(categories[0]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [accordionExpandedValues, setAccordionExpandedValues] = useState<string[]>(categories);

  useEffect(() => {
    const savedItems = localStorage.getItem('babyChecklist');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('babyChecklist', JSON.stringify(items));
  }, [items]);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, ChecklistItem[]> = {};
    categories.forEach(category => {
      grouped[category] = [];
    });
    items.forEach(item => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      } else {
        if (!grouped['Autre']) grouped['Autre'] = [];
        grouped['Autre'].push(item);
      }
    });
    return grouped;
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (activeCategory) {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    if (viewMode === 'todo') {
      filtered = filtered.filter(item => !item.checked);
    } else if (viewMode === 'done') {
      filtered = filtered.filter(item => item.checked);
    }
    return filtered;
  }, [items, activeCategory, viewMode]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number, completed: number }> = {};
    categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category);
      stats[category] = {
        total: categoryItems.length,
        completed: categoryItems.filter(item => item.checked).length
      };
    });
    return stats;
  }, [items]);

  const handleAddItem = () => {
    if (!newItemText.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un texte pour l'élément",
        variant: "destructive"
      });
      return;
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      checked: false,
      category: newItemCategory || 'Autre'
    };

    setItems([...items, newItem]);
    setNewItemText('');

    toast({
      title: "Élément ajouté",
      description: `"${newItem.text}" ajouté à la catégorie ${newItem.category}`
    });
  };

  const handleToggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Élément supprimé",
      description: "L'élément a été retiré de la liste"
    });
  };

  const resetChecklist = () => {
    setItems(defaultItems);
    toast({
      title: "Liste réinitialisée",
      description: "La liste a été réinitialisée avec les éléments par défaut"
    });
  };

  const toggleAccordion = (category: string) => {
    setAccordionExpandedValues(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleAllAccordions = (expand: boolean) => {
    setAccordionExpandedValues(expand ? [...categories] : []);
  };

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            Checklist de Préparation
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {checkedItems}/{totalItems} complétés
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ProgressBar progress={progress} />

        <Tabs defaultValue="categories" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <TabsList className="h-auto p-1">
              <TabsTrigger value="categories" className="text-sm px-2 py-1">Par catégorie</TabsTrigger>
              <TabsTrigger value="list" className="text-sm px-2 py-1">Liste</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-1 justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-sm" 
                onClick={() => toggleAllAccordions(true)}
              >
                <FolderTree className="h-3.5 w-3.5 mr-1" /> Tout
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-sm" 
                onClick={() => toggleAllAccordions(false)}
              >
                <FolderTree className="h-3.5 w-3.5 mr-1" /> Fermer
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <ChecklistFilters viewMode={viewMode} onViewModeChange={setViewMode} />
            
            <div className="min-h-[300px] max-h-[450px] overflow-y-auto pr-2">
              <TabsContent value="categories" className="mt-0">
                <CategoryList
                  categories={categories}
                  itemsByCategory={itemsByCategory}
                  categoryStats={categoryStats}
                  viewMode={viewMode}
                  accordionExpandedValues={accordionExpandedValues}
                  onToggleAccordion={toggleAccordion}
                  onToggleItem={handleToggleItem}
                  onDeleteItem={handleDeleteItem}
                />
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <div className="space-y-1">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <ChecklistItemComponent
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onDelete={handleDeleteItem}
                        showCategory={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="mx-auto h-12 w-12 mb-2 opacity-30" />
                      <p>Aucun élément trouvé</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
        
        <AddItemForm
          newItemText={newItemText}
          newItemCategory={newItemCategory}
          onNewItemTextChange={setNewItemText}
          onNewItemCategoryChange={setNewItemCategory}
          onAddItem={handleAddItem}
        />
        
        <div className="flex justify-end pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetChecklist}
            className="flex items-center gap-1"
          >
            <Undo2 className="h-3 w-3" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BabyChecklist;
