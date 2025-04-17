
import React, { useState, useEffect } from 'react';
import { Check, CheckSquare, Square, Plus, Save, Trash2, Undo2, CheckCircle2 } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

interface BabyChecklistProps {
  className?: string;
}

// Catégories prédéfinies
const categories = [
  'Chambre', 'Vêtements', 'Hygiène', 'Alimentation', 'Déplacements', 'Administratif', 'Autre'
];

// Liste d'items prédéfinis
const defaultItems: ChecklistItem[] = [
  // Chambre
  { id: '1', text: 'Lit bébé', checked: false, category: 'Chambre' },
  { id: '2', text: 'Matelas pour lit bébé', checked: false, category: 'Chambre' },
  { id: '3', text: 'Alèse imperméable', checked: false, category: 'Chambre' },
  { id: '4', text: 'Draps-housses (2-3)', checked: false, category: 'Chambre' },
  { id: '5', text: 'Tour de lit', checked: false, category: 'Chambre' },
  { id: '6', text: 'Gigoteuses (2-3)', checked: false, category: 'Chambre' },
  { id: '7', text: 'Commode à langer', checked: false, category: 'Chambre' },
  { id: '8', text: 'Veilleuse', checked: false, category: 'Chambre' },
  { id: '9', text: 'Babyphone', checked: false, category: 'Chambre' },
  
  // Vêtements
  { id: '10', text: 'Bodies manches courtes (6-8)', checked: false, category: 'Vêtements' },
  { id: '11', text: 'Bodies manches longues (6-8)', checked: false, category: 'Vêtements' },
  { id: '12', text: 'Pyjamas (4-6)', checked: false, category: 'Vêtements' },
  { id: '13', text: 'Brassières (2-3)', checked: false, category: 'Vêtements' },
  { id: '14', text: 'Chaussettes (4-6 paires)', checked: false, category: 'Vêtements' },
  { id: '15', text: 'Bonnets (2)', checked: false, category: 'Vêtements' },
  { id: '16', text: 'Bavoirs (6-8)', checked: false, category: 'Vêtements' },
  
  // Hygiène
  { id: '17', text: 'Baignoire bébé', checked: false, category: 'Hygiène' },
  { id: '18', text: 'Transat de bain', checked: false, category: 'Hygiène' },
  { id: '19', text: 'Thermomètre pour bain', checked: false, category: 'Hygiène' },
  { id: '20', text: 'Serviettes de bain à capuche (2-3)', checked: false, category: 'Hygiène' },
  { id: '21', text: 'Couches nouveau-né', checked: false, category: 'Hygiène' },
  { id: '22', text: 'Lingettes ou coton', checked: false, category: 'Hygiène' },
  { id: '23', text: 'Liniment ou produit nettoyant', checked: false, category: 'Hygiène' },
  { id: '24', text: 'Crème pour le change', checked: false, category: 'Hygiène' },
  { id: '25', text: 'Thermomètre médical', checked: false, category: 'Hygiène' },
  { id: '26', text: 'Ciseaux à ongles pour bébé', checked: false, category: 'Hygiène' },
  
  // Alimentation
  { id: '27', text: 'Biberons (4-6)', checked: false, category: 'Alimentation' },
  { id: '28', text: 'Tétines de rechange', checked: false, category: 'Alimentation' },
  { id: '29', text: 'Goupillon pour biberons', checked: false, category: 'Alimentation' },
  { id: '30', text: 'Chauffe-biberon', checked: false, category: 'Alimentation' },
  { id: '31', text: 'Stérilisateur', checked: false, category: 'Alimentation' },
  { id: '32', text: 'Lait infantile', checked: false, category: 'Alimentation' },
  { id: '33', text: 'Coussin d\'allaitement', checked: false, category: 'Alimentation' },
  
  // Déplacements
  { id: '34', text: 'Poussette', checked: false, category: 'Déplacements' },
  { id: '35', text: 'Siège auto', checked: false, category: 'Déplacements' },
  { id: '36', text: 'Porte-bébé ou écharpe de portage', checked: false, category: 'Déplacements' },
  { id: '37', text: 'Sac à langer', checked: false, category: 'Déplacements' },
  { id: '38', text: 'Couverture de voyage', checked: false, category: 'Déplacements' },
  
  // Administratif
  { id: '39', text: 'Déclarer la naissance (3 jours)', checked: false, category: 'Administratif' },
  { id: '40', text: 'Inscrire bébé à la sécurité sociale', checked: false, category: 'Administratif' },
  { id: '41', text: 'Demander la prime de naissance', checked: false, category: 'Administratif' },
  { id: '42', text: 'Demander les allocations familiales', checked: false, category: 'Administratif' },
  { id: '43', text: 'Trouver un pédiatre', checked: false, category: 'Administratif' },
  { id: '44', text: 'Déclarer bébé aux impôts', checked: false, category: 'Administratif' },
];

const BabyChecklist: React.FC<BabyChecklistProps> = ({ className }) => {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<string>(categories[0]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Charger les items sauvegardés depuis le localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('babyChecklist');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);
  
  // Sauvegarder les items dans le localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem('babyChecklist', JSON.stringify(items));
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
  
  // Filtrer les items par catégorie active
  const filteredItems = activeCategory
    ? items.filter(item => item.category === activeCategory)
    : items;
    
  // Calcul des statistiques
  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  
  // Obtenir les catégories uniques présentes dans les items
  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          Checklist de Préparation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progression */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm font-medium">{progress}% complété</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-right">
            {checkedItems}/{totalItems} éléments cochés
          </p>
        </div>
        
        {/* Filtres par catégorie */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Filtrer par catégorie</label>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              Tout
            </Button>
            {uniqueCategories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Liste d'items */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent group"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleToggleItem(item.id)}
                  >
                    {item.checked ? (
                      <CheckSquare className="h-5 w-5 text-green-500" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </Button>
                  <span className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                    {item.text}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="mr-2">
                    {item.category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="mx-auto h-12 w-12 mb-2 opacity-30" />
              {activeCategory ? (
                <p>Aucun élément dans la catégorie {activeCategory}</p>
              ) : (
                <p>Votre liste est vide</p>
              )}
            </div>
          )}
        </div>
        
        {/* Ajout d'item */}
        <div className="space-y-3 pt-2 border-t">
          <h3 className="font-medium text-sm pt-2">Ajouter un élément</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Nouvel élément..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="px-3 py-1 rounded-md border border-input bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Actions */}
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
