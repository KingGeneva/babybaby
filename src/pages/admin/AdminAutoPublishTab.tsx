import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, ExternalLink, Send, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { invalidateAllArticleCaches, getArticlesByCategory } from "@/data/articles/index";
import { pingIndexNow, articleUrlForIndexNow, SITE_ORIGIN } from "@/lib/indexnow";
import { articleUrl } from "@/lib/articleUrl";

export default function AdminAutoPublishTab() {
  const [generating, setGenerating] = useState(false);
  const [pingingAll, setPingingAll] = useState(false);
  const [rebuildingIndex, setRebuildingIndex] = useState(false);
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

      // Notify IndexNow (fire-and-forget)
      void pingIndexNow([articleUrlForIndexNow(data.articleId, data.slug)]);

      toast({
        title: "Article publié",
        description: `"${data.title}" est en ligne. IndexNow notifié.`,
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

  const submitAllToIndexNow = async () => {
    setPingingAll(true);
    try {
      const res = await fetch("/sitemap.xml", { cache: "no-store" });
      if (!res.ok) throw new Error(`sitemap.xml inaccessible (${res.status})`);
      const xml = await res.text();
      const urls = Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi))
        .map((m) => m[1].trim())
        .filter((u) => u.length > 0);

      if (urls.length === 0) {
        toast({ title: "Aucune URL trouvée", description: "Le sitemap est vide.", variant: "destructive" });
        return;
      }

      const { data, error } = await supabase.functions.invoke("indexnow-ping", { body: { urls } });
      if (error) throw error;

      toast({
        title: "Soumission IndexNow",
        description: `${data?.submitted ?? urls.length} URL(s) soumises (statut ${data?.upstreamStatus ?? "—"}).`,
      });
    } catch (e) {
      toast({
        title: "Erreur IndexNow",
        description: e instanceof Error ? e.message : "Soumission impossible",
        variant: "destructive",
      });
    } finally {
      setPingingAll(false);
    }
  };
  const rebuildCatalogIndex = async () => {
    setRebuildingIndex(true);
    try {
      const all = await getArticlesByCategory("Tous");
      const entries = all.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        path: articleUrl(a),
        keyword: (a as { seo_keyword?: string }).seo_keyword,
      }));
      const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
      const { error } = await supabase.storage
        .from("articles")
        .upload("articles/_index.json", blob, { upsert: true, cacheControl: "3600" });
      if (error) throw error;
      toast({
        title: "Index reconstruit",
        description: `${entries.length} article(s) indexé(s) pour le maillage interne.`,
      });
    } catch (e) {
      toast({
        title: "Erreur",
        description: e instanceof Error ? e.message : "Reconstruction impossible",
        variant: "destructive",
      });
    } finally {
      setRebuildingIndex(false);
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
            déclencher manuellement. Chaque publication notifie automatiquement Bing/Yandex
            via IndexNow.
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

      <Card>
        <CardHeader>
          <CardTitle>IndexNow — soumission groupée</CardTitle>
          <CardDescription>
            Lit toutes les URLs de <code>{SITE_ORIGIN}/sitemap.xml</code> et les soumet à
            IndexNow (Bing, Yandex, etc.) pour forcer leur ré-exploration immédiate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={submitAllToIndexNow} disabled={pingingAll} variant="outline">
            {pingingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Soumission en cours…
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Soumettre toutes les URLs à IndexNow
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
