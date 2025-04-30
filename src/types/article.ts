
export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;  
  excerpt: string;  // Ajout du champ excerpt pour compatibilité
  category: string;
  image: string;
  date: string;
  readingTime: number;
  tags: string[];
  author: string;
  featured?: boolean; // Ajout en option pour compatibilité
}
