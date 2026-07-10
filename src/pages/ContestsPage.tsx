import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Mail, Share2, Trophy, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import ShareButtons from '@/components/common/ShareButtons';
import { supabase } from '@/integrations/supabase/client';

type FormData = { email: string };

interface EntryResult {
  referral_code: string;
  entries_count: number;
  alreadyRegistered?: boolean;
}

// Concours actif — mis à jour manuellement
const CONTEST = {
  title: 'Gagne un panier de naissance québécois',
  value: 250,
  endDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  })(),
  prize: [
    'Doudou fabriquée au Québec',
    'Bavoirs en coton biologique',
    'Livre pour bébé d\'un auteur québécois',
    'Produits de soins naturels',
    'Certificat-cadeau boutique locale',
  ],
};

const formatDate = (d: Date) =>
  d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });

const ContestsPage: React.FC = () => {
  const [params] = useSearchParams();
  const refParam = params.get('ref')?.toUpperCase() || null;
  const [result, setResult] = React.useState<EntryResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke('contest-enter', {
        body: { email: data.email.trim().toLowerCase(), ref: refParam },
      });
      if (error) throw error;
      if ((res as any)?.error) throw new Error((res as any).error);
      setResult(res as EntryResult);
      if ((res as any).alreadyRegistered) {
        toast.success('Tu es déjà inscrit·e. Voici ton lien de parrainage.');
      } else {
        toast.success('Inscription confirmée. Partage ton lien pour gagner plus d\'entrées !');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Une erreur est survenue. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = result
    ? `https://babybaby.org/contests?ref=${result.referral_code}`
    : '';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Concours : gagne un panier de naissance québécois de 250 $"
        description="Participe gratuitement à notre concours. Gagne un panier de naissance québécois (valeur 250 $). Chaque ami parrainé = 3 entrées bonus."
        canonicalUrl="https://babybaby.org/contests"
        keywords={['concours bébé Québec', 'gagner panier naissance', 'concours parents', 'giveaway bébé']}
      />
      <NavBar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Hero */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                <Gift className="h-3.5 w-3.5" /> Concours en cours
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {CONTEST.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Valeur de <strong className="text-primary">{CONTEST.value} $</strong> · Fin le {formatDate(CONTEST.endDate)}
              </p>
              {refParam && (
                <p className="text-sm text-muted-foreground italic">
                  Tu as été invité·e par un·e ami·e avec le code <strong>{refParam}</strong>
                </p>
              )}
            </div>

            {/* Prix détaillés */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" /> Ce que tu peux gagner
                </h2>
                <ul className="space-y-2">
                  {CONTEST.prize.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {!result ? (
              <Card className="border-primary/20 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Je participe gratuitement</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Une inscription = 1 entrée. Chaque ami·e inscrit·e via ton lien = <strong>+3 entrées bonus</strong>.
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Courriel</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="ton@courriel.ca"
                          className="pl-10"
                          {...register('email', {
                            required: 'Courriel requis',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Courriel invalide' },
                          })}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Envoi…' : 'Participer au concours'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Réservé aux résidents du Québec de 18 ans et plus.{' '}
                      <Link to="/contests/reglement" className="underline">Voir le règlement</Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-primary/40 shadow-lg bg-primary/5">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground mb-3">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold mb-2">
                    {result.alreadyRegistered ? 'Tu es déjà inscrit·e !' : 'Inscription confirmée !'}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Tu as actuellement <strong className="text-primary text-lg">{result.entries_count} entrée{result.entries_count > 1 ? 's' : ''}</strong> au tirage.
                  </p>

                  <div className="bg-card rounded-xl p-4 mb-6 border">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Ton lien de parrainage</p>
                    <p className="font-mono text-sm break-all mb-2">{shareUrl}</p>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" /> Chaque ami·e inscrit·e = <strong>+3 entrées</strong>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                      <Share2 className="h-4 w-4" /> Partage pour gagner plus d'entrées
                    </p>
                    <ShareButtons
                      url={shareUrl}
                      title={`Je participe pour gagner un panier de naissance québécois (250 $) ! Participe toi aussi :`}
                      description="Concours BabyBaby ouvert aux résidents du Québec."
                      imageUrl="https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-8 text-center text-xs text-muted-foreground">
              <Calendar className="inline h-3 w-3 mr-1" />
              Tirage au sort le {formatDate(CONTEST.endDate)}. Un seul gagnant contacté par courriel.
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContestsPage;
