
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import ForumEditor from '@/components/forum/ForumEditor';
import { createTopic } from '@/components/forum/forumService';
import { ForumCategory } from '@/components/forum/types';
import { getAllCategories } from '@/components/forum/services/categoryService';
import { useAuth } from '@/contexts/AuthContext';
import AuthNotice from '@/components/forum/components/AuthNotice';

const NewTopicPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !categoryId || !user) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Convert categoryId to number for the API
      const categoryIdNumber = parseInt(categoryId, 10);
      
      const newTopic = await createTopic(
        title, 
        content, 
        categoryIdNumber, 
        user.id
      );
      
      if (newTopic) {
        toast({
          title: "Sujet créé",
          description: "Votre sujet a été créé avec succès",
        });
        
        // Naviguer vers le nouveau sujet
        navigate(`/forum/topics/${newTopic.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création du sujet:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer votre sujet. Veuillez réessayer.",
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
          <AuthNotice />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6 text-center text-babybaby-cosmic">
              Créer un nouveau sujet
            </h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Nouveau sujet</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1"
                      placeholder="Titre de votre sujet"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select onValueChange={handleCategoryChange} value={categoryId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="content">Contenu</Label>
                    <div className="mt-1">
                      <ForumEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Détaillez votre question ou sujet..."
                        minHeight="300px"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                      disabled={submitting || !title || !content || !categoryId}
                    >
                      {submitting ? 'Création...' : 'Créer le sujet'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewTopicPage;
