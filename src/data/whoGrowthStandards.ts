// WHO Child Growth Standards — approximated percentiles (P3 / P50 / P97)
// Months 0-24, by sex. Source: WHO Multicentre Growth Reference Study.

export type Sex = 'M' | 'F';
export type Metric = 'weight' | 'height' | 'head';

interface Row { m: number; p3: number; p50: number; p97: number }

const boysWeight: Row[] = [
  { m: 0, p3: 2.5, p50: 3.3, p97: 4.4 }, { m: 1, p3: 3.4, p50: 4.5, p97: 5.8 },
  { m: 2, p3: 4.4, p50: 5.6, p97: 7.1 }, { m: 3, p3: 5.1, p50: 6.4, p97: 8.0 },
  { m: 4, p3: 5.6, p50: 7.0, p97: 8.7 }, { m: 5, p3: 6.1, p50: 7.5, p97: 9.3 },
  { m: 6, p3: 6.4, p50: 7.9, p97: 9.8 }, { m: 7, p3: 6.7, p50: 8.3, p97: 10.3 },
  { m: 8, p3: 6.9, p50: 8.6, p97: 10.7 }, { m: 9, p3: 7.1, p50: 8.9, p97: 11.0 },
  { m: 10, p3: 7.4, p50: 9.2, p97: 11.4 }, { m: 11, p3: 7.6, p50: 9.4, p97: 11.7 },
  { m: 12, p3: 7.7, p50: 9.6, p97: 12.0 }, { m: 13, p3: 7.9, p50: 9.9, p97: 12.3 },
  { m: 14, p3: 8.1, p50: 10.1, p97: 12.6 }, { m: 15, p3: 8.3, p50: 10.3, p97: 12.8 },
  { m: 16, p3: 8.4, p50: 10.5, p97: 13.1 }, { m: 17, p3: 8.6, p50: 10.7, p97: 13.4 },
  { m: 18, p3: 8.8, p50: 10.9, p97: 13.7 }, { m: 19, p3: 8.9, p50: 11.1, p97: 13.9 },
  { m: 20, p3: 9.1, p50: 11.3, p97: 14.2 }, { m: 21, p3: 9.2, p50: 11.5, p97: 14.5 },
  { m: 22, p3: 9.4, p50: 11.8, p97: 14.7 }, { m: 23, p3: 9.5, p50: 12.0, p97: 15.0 },
  { m: 24, p3: 9.7, p50: 12.2, p97: 15.3 },
];

const boysHeight: Row[] = [
  { m: 0, p3: 46.1, p50: 49.9, p97: 53.7 }, { m: 1, p3: 50.8, p50: 54.7, p97: 58.6 },
  { m: 2, p3: 54.4, p50: 58.4, p97: 62.4 }, { m: 3, p3: 57.3, p50: 61.4, p97: 65.5 },
  { m: 4, p3: 59.7, p50: 63.9, p97: 68.0 }, { m: 5, p3: 61.7, p50: 65.9, p97: 70.1 },
  { m: 6, p3: 63.3, p50: 67.6, p97: 71.9 }, { m: 7, p3: 64.8, p50: 69.2, p97: 73.5 },
  { m: 8, p3: 66.2, p50: 70.6, p97: 75.0 }, { m: 9, p3: 67.5, p50: 72.0, p97: 76.5 },
  { m: 10, p3: 68.7, p50: 73.3, p97: 77.9 }, { m: 11, p3: 69.9, p50: 74.5, p97: 79.2 },
  { m: 12, p3: 71.0, p50: 75.7, p97: 80.5 }, { m: 13, p3: 72.1, p50: 76.9, p97: 81.8 },
  { m: 14, p3: 73.1, p50: 78.0, p97: 83.0 }, { m: 15, p3: 74.1, p50: 79.1, p97: 84.2 },
  { m: 16, p3: 75.0, p50: 80.2, p97: 85.4 }, { m: 17, p3: 76.0, p50: 81.2, p97: 86.5 },
  { m: 18, p3: 76.9, p50: 82.3, p97: 87.7 }, { m: 19, p3: 77.7, p50: 83.2, p97: 88.8 },
  { m: 20, p3: 78.6, p50: 84.2, p97: 89.8 }, { m: 21, p3: 79.4, p50: 85.1, p97: 90.9 },
  { m: 22, p3: 80.2, p50: 86.0, p97: 91.9 }, { m: 23, p3: 81.0, p50: 86.9, p97: 92.9 },
  { m: 24, p3: 81.7, p50: 87.8, p97: 93.9 },
];

