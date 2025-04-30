
export interface Milestone {
  id: string;
  name: string;
  title?: string;
  description?: string;
  notes?: string;
  expected_age_months: number;
  category?: string;
}
