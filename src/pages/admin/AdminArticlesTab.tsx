
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CalendarIcon, Loader2, Plus, Save, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Le titre doit contenir au moins 5 caractères' }),
  summary: z.string().min(20, { message: 'Le résumé doit contenir au moins 20 caractères' }),
  excerpt: z.string().min(30, { message: "L'extrait doit contenir au moins 30 caractères" }),
  content: z.string().min(100, { message: 'Le contenu doit contenir au moins 100 caractères' }),
  category: z.string().nonempty({ message: 'Veuillez sélectionner une catégorie' }),
  image: z.string().optional(),
  date: z.date(),
  readingTime: z.coerce.number().min(1).max(60),
  tags: z.string(),
  author: z.string().min(2, { message: "Le nom de l'auteur est requis" }),
});

type FormValues = z.infer<typeof formSchema>;

const AdminArticlesTab = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Formulaire pour ajouter ou modifier un article
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      summary: '',
      excerpt: '',
      content: '',
      category: '',
      image: '',
      date: new Date(),
      readingTime: 5,
      tags: '',
      author: '',
    },
  });

  // Soumettre le formulaire
  const onSubmit = async (values: FormValues) => {
    try {
      // Formatage des données
      const articleData = {
        id: Date.now(), // Simple ID basé sur le timestamp
        title: values.title,
        summary: values.summary,
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        image: values.image || '/placeholder.svg',
        date: format(values.date, 'dd MMMM yyyy', { locale: fr }),
        readingTime: values.readingTime,
        tags: values.tags.split(',').map(tag => tag.trim()),
        author: values.author,
      };

      // Convertir en JSON
      const articleJSON = JSON.stringify(articleData);
      
      // Enregistrer dans Supabase Storage
      const { error } = await supabase
        .storage
        .from('articles')
        .upload(`articles/${articleData.id}.json`, new Blob([articleJSON], {
          type: 'application/json',
        }), {
          upsert: true,
        });

      if (error) throw error;

      toast({
        title: 'Article enregistré',
        description: 'Votre article a été enregistré avec succès',
      });

      // Réinitialiser le formulaire
      form.reset();
      
      // Rafraîchir la liste
      fetchArticles();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Charger la liste des articles
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      // Lister les fichiers JSON dans le dossier articles
      const { data: files, error } = await supabase
        .storage
        .from('articles')
        .list('articles');
        
      if (error) throw error;
      
      const articlesList = [];
      
      // Pour chaque fichier, récupérer le contenu
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.name.endsWith('.json')) {
            const { data, error: downloadError } = await supabase
              .storage
              .from('articles')
              .download(`articles/${file.name}`);
              
            if (!downloadError && data) {
              const text = await data.text();
              const article = JSON.parse(text);
              articlesList.push(article);
            }
          }
        }
      }
      
      setArticles(articlesList);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les articles',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un article
  const deleteArticle = async (id: number) => {
    try {
      const { error } = await supabase
        .storage
        .from('articles')
        .remove([`articles/${id}.json`]);
        
      if (error) throw error;
      
      toast({
        title: 'Article supprimé',
        description: 'L\'article a été supprimé avec succès',
      });
      
      // Rafraîchir la liste
      fetchArticles();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Charger les articles au chargement du composant
  React.useEffect(() => {
    fetchArticles();
  }, []);

  // Gérer l'upload d'image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    
    try {
      // Générer un nom unique pour le fichier
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // Upload dans Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('articles')
        .upload(`images/${fileName}`, file);
        
      if (error) throw error;
      
      // Obtenir l'URL publique
      const { data: publicURL } = supabase
        .storage
        .from('articles')
        .getPublicUrl(`images/${fileName}`);
        
      if (publicURL) {
        // Mettre à jour le champ image du formulaire
        form.setValue('image', publicURL.publicUrl);
        toast({
          title: 'Image téléchargée',
          description: 'Votre image a été téléchargée avec succès',
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-6">Ajouter un nouvel article</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de l'article" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Nutrition">Nutrition</SelectItem>
                        <SelectItem value="Sommeil">Sommeil</SelectItem>
                        <SelectItem value="Développement">Développement</SelectItem>
                        <SelectItem value="Santé">Santé</SelectItem>
                        <SelectItem value="Éducation">Éducation</SelectItem>
                        <SelectItem value="Préparation">Préparation</SelectItem>
                        <SelectItem value="Aménagement">Aménagement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de publication</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                            >
                              {field.value ? (
                                format(field.value, "dd MMMM yyyy", { locale: fr })
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="readingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temps de lecture (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auteur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'auteur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Résumé</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Un bref résumé de l'article" 
                        className="resize-none" 
                        rows={2}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extrait</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Un extrait qui apparaîtra dans la liste des articles" 
                        className="resize-none" 
                        rows={2}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Contenu de l'article en Markdown" 
                        rows={10} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (séparés par des virgules)</FormLabel>
                    <FormControl>
                      <Input placeholder="nutrition, bébé, allaitement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image (URL)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="URL de l'image" {...field} />
                      </FormControl>
                      <div className="relative">
                        <Input 
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={isUploading}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Upload
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    {field.value && (
                      <div className="mt-2">
                        <img 
                          src={field.value} 
                          alt="Aperçu" 
                          className="h-20 object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer l'article
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-xl font-bold mb-6">Articles enregistrés</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Chargement...</span>
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {article.image && (
                      <div className="w-24 h-24">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{article.title}</h3>
                        <Button
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteArticle(article.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{article.summary}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500">Aucun article disponible</p>
            <p className="text-sm text-gray-400 mt-1">
              Commencez par ajouter un nouvel article
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticlesTab;