const boysHead: Row[] = [
  { m: 0, p3: 32.6, p50: 34.5, p97: 36.4 }, { m: 1, p3: 35.8, p50: 37.6, p97: 39.4 },
  { m: 2, p3: 37.4, p50: 39.1, p97: 40.9 }, { m: 3, p3: 38.6, p50: 40.5, p97: 42.3 },
  { m: 4, p3: 39.7, p50: 41.6, p97: 43.5 }, { m: 5, p3: 40.5, p50: 42.6, p97: 44.6 },
  { m: 6, p3: 41.3, p50: 43.3, p97: 45.3 }, { m: 7, p3: 41.9, p50: 44.0, p97: 46.0 },
  { m: 8, p3: 42.5, p50: 44.5, p97: 46.5 }, { m: 9, p3: 42.9, p50: 45.0, p97: 47.0 },
  { m: 10, p3: 43.3, p50: 45.4, p97: 47.5 }, { m: 11, p3: 43.7, p50: 45.8, p97: 47.9 },
  { m: 12, p3: 44.0, p50: 46.1, p97: 48.2 }, { m: 13, p3: 44.3, p50: 46.3, p97: 48.4 },
  { m: 14, p3: 44.5, p50: 46.6, p97: 48.7 }, { m: 15, p3: 44.7, p50: 46.8, p97: 48.9 },
  { m: 16, p3: 44.9, p50: 47.0, p97: 49.1 }, { m: 17, p3: 45.1, p50: 47.2, p97: 49.3 },
  { m: 18, p3: 45.3, p50: 47.4, p97: 49.5 }, { m: 19, p3: 45.4, p50: 47.5, p97: 49.7 },
  { m: 20, p3: 45.6, p50: 47.7, p97: 49.8 }, { m: 21, p3: 45.7, p50: 47.8, p97: 50.0 },
  { m: 22, p3: 45.9, p50: 48.0, p97: 50.1 }, { m: 23, p3: 46.0, p50: 48.1, p97: 50.3 },
  { m: 24, p3: 46.1, p50: 48.3, p97: 50.4 },
];

const girlsWeight: Row[] = [
  { m: 0, p3: 2.4, p50: 3.2, p97: 4.2 }, { m: 1, p3: 3.2, p50: 4.2, p97: 5.4 },
  { m: 2, p3: 4.0, p50: 5.1, p97: 6.5 }, { m: 3, p3: 4.6, p50: 5.8, p97: 7.4 },
  { m: 4, p3: 5.1, p50: 6.4, p97: 8.1 }, { m: 5, p3: 5.5, p50: 6.9, p97: 8.7 },
  { m: 6, p3: 5.8, p50: 7.3, p97: 9.2 }, { m: 7, p3: 6.1, p50: 7.6, p97: 9.6 },
  { m: 8, p3: 6.3, p50: 7.9, p97: 10.0 }, { m: 9, p3: 6.6, p50: 8.2, p97: 10.4 },
  { m: 10, p3: 6.8, p50: 8.5, p97: 10.7 }, { m: 11, p3: 7.0, p50: 8.7, p97: 11.0 },
  { m: 12, p3: 7.1, p50: 8.9, p97: 11.3 }, { m: 13, p3: 7.3, p50: 9.2, p97: 11.6 },
  { m: 14, p3: 7.5, p50: 9.4, p97: 11.9 }, { m: 15, p3: 7.7, p50: 9.6, p97: 12.2 },
  { m: 16, p3: 7.8, p50: 9.8, p97: 12.5 }, { m: 17, p3: 8.0, p50: 10.0, p97: 12.7 },
  { m: 18, p3: 8.2, p50: 10.2, p97: 13.0 }, { m: 19, p3: 8.3, p50: 10.4, p97: 13.3 },
  { m: 20, p3: 8.5, p50: 10.6, p97: 13.5 }, { m: 21, p3: 8.7, p50: 10.9, p97: 13.8 },
  { m: 22, p3: 8.8, p50: 11.1, p97: 14.1 }, { m: 23, p3: 9.0, p50: 11.3, p97: 14.3 },
  { m: 24, p3: 9.2, p50: 11.5, p97: 14.6 },
];

const girlsHeight: Row[] = [
  { m: 0, p3: 45.4, p50: 49.1, p97: 52.9 }, { m: 1, p3: 49.8, p50: 53.7, p97: 57.6 },
  { m: 2, p3: 53.0, p50: 57.1, p97: 61.1 }, { m: 3, p3: 55.6, p50: 59.8, p97: 64.0 },
  { m: 4, p3: 57.8, p50: 62.1, p97: 66.4 }, { m: 5, p3: 59.6, p50: 64.0, p97: 68.5 },
  { m: 6, p3: 61.2, p50: 65.7, p97: 70.3 }, { m: 7, p3: 62.7, p50: 67.3, p97: 71.9 },
  { m: 8, p3: 64.0, p50: 68.7, p97: 73.5 }, { m: 9, p3: 65.3, p50: 70.1, p97: 75.0 },
  { m: 10, p3: 66.5, p50: 71.5, p97: 76.4 }, { m: 11, p3: 67.7, p50: 72.8, p97: 77.8 },
  { m: 12, p3: 68.9, p50: 74.0, p97: 79.2 }, { m: 13, p3: 70.0, p50: 75.2, p97: 80.5 },
  { m: 14, p3: 71.0, p50: 76.4, p97: 81.7 }, { m: 15, p3: 72.0, p50: 77.5, p97: 83.0 },
  { m: 16, p3: 73.0, p50: 78.6, p97: 84.2 }, { m: 17, p3: 74.0, p50: 79.7, p97: 85.4 },
  { m: 18, p3: 74.9, p50: 80.7, p97: 86.5 }, { m: 19, p3: 75.8, p50: 81.7, p97: 87.6 },
  { m: 20, p3: 76.7, p50: 82.7, p97: 88.7 }, { m: 21, p3: 77.5, p50: 83.7, p97: 89.8 },
  { m: 22, p3: 78.4, p50: 84.6, p97: 90.8 }, { m: 23, p3: 79.2, p50: 85.5, p97: 91.9 },
  { m: 24, p3: 80.0, p50: 86.4, p97: 92.9 },
];

