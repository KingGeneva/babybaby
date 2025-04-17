
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Baby, RefreshCw, Filter, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

// Liste de prénoms français populaires
const girlNames = [
  'Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Lina', 'Léa', 'Rose',
  'Anna', 'Mila', 'Inès', 'Ambre', 'Julia', 'Léna', 'Manon', 'Zoé',
  'Juliette', 'Lucie', 'Eva', 'Camille', 'Agathe', 'Sofia', 'Clara',
  'Lou', 'Sarah', 'Victoire', 'Nina', 'Romane', 'Élise', 'Charlie',
  'Adèle', 'Jeanne', 'Margot', 'Olivia', 'Éléna'
];

const boyNames = [
  'Gabriel', 'Léo', 'Raphaël', 'Louis', 'Lucas', 'Adam', 'Arthur',
  'Hugo', 'Jules', 'Maël', 'Ethan', 'Paul', 'Sacha', 'Nathan',
  'Gabin', 'Aaron', 'Noah', 'Tom', 'Noé', 'Théo', 'Léon', 'Victor',
  'Martin', 'Mathis', 'Samuel', 'Baptiste', 'Isaac', 'Valentin',
  'Maxime', 'Yanis', 'Eden', 'Antoine', 'Oscar', 'Axel', 'Augustin'
];

interface NameGeneratorProps {
  className?: string;
}

const NameGenerator: React.FC<NameGeneratorProps> = ({ className }) => {
  const [gender, setGender] = useState<'boy' | 'girl' | 'both'>('both');
  const [startsWith, setStartsWith] = useState('');
  const [length, setLength] = useState<'any' | 'short' | 'medium' | 'long'>('any');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const filterNames = (names: string[]) => {
    let filteredNames = [...names];
    
    // Filtrer par première lettre
    if (startsWith) {
      filteredNames = filteredNames.filter(name => 
        name.toLowerCase().startsWith(startsWith.toLowerCase())
      );
    }
    
    // Filtrer par longueur
    if (length !== 'any') {
      filteredNames = filteredNames.filter(name => {
        if (length === 'short') return name.length <= 4;
        if (length === 'medium') return name.length > 4 && name.length <= 6;
        if (length === 'long') return name.length > 6;
        return true;
      });
    }
    
    return filteredNames;
  };
  
  const generateNames = () => {
    let availableNames: string[] = [];
    
    if (gender === 'boy' || gender === 'both') {
      availableNames = [...availableNames, ...filterNames(boyNames)];
    }
    
    if (gender === 'girl' || gender === 'both') {
      availableNames = [...availableNames, ...filterNames(girlNames)];
    }
    
    if (availableNames.length === 0) {
      toast({
        title: "Aucun prénom trouvé",
        description: "Essayez de modifier vos critères de filtrage",
        variant: "destructive"
      });
      return;
    }
    
    // Mélanger la liste et prendre 5 noms aléatoires
    const shuffled = [...availableNames].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    setGeneratedNames(selected);
  };
  
  const toggleFavorite = (name: string) => {
    setFavorites(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name);
      } else {
        return [...prev, name];
      }
    });
  };
  
  return (
    <div className={className}>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-grow">
                <Select value={gender} onValueChange={(value: 'boy' | 'girl' | 'both') => setGender(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boy">Garçon</SelectItem>
                    <SelectItem value="girl">Fille</SelectItem>
                    <SelectItem value="both">Les deux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generateNames} 
                className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/80"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Générer
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {showAdvancedFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div>
                  <Label htmlFor="startsWith">Commence par</Label>
                  <Input 
                    id="startsWith"
                    value={startsWith} 
                    onChange={(e) => setStartsWith(e.target.value)}
                    placeholder="Première lettre..."
                    className="mt-1" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="length">Longueur du prénom</Label>
                  <Select 
                    value={length} 
                    onValueChange={(value: 'any' | 'short' | 'medium' | 'long') => setLength(value)}
                  >
                    <SelectTrigger id="length" className="mt-1">
                      <SelectValue placeholder="Longueur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">N'importe quelle longueur</SelectItem>
                      <SelectItem value="short">Court (4 lettres ou moins)</SelectItem>
                      <SelectItem value="medium">Moyen (5-6 lettres)</SelectItem>
                      <SelectItem value="long">Long (7 lettres ou plus)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="mt-6">
            {generatedNames.length > 0 ? (
              <div className="space-y-2">
                {generatedNames.map((name, index) => (
                  <motion.div 
                    key={name + index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                  >
                    <span className="text-lg">{name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleFavorite(name)}
                      className={favorites.includes(name) ? "text-red-500" : "text-gray-400"}
                    >
                      <Heart className="h-5 w-5" fill={favorites.includes(name) ? "currentColor" : "none"} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Baby className="mx-auto h-12 w-12 mb-2 opacity-30" />
                <p>Cliquez sur Générer pour obtenir des suggestions de prénoms</p>
              </div>
            )}
          </div>
          
          {favorites.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-4 border-t"
            >
              <h3 className="font-medium mb-2">Vos favoris</h3>
              <div className="flex flex-wrap gap-2">
                {favorites.map(name => (
                  <div 
                    key={`fav-${name}`}
                    className="px-3 py-1 rounded-full bg-babybaby-cosmic/10 text-sm flex items-center gap-1"
                  >
                    {name}
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => toggleFavorite(name)}
                    >
                      <Heart className="h-3 w-3 text-red-500" fill="currentColor" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NameGenerator;
