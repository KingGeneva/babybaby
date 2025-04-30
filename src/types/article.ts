
export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;  // Ajout du champ summary qui manquait
  category: string;
  image: string;
  date: string;
  readingTime: number;
  tags: string[];
  author: string;
}
