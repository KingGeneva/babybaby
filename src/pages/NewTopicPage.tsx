
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ForumCategory } from '@/components/forum/types';
import { createTopic, getCategoryBySlug, getCategories } from '@/components/forum/forumService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import ForumEditor from '@/components/forum/ForumEditor';

const NewTopicPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || '');
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Charger toutes les catégories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Si un ID de catégorie est fourni, vérifier qu'il existe
        if (categoryId) {
          const category = categoriesData.find(c => c.id === categoryId);
          if (!category) {
            // Si la catégorie n'existe pas par ID, utiliser la première catégorie
            setSelectedCategoryId(categoriesData.length > 0 ? categoriesData[0].id : '');
          }
        } else {
          // Si aucun ID n'est fourni, utiliser la première catégorie
          setSelectedCategoryId(categoriesData.length > 0 ? categoriesData[0].id : '');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        setLoading(false);
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !selectedCategoryId || !user) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      const newTopic = await createTopic(title, content, selectedCategoryId);
      
      if (newTopic) {
        toast({
          title: "Sujet créé",
          description: "Votre sujet a été créé avec succès",
        });
        navigate(`/forum/topics/${newTopic.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création du sujet:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le sujet. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 text-babybaby-cosmic">Forum des Parents</h1>
            <p className="text-lg mb-8">Connectez-vous pour accéder au forum et partager avec d'autres parents.</p>
            <Button onClick={() => navigate('/auth')} size="lg">
              Se connecter
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-normal p-0"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={16} className="mr-1" />
              Retour
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-babybaby-cosmic">
                Nouvelle discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select 
                        value={selectedCategoryId} 
                        onValueChange={setSelectedCategoryId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre de la discussion</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Entrez un titre pour votre discussion"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Contenu</Label>
                      <ForumEditor 
                        value={content}
                        onChange={setContent}
                        placeholder="Ecrivez votre message..."
                        minHeight="300px"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => navigate(-1)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                        disabled={!title.trim() || !content.trim() || !selectedCategoryId || submitting}
                      >
                        {submitting ? 'Publication...' : 'Publier'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewTopicPage;
