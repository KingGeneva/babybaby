
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

export interface CategoryStats {
  total: number;
  completed: number;
}

export type ViewMode = 'all' | 'todo' | 'done';
