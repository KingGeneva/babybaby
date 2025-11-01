
import { Ebook } from './types';

export const ebooksData: Ebook[] = [
  {
    id: "eb-001",
    title: "Les 6 premiers mois - Guide complet",
    description: "Tout ce que vous devez savoir pour accompagner votre bébé durant ses 6 premiers mois de vie.",
    coverImage: "/lovable-uploads/f17afad4-d5f6-413a-935d-83d0053d4541.png",
    fileUrl: "Les 6 premiers mois - Guide.pdf", // This is the exact filename in Supabase
    fileType: "PDF",
    fileSize: "4.7 MB",
    category: "Développement",
    tags: ["développement", "soins", "premiers mois"],
    author: "Dr. Sophie Martin",
    publishDate: "2024-02-15"
  },
  {
    id: "eb-002",
    title: "Le sommeil du bébé",
    description: "Des techniques douces et efficaces pour aider votre bébé à bien dormir la nuit.",
    coverImage: "/lovable-uploads/2b2ef526-b96a-4319-a022-120bb0d2ca28.png",
    fileUrl: "sommeil-bebe-astuces.pdf",
    fileType: "PDF",
    fileSize: "2.8 MB",
    category: "Sommeil",
    tags: ["sommeil", "routine", "coucher"],
    author: "Marie Dumont",
    publishDate: "2024-02-20"
  },
  {
    id: "eb-003",
    title: "Coliques du bébé",
    description: "Guide pratique pour comprendre et soulager les coliques de votre bébé avec des méthodes efficaces.",
    coverImage: "/lovable-uploads/728d443c-203b-42a8-bdd9-c19a50c6eed4.png",
    fileUrl: "Coliques du bebe.pdf",
    fileType: "PDF",
    fileSize: "3.5 MB",
    category: "Santé",
    tags: ["coliques", "santé", "nouveau-né", "soulagement"],
    author: "Dr. Thomas Renaud",
    publishDate: "2024-04-10"
  }
];
