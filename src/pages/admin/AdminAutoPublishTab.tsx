import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { invalidateAllArticleCaches } from "@/data/articles/index";

export default function AdminAutoPublishTab() {
  const [generating, setGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<{ articleId: number; title: string; trend: string; slug?: string } | null>(null);
  const { toast } = useToast();

  const triggerAutoPublish = async () => {
    setGenerating(true);
    setLastResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Non authentifié", variant: "destructive" });
        return;
      }
      const { data, error } = await supabase.functions.invoke("auto-publish-article", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Échec inconnu");

      setLastResult({ articleId: data.articleId, title: data.title, trend: data.trend, slug: data.slug });
      invalidateAllArticleCaches();
      toast({
        title: "Article publié",
        description: `"${data.title}" est en ligne.`,
      });
    } catch (e) {
      toast({
        title: "Erreur",
        description: e instanceof Error ? e.message : "Impossible de générer l'article",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Publication automatique IA</CardTitle>
          <CardDescription>
            Le système identifie une tendance parentalité, rédige l'article complet, génère
            l'image de couverture et le publie immédiatement sur le site. Un cron quotidien
            publie un article par jour automatiquement — utilise le bouton ci-dessous pour
            déclencher manuellement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={triggerAutoPublish} disabled={generating} size="lg">
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération &amp; publication en cours…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer et publier maintenant
              </>
            )}
          </Button>

          {lastResult && (
            <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
              <p className="font-semibold">{lastResult.title}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Tendance :</span> {lastResult.trend}
              </p>
              <a
                href={lastResult.slug ? `/articles/${lastResult.slug}-${lastResult.articleId}` : `/articles/${lastResult.articleId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Voir l'article publié <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
