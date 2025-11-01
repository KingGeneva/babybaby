
export interface Milestone {
  id: string;
  name?: string;
  title: string;
  description?: string;
  notes?: string | null;
  expected_age_months?: number;
  age_months: number;
  category: string;
  achieved?: boolean;
  achieved_date?: string | null;
  child_id?: string;
  created_at?: string;
}
