
export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;  
  excerpt: string;  // Champ pour compatibilité
  category: string;
  image: string;
  date: string;
  readingTime: number;
  tags: string[];
  author: string;
  featured?: boolean; // Optionnel
  views?: number;     // Optionnel
}
