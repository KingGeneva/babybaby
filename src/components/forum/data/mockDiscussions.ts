
import { DiscussionProps } from "../components/DiscussionCard";

export const mockDiscussions: DiscussionProps[] = [
  {
    id: "1",
    title: "Comment faire face aux nuits agitées de bébé ?",
    excerpt: "Mon bébé de 6 mois se réveille toutes les heures la nuit. J'ai essayé plusieurs méthodes mais rien ne semble fonctionner. Avez-vous des conseils ?",
    author: {
      name: "Marie Laurent",
      avatar: "/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png"
    },
    category: {
      name: "Sommeil",
      slug: "sommeil"
    },
    replies: 12,
    lastActivity: "2025-05-19T14:23:00Z"
  },
  {
    id: "2",
    title: "Quelles activités d'éveil pour un bébé de 9 mois ?",
    excerpt: "Je cherche des idées d'activités pour stimuler mon bébé de 9 mois. Que faites-vous avec vos petits à cet âge ?",
    author: {
      name: "Thomas Durand",
      avatar: "/lovable-uploads/b8cc3c2a-bb9a-4560-baf1-44055b2ca3a1.png"
    },
    category: {
      name: "Développement",
      slug: "developpement"
    },
    replies: 8,
    lastActivity: "2025-05-20T09:15:00Z"
  },
  {
    id: "3",
    title: "Allaitement et reprise du travail : vos astuces",
    excerpt: "Je reprends le travail dans 3 semaines et j'aimerais continuer à allaiter. Comment avez-vous géré cette transition ?",
    author: {
      name: "Sophie Martin",
      avatar: "/lovable-uploads/7d0b9eea-9e79-427d-8afa-f18467a2a11d.png"
    },
    category: {
      name: "Allaitement",
      slug: "allaitement"
    },
    replies: 15,
    lastActivity: "2025-05-18T16:42:00Z"
  }
];
