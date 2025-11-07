import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Check, X, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Markdown from 'react-markdown';

interface AutoArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  excerpt: string;
  category: string;
  tags: string[];
  reading_time: number;
  source_trend: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  created_at: string;
  author: string;
  image_url?: string;
}

export default function AdminAutoArticlesTab() {
  const [articles, setArticles] = useState<AutoArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<AutoArticle | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('auto_generated_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles((data as AutoArticle[]) || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateArticle = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-article');

      if (error) throw error;

      toast({
        title: "Article généré",
        description: "Un nouvel article a été créé et attend votre validation",
      });

      fetchArticles();
    } catch (error) {
      console.error('Error generating article:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'article",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const updateArticleStatus = async (articleId: string, status: 'approved' | 'rejected') => {
    try {
      const article = articles.find(a => a.id === articleId);
      
      const { error } = await supabase
        .from('auto_generated_articles')
        .update({ 
          status,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', articleId);

      if (error) throw error;

      // If approved, generate image automatically
      if (status === 'approved' && article) {
        toast({
          title: "Article approuvé",
          description: "Génération de l'image en cours...",
        });

        try {
          const { error: imageError } = await supabase.functions.invoke('generate-article-image', {
            body: {
              articleId: article.id,
              title: article.title,
              excerpt: article.excerpt
            }
          });

          if (imageError) {
            console.error('Image generation error:', imageError);
            toast({
              title: "Image non générée",
              description: "L'article est approuvé mais l'image n'a pas pu être générée",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Image générée",
              description: "L'article est prêt à être publié avec son image",
            });
          }
        } catch (imgErr) {
          console.error('Image generation failed:', imgErr);
        }
      } else if (status === 'rejected') {
        toast({
          title: "Article rejeté",
          description: "L'article a été rejeté",
        });
      }

      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'article",
        variant: "destructive",
      });
    }
  };

  const publishArticle = async (article: AutoArticle) => {
    try {
      // Prepare article data for storage in the correct format
      const articleData = {
        id: Date.now(),
        title: article.title,
        content: article.content,
        summary: article.summary,
        excerpt: article.excerpt,
        category: article.category,
        image: article.image_url || '/lovable-uploads/gentle-parenting.jpg',
        date: new Date().toLocaleDateString('fr-FR', { 
          day: 'numeric',
          month: 'long', 
          year: 'numeric' 
        }),
        readingTime: article.reading_time,
        tags: article.tags,
        author: article.author,
        featured: false,
        views: 0,
      };

      // Upload to storage in the articles folder
      const blob = new Blob([JSON.stringify(articleData, null, 2)], { 
        type: 'application/json' 
      });
      
      const fileName = `articles/${articleData.id}.json`;
      const { error: uploadError } = await supabase.storage
        .from('articles')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Update status to published
      const { error: updateError } = await supabase
        .from('auto_generated_articles')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', article.id);

      if (updateError) {
        console.error('Status update error:', updateError);
        throw updateError;
      }

      toast({
        title: "Article publié",
        description: "L'article est maintenant visible sur le site",
      });

      // Invalidate article cache to show new article
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cached-articles');
        localStorage.removeItem('cached-articles-timestamp');
      }

      fetchArticles();
    } catch (error) {
      console.error('Error publishing article:', error);
      toast({
        title: "Erreur",
        description: `Impossible de publier l'article: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const { error } = await supabase
        .from('auto_generated_articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé définitivement",
      });

      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string, label: string }> = {
      pending: { color: 'bg-yellow-500', label: 'En attente' },
      approved: { color: 'bg-green-500', label: 'Approuvé' },
      rejected: { color: 'bg-red-500', label: 'Rejeté' },
      published: { color: 'bg-blue-500', label: 'Publié' },
    };
    
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Génération Automatique d'Articles</CardTitle>
          <CardDescription>
            Le système analyse les tendances en parentalité et génère automatiquement des articles pour validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={generateArticle} 
            disabled={generating}
            className="w-full sm:w-auto"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer un nouvel article
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Articles générés ({articles.length})
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucun article généré pour le moment
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 items-center">
                        {getStatusBadge(article.status)}
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {article.reading_time} min de lecture
                        </span>
                      </div>
                      {article.source_trend && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Tendance:</strong> {article.source_trend}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{article.summary}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewArticle(article)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Prévisualiser
                    </Button>

                    {article.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => updateArticleStatus(article.id, 'approved')}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approuver
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateArticleStatus(article.id, 'rejected')}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rejeter
                        </Button>
                      </>
                    )}

                    {article.status === 'approved' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => publishArticle(article)}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Publier
                      </Button>
                    )}

                    {(article.status === 'rejected' || article.status === 'published') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteArticle(article.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!previewArticle} onOpenChange={() => setPreviewArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewArticle?.title}</DialogTitle>
            <DialogDescription>
              {previewArticle?.summary}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <article className="prose prose-sm max-w-none">
              <Markdown>{previewArticle?.content}</Markdown>
            </article>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
