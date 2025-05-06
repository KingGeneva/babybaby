
import { Ebook } from './types';

export const ebooksData: Ebook[] = [
  {
    id: "eb-001",
    title: "Les 6 premiers mois - Guide essentiel",
    description: "Tout ce que vous devez savoir pour accompagner votre bébé durant ses 6 premiers mois de vie.",
    coverImage: "/lovable-uploads/9ab34a8d-de13-4ad9-98ea-480f0d04a14b.png",
    fileUrl: "Les 6 premiers mois - Guide.pdf",
    fileType: "PDF",
    fileSize: "4.7 MB",
    category: "Développement",
    tags: ["développement", "soins", "premiers mois"],
    author: "Dr. Sophie Martin",
    publishDate: "2024-02-15"
  },
  {
    id: "eb-002",
    title: "Les secrets d'un sommeil paisible",
    description: "Des techniques prouvées pour aider votre bébé à bien dormir la nuit.",
    coverImage: "/lovable-uploads/ccda2a74-7a35-4a2d-8bc3-7b8c2feb3139.png",
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
