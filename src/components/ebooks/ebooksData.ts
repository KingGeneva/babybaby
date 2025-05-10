
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
  },
  {
    id: "eb-004",
    title: "Guide de l'alimentation",
    description: "Comment introduire les aliments solides et établir de bonnes habitudes alimentaires chez votre enfant.",
    coverImage: "/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png",
    fileUrl: "guide-alimentation-bebe.pdf",
    fileType: "PDF",
    fileSize: "5.1 MB",
    category: "Nutrition",
    tags: ["alimentation", "nutrition", "diversification", "recettes"],
    author: "Prof. Claire Dupont",
    publishDate: "2024-05-01"
  },
  {
    id: "eb-005",
    title: "Développement moteur",
    description: "Suivez et encouragez les étapes du développement moteur de votre bébé avec des activités adaptées.",
    coverImage: "/lovable-uploads/af7cb1bb-a9c3-4487-9f11-9c050013463d.png",
    fileUrl: "developpement-moteur.pdf",
    fileType: "PDF",
    fileSize: "3.8 MB",
    category: "Développement",
    tags: ["motricité", "développement", "activités", "exercices"],
    author: "Dr. Jean Leclerc",
    publishDate: "2024-04-25"
  },
  {
    id: "eb-006",
    title: "Maladies infantiles",
    description: "Guide des maladies infantiles courantes : symptômes, traitements et conseils pratiques pour les parents.",
    coverImage: "/lovable-uploads/c03dc99f-150b-4ef6-8fba-2089a3f2d709.png",
    fileUrl: "maladies-infantiles-guide.pdf",
    fileType: "PDF",
    fileSize: "4.2 MB",
    category: "Santé",
    tags: ["maladies", "santé", "symptômes", "traitements"],
    author: "Dr. Antoine Moreau",
    publishDate: "2024-03-10"
  },
  {
    id: "eb-007",
    title: "Voyager avec bébé",
    description: "Conseils et astuces pour des voyages sereins avec votre bébé, en voiture, train ou avion.",
    coverImage: "/lovable-uploads/ad26c446-0eb9-48e1-9de8-b0d5e1f6fa9f.png",
    fileUrl: "voyager-avec-bebe.pdf",
    fileType: "PDF",
    fileSize: "2.9 MB",
    category: "Lifestyle",
    tags: ["voyage", "transport", "vacances", "préparation"],
    author: "Sophie Travelle",
    publishDate: "2024-05-05"
  }
];