const girlsHead: Row[] = [
  { m: 0, p3: 32.0, p50: 33.9, p97: 35.8 }, { m: 1, p3: 35.1, p50: 36.9, p97: 38.7 },
  { m: 2, p3: 36.7, p50: 38.4, p97: 40.2 }, { m: 3, p3: 37.8, p50: 39.5, p97: 41.4 },
  { m: 4, p3: 38.7, p50: 40.6, p97: 42.5 }, { m: 5, p3: 39.5, p50: 41.5, p97: 43.4 },
  { m: 6, p3: 40.3, p50: 42.2, p97: 44.2 }, { m: 7, p3: 40.9, p50: 42.8, p97: 44.8 },
  { m: 8, p3: 41.4, p50: 43.4, p97: 45.4 }, { m: 9, p3: 41.8, p50: 43.8, p97: 45.9 },
  { m: 10, p3: 42.2, p50: 44.2, p97: 46.3 }, { m: 11, p3: 42.6, p50: 44.6, p97: 46.7 },
  { m: 12, p3: 42.9, p50: 44.9, p97: 47.0 }, { m: 13, p3: 43.2, p50: 45.2, p97: 47.3 },
  { m: 14, p3: 43.4, p50: 45.4, p97: 47.6 }, { m: 15, p3: 43.6, p50: 45.7, p97: 47.9 },
  { m: 16, p3: 43.9, p50: 45.9, p97: 48.1 }, { m: 17, p3: 44.1, p50: 46.1, p97: 48.3 },
  { m: 18, p3: 44.2, p50: 46.3, p97: 48.5 }, { m: 19, p3: 44.4, p50: 46.5, p97: 48.7 },
  { m: 20, p3: 44.6, p50: 46.7, p97: 48.9 }, { m: 21, p3: 44.7, p50: 46.9, p97: 49.0 },
  { m: 22, p3: 44.9, p50: 47.0, p97: 49.2 }, { m: 23, p3: 45.0, p50: 47.2, p97: 49.4 },
  { m: 24, p3: 45.1, p50: 47.3, p97: 49.5 },
];

const tables: Record<Sex, Record<Metric, Row[]>> = {
  M: { weight: boysWeight, height: boysHeight, head: boysHead },
  F: { weight: girlsWeight, height: girlsHeight, head: girlsHead },
};

export function normalizeSex(gender?: string | null): Sex {
  if (!gender) return 'M';
  const g = gender.toString().trim().toLowerCase();
  if (g.startsWith('f') || g.startsWith('girl')) return 'F';
  return 'M';
}

export function ageInMonths(birthDate: string, at: string | Date = new Date()): number {
  const b = new Date(birthDate);
  const d = typeof at === 'string' ? new Date(at) : at;
  const days = (d.getTime() - b.getTime()) / 86400000;
  return Math.max(0, days / 30.4375);
}

function interp(rows: Row[], months: number) {
  if (months <= rows[0].m) return rows[0];
  if (months >= rows[rows.length - 1].m) return rows[rows.length - 1];
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i], b = rows[i + 1];
    if (months >= a.m && months <= b.m) {
      const t = (months - a.m) / (b.m - a.m);
      return {
        m: months,
        p3: a.p3 + (b.p3 - a.p3) * t,
        p50: a.p50 + (b.p50 - a.p50) * t,
        p97: a.p97 + (b.p97 - a.p97) * t,
      };
    }
  }
  return rows[rows.length - 1];
}

export function getPercentileBand(sex: Sex, metric: Metric, months: number) {
  const r = interp(tables[sex][metric], months);
  return { p3: +r.p3.toFixed(2), p50: +r.p50.toFixed(2), p97: +r.p97.toFixed(2) };
}

/** Returns an approximate percentile (0-100) for a given value using P3/P50/P97 anchors. */
export function estimatePercentile(sex: Sex, metric: Metric, months: number, value: number): number {
  const { p3, p50, p97 } = getPercentileBand(sex, metric, months);
  if (value <= p3) return 3;
  if (value >= p97) return 97;
  if (value < p50) {
    const t = (value - p3) / (p50 - p3);
    return Math.round(3 + t * 47);
  }
  const t = (value - p50) / (p97 - p50);
  return Math.round(50 + t * 47);
}

export function buildPercentileSeries(sex: Sex, metric: Metric, maxMonths = 24) {
  return Array.from({ length: maxMonths + 1 }, (_, m) => {
    const r = interp(tables[sex][metric], m);
    return { months: m, p3: +r.p3.toFixed(2), p50: +r.p50.toFixed(2), p97: +r.p97.toFixed(2) };
  });
}
