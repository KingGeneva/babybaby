import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Scatter,
} from 'recharts';
import {
  Metric, Sex, ageInMonths, buildPercentileSeries, estimatePercentile,
} from '@/data/whoGrowthStandards';
import { Badge } from '@/components/ui/badge';

interface Measurement {
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_cm: number | null;
}

interface Props {
  title: string;
  unit: string;
  metric: Metric;
  field: 'height_cm' | 'weight_kg' | 'head_cm';
  measurements: Measurement[];
  birthDate: string;
  sex: Sex;
  color: string;
}

const PercentileChart: React.FC<Props> = ({
  title, unit, metric, field, measurements, birthDate, sex, color,
}) => {
  const maxChildAge = measurements.length
    ? Math.max(...measurements.map(m => ageInMonths(birthDate, m.measurement_date)))
    : 0;
  const maxMonths = Math.min(24, Math.max(12, Math.ceil(maxChildAge) + 2));

  const whoSeries = buildPercentileSeries(sex, metric, maxMonths);

  const childPoints = measurements
    .filter(m => m[field] != null)
    .map(m => ({
      months: +ageInMonths(birthDate, m.measurement_date).toFixed(2),
      child: Number(m[field]),
    }));

  // Merge into one dataset keyed by months (use WHO base + scatter points)
  const data = whoSeries.map(s => {
    const point = childPoints.find(p => Math.abs(p.months - s.months) < 0.5);
    return { ...s, child: point?.child ?? null };
  });
  // Append child points that fall between whole months
  childPoints.forEach(p => {
    if (!data.find(d => Math.abs(d.months - p.months) < 0.5)) {
      const interp = whoSeries.find(w => w.months >= p.months) || whoSeries[whoSeries.length - 1];
      data.push({ months: p.months, p3: interp.p3, p50: interp.p50, p97: interp.p97, child: p.child });
    }
  });
  data.sort((a, b) => a.months - b.months);

  const last = childPoints[childPoints.length - 1];
  const pct = last ? estimatePercentile(sex, metric, last.months, last.child) : null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {pct !== null && (
          <Badge variant="secondary" className="text-xs">
            P{pct} <span className="opacity-60 ml-1">OMS</span>
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis
                dataKey="months"
                type="number"
                domain={[0, 'dataMax']}
                tick={{ fontSize: 11 }}
                label={{ value: 'mois', position: 'insideBottom', offset: -2, fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} width={32} domain={['auto', 'auto']} />
              <Tooltip
                formatter={(v: any, name: string) => [v == null ? '—' : `${(+v).toFixed(2)} ${unit}`, name]}
                labelFormatter={(l) => `${(+l).toFixed(1)} mois`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {/* WHO band: area from p3 to p97 */}
              <Area
                type="monotone"
                dataKey="p97"
                stroke="none"
                fill={color}
                fillOpacity={0.08}
                name="P3-P97 (OMS)"
                isAnimationActive={false}
                activeDot={false}
              />
              <Area
                type="monotone"
                dataKey="p3"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
                legendType="none"
                isAnimationActive={false}
                activeDot={false}
              />
              <Line type="monotone" dataKey="p3" stroke={color} strokeOpacity={0.4} strokeDasharray="4 4" dot={false} name="P3" />
              <Line type="monotone" dataKey="p50" stroke={color} strokeOpacity={0.6} strokeDasharray="2 2" dot={false} name="P50 (médiane)" />
              <Line type="monotone" dataKey="p97" stroke={color} strokeOpacity={0.4} strokeDasharray="4 4" dot={false} name="P97" />
              <Line
                type="monotone"
                dataKey="child"
                stroke={color}
                strokeWidth={2.5}
                connectNulls
                dot={{ r: 4, fill: color, strokeWidth: 0 }}
                name="Bébé"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PercentileChart;
