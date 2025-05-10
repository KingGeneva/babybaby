
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
    title: "Le Bain de Bébé",
    description: "Guide pratique pour rendre le bain de votre bébé agréable et sécuritaire. Conseils et astuces pour les premiers bains.",
    coverImage: "/lovable-uploads/a6e4664e-9f3d-463c-8865-99ac1cf3ae70.png",
    fileUrl: "Le Bain de Bebe.pdf",
    fileType: "PDF",
    fileSize: "3.2 MB",
    category: "Soins",
    tags: ["bain", "hygiène", "soins quotidiens", "nouveau-né"],
    author: "Dr. Marie Lambert",
    publishDate: "2024-05-05"
  },
  {
    id: "eb-005",
    title: "L'alimentation de bébé",
    description: "Guide complet sur l'alimentation de bébé, de la naissance à la diversification alimentaire. Conseils nutritionnels et recettes adaptées.",
    coverImage: "/lovable-uploads/aeae1027-89c5-4720-a53e-f6918dc25f50.png",
    fileUrl: "Alimentation de bebe.pdf",
    fileType: "PDF",
    fileSize: "4.1 MB",
    category: "Alimentation",
    tags: ["nutrition", "diversification", "allaitement", "repas"],
    author: "Dr. Julie Moreau",
    publishDate: "2024-05-08"
  },
  {
    id: "eb-006",
    title: "Les étapes clés du développement de bébé",
    description: "Un guide complet pour comprendre et accompagner le développement de votre enfant mois par mois pendant sa première année.",
    coverImage: "/lovable-uploads/96f5ed98-f001-4d9d-b374-7bde4361ac2c.png",
    fileUrl: "Etapes cles developpement bebe.pdf",
    fileType: "PDF",
    fileSize: "5.3 MB",
    category: "Développement",
    tags: ["développement", "étapes", "croissance", "milestones"],
    author: "Prof. Alexandre Dubois",
    publishDate: "2024-05-10"
  },
  {
    id: "eb-007",
    title: "Grossesse - Guide complet",
    description: "Guide complet des signes, étapes, suivi et conseils essentiels pour attendre bébé sereinement.",
    coverImage: "/lovable-uploads/1c4b2b97-74e7-4e2c-b126-915c3aba4bf8.png",
    fileUrl: "Grossesse Guide Complet.pdf",
    fileType: "PDF",
    fileSize: "6.2 MB",
    category: "Grossesse",
    tags: ["grossesse", "préparation", "santé", "trimestres"],
    author: "Dr. Émilie Rousseau",
    publishDate: "2024-05-12"
  }
];
