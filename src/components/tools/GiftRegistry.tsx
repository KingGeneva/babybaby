import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Trash2, Share2, Plus } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface GiftItem {
  id: string;
  name: string;
  price?: number;
  url?: string;
  priority: 'high' | 'medium' | 'low';
  purchased: boolean;
  notes?: string;
  image?: string;
}

interface GiftRegistryProps {
  className?: string;
}

const GiftRegistry: React.FC<GiftRegistryProps> = ({ className }) => {
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [newGift, setNewGift] = useState<Partial<GiftItem>>({
    name: '',
    price: undefined,
    url: '',
    priority: 'medium',
    purchased: false,
    notes: '',
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [registryLink, setRegistryLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'needed' | 'purchased'>('all');
  
  useEffect(() => {
    const savedGifts = localStorage.getItem('babyGiftRegistry');
    if (savedGifts) {
      setGiftItems(JSON.parse(savedGifts));
    }
    
    const uniqueId = localStorage.getItem('giftRegistryId') || `reg_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('giftRegistryId', uniqueId);
    setRegistryLink(`${window.location.origin}/registry/${uniqueId}`);
  }, []);
  
  useEffect(() => {
    if (giftItems.length > 0) {
      localStorage.setItem('babyGiftRegistry', JSON.stringify(giftItems));
    }
  }, [giftItems]);
  
  const handleAddGift = () => {
    if (!newGift.name) {
      toast({
        title: "Erreur de saisie",
        description: "Veuillez entrer un nom pour le cadeau",
        variant: "destructive"
      });
      return;
    }
    
    const id = Date.now().toString();
    const giftToAdd: GiftItem = {
      id,
      name: newGift.name || '',
      price: newGift.price,
      url: newGift.url,
      priority: newGift.priority as 'high' | 'medium' | 'low' || 'medium',
      purchased: false,
      notes: newGift.notes,
    };
    
    setGiftItems([...giftItems, giftToAdd]);
    setNewGift({
      name: '',
      price: undefined,
      url: '',
      priority: 'medium',
      purchased: false,
      notes: '',
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Cadeau ajouté",
      description: `${giftToAdd.name} a été ajouté à votre liste`
    });
  };
  
  const handleRemoveGift = (id: string) => {
    setGiftItems(giftItems.filter(item => item.id !== id));
    
    toast({
      title: "Cadeau supprimé",
      description: "Le cadeau a été retiré de votre liste"
    });
  };
  
  const handleTogglePurchased = (id: string) => {
    setGiftItems(giftItems.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };
  
  const copyRegistryLink = () => {
    navigator.clipboard.writeText(registryLink);
    setLinkCopied(true);
    
    toast({
      title: "Lien copié",
      description: "Le lien de votre liste a été copié dans le presse-papier"
    });
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };
  
  const filteredGifts = giftItems.filter(gift => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'needed') return !gift.purchased;
    if (activeFilter === 'purchased') return gift.purchased;
    return true;
  });
  
  const purchasedCount = giftItems.filter(gift => gift.purchased).length;
  const progressPercent = giftItems.length > 0 
    ? Math.round((purchasedCount / giftItems.length) * 100)
    : 0;
    
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Registre de Cadeaux
        </CardTitle>
        <CardDescription>
          Créez et partagez votre liste de souhaits pour l'arrivée de bébé
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progression: {progressPercent}%</span>
            <span className="text-sm text-muted-foreground">{purchasedCount}/{giftItems.length} reçus</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={activeFilter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            Tous
          </Button>
          <Button 
            variant={activeFilter === 'needed' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('needed')}
          >
            À recevoir
          </Button>
          <Button 
            variant={activeFilter === 'purchased' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('purchased')}
          >
            Reçus
          </Button>
        </div>
        
        <div className="space-y-3">
          {filteredGifts.length > 0 ? (
            filteredGifts.map((gift) => (
              <div 
                key={gift.id} 
                className={`border rounded-lg p-3 ${gift.purchased ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${gift.purchased ? 'line-through text-muted-foreground' : ''}`}>
                        {gift.name}
                      </span>
                      {gift.priority === 'high' && (
                        <Badge variant="default" className="bg-red-500">Priorité</Badge>
                      )}
                    </div>
                    {gift.price && <div className="text-sm">{gift.price} €</div>}
                    {gift.notes && <div className="text-xs text-muted-foreground">{gift.notes}</div>}
                    {gift.url && (
                      <a 
                        href={gift.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                      >
                        Voir le produit
                      </a>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleTogglePurchased(gift.id)}
                    >
                      <Check className={`h-4 w-4 ${gift.purchased ? 'text-green-500' : 'text-gray-400'}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveGift(gift.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="mx-auto h-12 w-12 mb-2 opacity-30" />
              <p className="mb-4">Votre liste est vide</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un cadeau
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un cadeau</DialogTitle>
                <DialogDescription>
                  Complétez les informations pour ajouter un cadeau à votre liste
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="gift-name">Nom du cadeau*</Label>
                  <Input
                    id="gift-name"
                    value={newGift.name || ''}
                    onChange={(e) => setNewGift({...newGift, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gift-price">Prix (€) - Optionnel</Label>
                  <Input
                    id="gift-price"
                    type="number"
                    value={newGift.price || ''}
                    onChange={(e) => setNewGift({...newGift, price: Number(e.target.value) || undefined})}
                  />
                </div>
                <div>
                  <Label htmlFor="gift-url">Lien URL - Optionnel</Label>
                  <Input
                    id="gift-url"
                    type="url"
                    placeholder="https://..."
                    value={newGift.url || ''}
                    onChange={(e) => setNewGift({...newGift, url: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gift-priority">Priorité</Label>
                  <select 
                    id="gift-priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newGift.priority || 'medium'}
                    onChange={(e) => setNewGift({...newGift, priority: e.target.value as 'high' | 'medium' | 'low'})}
                  >
                    <option value="high">Élevée</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Faible</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="gift-notes">Notes - Optionnel</Label>
                  <Textarea
                    id="gift-notes"
                    placeholder="Taille, couleur, etc."
                    value={newGift.notes || ''}
                    onChange={(e) => setNewGift({...newGift, notes: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddGift}>
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="w-full" onClick={copyRegistryLink}>
            {linkCopied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Lien copié!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Partager la liste
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GiftRegistry;
