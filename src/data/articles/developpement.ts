
import { Article } from '@/types/article';
import { gentleParentingArticle } from './gentle_parenting_article';

export const developpementArticles: Article[] = [
  {
    id: 8, // Changed ID to avoid conflicts
    title: "Les étapes clés du développement moteur de 0 à 12 mois",
    excerpt: "Découvrez les jalons importants du développement physique de votre bébé.",
    summary: "Un aperçu des principales étapes de développement moteur durant la première année.",
    content: "Le développement moteur de votre bébé suit généralement un schéma prévisible, avec des variations individuelles normales. Durant les premiers mois, bébé commence à contrôler sa tête, puis à rouler, s'asseoir, ramper, et enfin se tenir debout et marcher. Chaque étape renforce ses muscles et prépare la suivante.",
    image: "/lovable-uploads/d50b4331-6d8b-45e6-9e58-e8fc2d198a37.png",
    category: "Développement",
    date: "22 février 2025",
    readingTime: 8,
    tags: ["développement", "motricité", "éveil"],
    author: "Prof. Jean Piaget",
    featured: true
  },
    gentleParentingArticle
];
