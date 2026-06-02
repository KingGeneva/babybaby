
export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface ArticleHowToStep {
  name: string;
  text: string;
}

export interface ArticleHowTo {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration, e.g. "PT15M"
  steps: ArticleHowToStep[];
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  excerpt: string;  // Champ pour compatibilité
  category: string;
  image: string;
  image_alt?: string;     // SEO alt-text for the cover image
  slug?: string;          // SEO-friendly kebab-case slug for the URL
  date: string;
  dateModified?: string;  // ISO-8601 last-modified timestamp for JSON-LD
  readingTime: number;
  tags: string[];
  author: string;
  featured?: boolean;
  views?: number;
  word_count?: number;
  seo_keyword?: string;
  faqs?: ArticleFAQ[];    // FAQ items rendered + emitted as FAQPage JSON-LD
  howTo?: ArticleHowTo;   // Optional HowTo schema for step-by-step articles
}
