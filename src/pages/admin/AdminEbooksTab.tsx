
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Upload, FileEdit, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ebooksData } from '@/components/ebooks/ebooksData';
import { Ebook } from '@/components/ebooks/types';
import { uploadEbook, downloadEbook } from '@/components/ebooks/ebookService';

const AdminEbooksTab = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Nutrition');
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const { toast } = useToast();

  // Load existing ebooks
  useEffect(() => {
    setEbooks(ebooksData);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ebookFile) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const newEbook = await uploadEbook(ebookFile, {
        title,
        description,
        category,
        coverImage: coverImage || undefined
      });
      
      if (newEbook) {
        setEbooks([...ebooks, newEbook]);
        
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('Nutrition');
        setEbookFile(null);
        setCoverImage(null);
        
        toast({
          title: 'Succès',
          description: 'L\'ebook a été ajouté avec succès',
        });
      } else {
        throw new Error('Échec de l\'upload');
      }
    } catch (error) {
      console.error('Error uploading ebook:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'upload',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour gérer le téléchargement d'un ebook existant
  const handleDownloadEbook = async (ebook: Ebook) => {
    try {
      await downloadEbook(ebook);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger l\'ebook',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouvel e-book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'e-book"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nutrition">Nutrition</SelectItem>
                  <SelectItem value="Sommeil">Sommeil</SelectItem>
                  <SelectItem value="Développement">Développement</SelectItem>
                  <SelectItem value="Préparation">Préparation</SelectItem>
                  <SelectItem value="Santé">Santé</SelectItem>
                  <SelectItem value="Éveil">Éveil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de l'e-book"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ebookFile">Fichier e-book (PDF, EPUB)</Label>
                <Input
                  id="ebookFile"
                  type="file"
                  accept=".pdf,.epub"
                  onChange={(e) => setEbookFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="coverImage">Image de couverture (optionnelle)</Label>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> 
                  Téléversement...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> 
                  Ajouter l'e-book
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Ebooks List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Liste des e-books ({ebooks.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ebooks.map((ebook) => (
            <Card key={ebook.id}>
              <div className="aspect-[3/4] w-full">
                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{ebook.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm pb-2">
                <p className="text-gray-500 line-clamp-2">{ebook.description}</p>
                <p className="text-xs mt-1">Catégorie: {ebook.category}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex space-x-2 w-full">
                  <Button size="sm" variant="outline" className="flex-1">
                    <FileEdit className="w-4 h-4 mr-1" /> Éditer
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDownloadEbook(ebook)}
                  >
                    <Download className="w-4 h-4 mr-1" /> Télécharger
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-none">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEbooksTab;
