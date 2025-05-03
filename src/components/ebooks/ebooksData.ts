
import { Ebook } from './types';

export const ebooksData: Ebook[] = [
  {
    id: "eb-001",
    title: "Guide de l'alimentation du nouveau-né",
    description: "Tout ce que vous devez savoir sur l'alimentation de votre bébé pendant sa première année.",
    coverImage: "/lovable-uploads/4e133b06-babf-4e1f-8fb2-f539c7a5b0aa.png",
    fileUrl: "alimentation-nouveau-ne.pdf",
    fileType: "PDF",
    fileSize: "3.2 MB",
    category: "Nutrition",
    tags: ["alimentation", "nouveau-né", "allaitement"],
    author: "Dr. Sophie Martin",
    publishDate: "2024-01-15"
  },
  {
    id: "eb-002",
    title: "Sommeil du bébé",
    description: "Techniques douces et efficaces pour aider votre bébé à bien dormir.",
    coverImage: "/lovable-uploads/ccda2a74-7a35-4a2d-8bc3-7b8c2feb3139.png",
    fileUrl: "sommeil-bebe-astuces.pdf",
    fileType: "PDF",
    fileSize: "2.8 MB",
    category: "Sommeil",
    tags: ["sommeil", "routine", "coucher"],
    author: "Dr. Anne Lecorps",
    publishDate: "2024-02-20",
    series: {
      id: "sommeil-par-age",
      name: "Sommeil de bébé par âge",
      order: 1
    }
  },
  {
    id: "eb-003",
    title: "Comprendre le développement de votre enfant",
    description: "Guide complet sur les étapes du développement de 0 à 3 ans.",
    coverImage: "/lovable-uploads/d6e01142-6465-4a8f-b2c6-6f9f5af76410.png",
    fileUrl: "developpement-enfant.epub",
    fileType: "EPUB",
    fileSize: "4.1 MB",
    category: "Développement",
    tags: ["développement", "croissance", "éveil"],
    author: "Pr. Jean Piaget",
    publishDate: "2024-03-10"
  },
  {
    id: "eb-004",
    title: "Préparer l'arrivée de bébé",
    description: "Checklist et conseils pour bien préparer l'arrivée de votre enfant.",
    coverImage: "/lovable-uploads/9ab34a8d-de13-4ad9-98ea-480f0d04a14b.png",
    fileUrl: "preparer-arrivee-bebe.pdf",
    fileType: "PDF",
    fileSize: "5.3 MB",
    category: "Préparation",
    tags: ["préparation", "arrivée", "matériel"],
    author: "Claire Dubois",
    publishDate: "2024-01-05"
  },
  {
    id: "eb-005",
    title: "Les vaccins expliqués aux parents",
    description: "Informations essentielles sur le calendrier vaccinal et l'importance des vaccins.",
    coverImage: "/lovable-uploads/e15314a2-a50b-4867-921c-6376551b5030.png",
    fileUrl: "vaccins-expliques.epub",
    fileType: "EPUB",
    fileSize: "3.7 MB",
    category: "Santé",
    tags: ["vaccins", "santé", "prévention"],
    author: "Dr. Robert Klein",
    publishDate: "2024-02-28"
  },
  {
    id: "eb-006",
    title: "Activités d'éveil pour bébé",
    description: "100 activités stimulantes pour favoriser l'éveil et le développement de votre bébé.",
    coverImage: "/lovable-uploads/f5a21dc5-5eb0-4077-b04f-d7d3f4d44ccd.png",
    fileUrl: "activites-eveil.pdf",
    fileType: "PDF",
    fileSize: "8.2 MB",
    category: "Éveil",
    tags: ["éveil", "jeux", "activités", "développement"],
    author: "Émilie Lefebvre",
    publishDate: "2024-03-15"
  }
];
