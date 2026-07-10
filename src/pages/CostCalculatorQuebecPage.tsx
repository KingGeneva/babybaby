import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ShareButtons from '@/components/common/ShareButtons';
import { ArrowRight, Info, Calculator } from 'lucide-react';

type Feeding = 'allaitement' | 'formule';
type Diapers = 'jetables' | 'lavables';
type Care = 'garderie-subventionnee' | 'garderie-privee' | 'parent-maison';
type Equip = 'neuf' | 'usage';

const fmt = (n: number) =>
  n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

// Estimations annuelles (12 mois) — moyennes indicatives Québec 2026
const COSTS = {
  feeding: { allaitement: 400, formule: 2400 },
  diapers: { jetables: 1200, lavables: 500 },
  care: {
    'garderie-subventionnee': 9.35 * 5 * 48, // ~2244 $
    'garderie-privee': 45 * 5 * 48,          // ~10800 $
    'parent-maison': 0,
  },
  equip: { neuf: 3500, usage: 1200 },
  other: 1500, // santé, vêtements, sorties
};

const CostCalculatorQuebec: React.FC = () => {
  const [feeding, setFeeding] = React.useState<Feeding>('allaitement');
  const [diapers, setDiapers] = React.useState<Diapers>('jetables');
  const [care, setCare] = React.useState<Care>('garderie-subventionnee');
  const [equip, setEquip] = React.useState<Equip>('usage');

  // Aides paramétrables (estimations utilisateur)
  const [rqap, setRqap] = React.useState<number>(28000);
  const [allocation, setAllocation] = React.useState<number>(3000);

  const grossCost =
    COSTS.feeding[feeding] +
    COSTS.diapers[diapers] +
    COSTS.care[care] +
    COSTS.equip[equip] +
    COSTS.other;

  const totalAids = rqap + allocation;
  const netCost = Math.max(0, grossCost - totalAids);

  const breakdown = [
    { label: 'Alimentation', value: COSTS.feeding[feeding] },
    { label: 'Couches', value: COSTS.diapers[diapers] },
    { label: 'Garde', value: COSTS.care[care] },
    { label: 'Équipement', value: COSTS.equip[equip] },
    { label: 'Autres (santé, vêtements, sorties)', value: COSTS.other },
  ];

  const maxBar = Math.max(...breakdown.map(b => b.value), 1);

  const shareUrl = 'https://babybaby.org/calculateur-cout-bebe-quebec';
  const shareTitle = `J'ai calculé qu'un bébé coûte ${fmt(netCost)} net la première année au Québec. Calcule le tien :`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculateur du coût d\'un bébé au Québec 2026',
    url: shareUrl,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
    description:
      'Calculateur gratuit pour estimer le coût réel de la première année de bébé au Québec en 2026 : alimentation, couches, garde, équipement et aides gouvernementales.',
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Combien coûte un bébé au Québec en 2026 ? Calculateur gratuit"
        description="Calcule le coût réel de la première année de bébé au Québec : alimentation, garderie, couches, équipement, moins RQAP et Allocation famille. Résultat personnalisé en 30 secondes."
        canonicalUrl={shareUrl}
        keywords={['combien coûte un bébé au Québec', 'coût bébé première année', 'budget bébé Québec 2026', 'RQAP calculateur', 'allocation famille']}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <NavBar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-3 text-primary">
                <Calculator className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wide">Outil gratuit</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
                Combien coûte un bébé au Québec en 2026 ?
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Réponds à 4 questions pour obtenir une estimation personnalisée du coût de la première année,
                aides gouvernementales incluses.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">1. Alimentation</CardTitle></CardHeader>
                  <CardContent>
                    <RadioGroup value={feeding} onValueChange={(v) => setFeeding(v as Feeding)}>
                      <div className="flex items-center gap-2"><RadioGroupItem value="allaitement" id="f1" /><Label htmlFor="f1">Allaitement</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="formule" id="f2" /><Label htmlFor="f2">Formule (préparation)</Label></div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">2. Couches</CardTitle></CardHeader>
                  <CardContent>
                    <RadioGroup value={diapers} onValueChange={(v) => setDiapers(v as Diapers)}>
                      <div className="flex items-center gap-2"><RadioGroupItem value="jetables" id="d1" /><Label htmlFor="d1">Jetables</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="lavables" id="d2" /><Label htmlFor="d2">Lavables</Label></div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">3. Mode de garde</CardTitle></CardHeader>
                  <CardContent>
                    <RadioGroup value={care} onValueChange={(v) => setCare(v as Care)}>
                      <div className="flex items-center gap-2"><RadioGroupItem value="garderie-subventionnee" id="c1" /><Label htmlFor="c1">Garderie subventionnée (CPE)</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="garderie-privee" id="c2" /><Label htmlFor="c2">Garderie privée non subventionnée</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="parent-maison" id="c3" /><Label htmlFor="c3">Un parent à la maison</Label></div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">4. Équipement</CardTitle></CardHeader>
                  <CardContent>
                    <RadioGroup value={equip} onValueChange={(v) => setEquip(v as Equip)}>
                      <div className="flex items-center gap-2"><RadioGroupItem value="neuf" id="e1" /><Label htmlFor="e1">Neuf (poussette, lit, siège auto…)</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="usage" id="e2" /><Label htmlFor="e2">Usagé / cadeaux / seconde main</Label></div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="bg-muted/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      Revenus & aides estimés <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="rqap" className="text-xs">RQAP (annuel estimé, $)</Label>
                      <Input id="rqap" type="number" value={rqap} onChange={(e) => setRqap(Number(e.target.value) || 0)} />
                    </div>
                    <div>
                      <Label htmlFor="alloc" className="text-xs">Allocation famille (annuel estimé, $)</Label>
                      <Input id="alloc" type="number" value={allocation} onChange={(e) => setAllocation(Number(e.target.value) || 0)} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ces montants sont des <strong>estimations modifiables</strong>. Les montants exacts dépendent
                      de ta situation. Vérifie sur les sites officiels :{' '}
                      <a href="https://www.rqap.gouv.qc.ca" target="_blank" rel="noopener noreferrer" className="underline">rqap.gouv.qc.ca</a>{' '}
                      et <a href="https://www.rrq.gouv.qc.ca" target="_blank" rel="noopener noreferrer" className="underline">Retraite Québec</a>.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="md:sticky md:top-24 self-start space-y-4">
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Coût net estimé (1re année)</p>
                    <p className="font-display text-5xl font-bold text-primary mb-1">{fmt(netCost)}</p>
                    <p className="text-xs text-muted-foreground">
                      Coût brut {fmt(grossCost)} − aides {fmt(totalAids)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Répartition</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {breakdown.map((b) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{b.label}</span>
                          <span className="font-medium">{fmt(b.value)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(b.value / maxBar) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold mb-3">Partage ton résultat</p>
                    <ShareButtons url={shareUrl} title={shareTitle} imageUrl="https://babybaby.org/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png" />
                  </CardContent>
                </Card>

                <Button asChild size="lg" className="w-full">
                  <Link to="/meilleurs-produits-bebe-2026">
                    Économise sur l'équipement avec nos comparatifs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-10 max-w-2xl mx-auto">
              Avertissement : les montants présentés sont des <strong>estimations moyennes</strong> à titre indicatif
              pour le Québec en 2026. Ils ne remplacent pas un calcul personnalisé auprès des organismes officiels.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CostCalculatorQuebec;
