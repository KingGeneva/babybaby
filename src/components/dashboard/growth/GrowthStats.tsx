import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity, Ruler, Scale } from 'lucide-react';
import { ageInMonths, estimatePercentile, normalizeSex, Sex } from '@/data/whoGrowthStandards';

interface Measurement {
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_cm: number | null;
}

interface Props {
  measurements: Measurement[];
  birthDate: string;
  gender?: string | null;
}

function pickRecent(measurements: Measurement[], field: keyof Measurement) {
  return [...measurements].reverse().find(m => m[field] != null) as Measurement | undefined;
}

function gainOver(measurements: Measurement[], field: 'weight_kg' | 'height_cm', days: number) {
  const sorted = [...measurements].filter(m => m[field] != null)
    .sort((a, b) => +new Date(a.measurement_date) - +new Date(b.measurement_date));
  if (sorted.length < 2) return null;
  const last = sorted[sorted.length - 1];
  const lastDate = +new Date(last.measurement_date);
  const target = sorted.reverse().find(m =>
    (lastDate - +new Date(m.measurement_date)) >= days * 86400000
  );
  const ref = target ?? sorted[sorted.length - 1];
  if (ref === last) return null;
  return Number(last[field]) - Number(ref[field]);
}

const GrowthStats: React.FC<Props> = ({ measurements, birthDate, gender }) => {
  const sex: Sex = normalizeSex(gender);
  const lastW = pickRecent(measurements, 'weight_kg');
  const lastH = pickRecent(measurements, 'height_cm');
  const lastHead = pickRecent(measurements, 'head_cm');

  const wGain30 = gainOver(measurements, 'weight_kg', 30);
  const hGain30 = gainOver(measurements, 'height_cm', 30);

  const ageNow = ageInMonths(birthDate);
  const wPct = lastW?.weight_kg != null
    ? estimatePercentile(sex, 'weight', ageInMonths(birthDate, lastW.measurement_date), Number(lastW.weight_kg))
    : null;
  const hPct = lastH?.height_cm != null
    ? estimatePercentile(sex, 'height', ageInMonths(birthDate, lastH.measurement_date), Number(lastH.height_cm))
    : null;

  let bmi: number | null = null;
  if (lastW?.weight_kg && lastH?.height_cm) {
    const h = Number(lastH.height_cm) / 100;
    bmi = Number(lastW.weight_kg) / (h * h);
  }

  const cards = [
    {
      icon: Scale, label: 'Poids actuel',
      value: lastW?.weight_kg ? `${Number(lastW.weight_kg).toFixed(2)} kg` : '—',
      sub: wPct !== null ? `Percentile OMS ≈ P${wPct}` : 'Aucune mesure',
    },
    {
      icon: Ruler, label: 'Taille actuelle',
      value: lastH?.height_cm ? `${Number(lastH.height_cm).toFixed(1)} cm` : '—',
      sub: hPct !== null ? `Percentile OMS ≈ P${hPct}` : 'Aucune mesure',
    },
    {
      icon: TrendingUp, label: 'Gain (30 j)',
      value: wGain30 !== null
        ? `${wGain30 >= 0 ? '+' : ''}${wGain30.toFixed(2)} kg`
        : '—',
      sub: hGain30 !== null ? `${hGain30 >= 0 ? '+' : ''}${hGain30.toFixed(1)} cm taille` : 'Pas assez de données',
    },
    {
      icon: Activity, label: 'IMC',
      value: bmi ? bmi.toFixed(1) : '—',
      sub: lastHead?.head_cm
        ? `Tour de tête ${Number(lastHead.head_cm).toFixed(1)} cm`
        : `Âge ${ageNow.toFixed(1)} mois`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xl font-bold">{c.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GrowthStats;
