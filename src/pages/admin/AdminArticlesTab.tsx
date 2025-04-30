
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, Upload, FileEdit, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { articles } from '@/data/articles';
import { Article } from '@/types/article';
import { supabase } from '@/integrations/supabase/client';

const AdminArticlesTab = () => {
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('nutrition');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const { toast } = useToast();

  // Load existing articles
  useEffect(() => {
    setArticlesList(articles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUploading(true);
    
    try {
      let coverImageUrl = '';
      
      // Upload cover image if provided
      if (coverImage) {
        const fileName = `${Date.now()}-${coverImage.name.replace(/\s+/g, '-')}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('articles')
          .upload(fileName, coverImage);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrl } = supabase
          .storage
          .from('articles')
          .getPublicUrl(fileName);
          
        coverImageUrl = publicUrl.publicUrl;
      }
      
      // Create new article
      const newArticle: Article = {
        id: articlesList.length + 1,
        title,
        summary,
        content,
        category,
        image: coverImageUrl || '/placeholder.svg',
        date: new Date().toISOString().split('T')[0],
        readingTime: Math.ceil(content.split(' ').length / 200), // Estimation basée sur le nombre de mots
        tags: [category],
        author: 'Admin'
      };
      
      // In a real implementation, we would save this to the database
      // For now, we'll just add it to the local state
      setArticlesList([...articlesList, newArticle]);
      
      // Reset form
      setTitle('');
      setSummary('');
      setContent('');
      setCategory('nutrition');
      setCoverImage(null);
      
      toast({
        title: 'Succès',
        description: 'L\'article a été ajouté avec succès',
      });
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création de l\'article',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouvel article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article"
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
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="amenagement">Aménagement</SelectItem>
                  <SelectItem value="sommeil">Sommeil</SelectItem>
                  <SelectItem value="developpement">Développement</SelectItem>
                  <SelectItem value="preparation">Préparation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="summary">Résumé</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Résumé de l'article"
                rows={2}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Contenu de l'article (supporte le format Markdown)"
                rows={10}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="coverImage">Image de couverture</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              />
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
                  Publier l'article
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Articles List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Liste des articles ({articlesList.length})</h3>
        
        <div className="space-y-4">
          {articlesList.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover aspect-video md:aspect-auto"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h4 className="font-semibold text-lg">{article.title}</h4>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                    <span>Catégorie: {article.category}</span>
                    <span>•</span>
                    <span>Date: {article.date}</span>
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-2">{article.summary}</p>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex items-center">
                      <FileEdit className="w-4 h-4 mr-1" /> Éditer
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" /> Voir
                    </Button>
                    <Button size="sm" variant="destructive" className="flex items-center">
                      <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminArticlesTab;
