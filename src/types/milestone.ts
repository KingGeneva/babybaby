
export interface Milestone {
  id: string;
  name: string;
  title?: string;
  child_id: string;
  expected_age_months: number;
  achieved_date?: string;
  created_at: string;
  notes?: string;
  completed?: boolean;
  age_range?: string;
  category?: string;
}
