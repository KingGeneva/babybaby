
import { DiscussionProps } from '../components/DiscussionCard';

// Sample data for forum discussions
export const mockDiscussions: DiscussionProps[] = [
  {
    id: 1,
    title: "Comment gérer les coliques nocturnes",
    excerpt: "Mon bébé de 2 mois souffre de coliques pendant la nuit. Quelles astuces avez-vous trouvées efficaces ?",
    author: "MamanFatiguée",
    comments: 24,
    likes: 18,
    tags: ["Santé", "Sommeil", "0-3 mois"],
    lastActive: "Il y a 2h"
  },
  {
    id: 2,
    title: "Meilleurs livres pour enfants de 18 mois",
    excerpt: "Je cherche des recommandations de livres adaptés pour ma fille qui commence à s'intéresser aux histoires.",
    author: "Papa_Lecteur",
    comments: 15,
    likes: 27,
    tags: ["Développement", "Livres", "12-24 mois"],
    lastActive: "Il y a 6h"
  },
  {
    id: 3,
    title: "Voyage en avion avec un nourrisson",
    excerpt: "Nous prévoyons un vol long-courrier avec notre bébé de 5 mois. Des conseils pour que ça se passe bien ?",
    author: "FamilleVoyageuse",
    comments: 32,
    likes: 41,
    tags: ["Voyage", "Conseils", "3-6 mois"],
    lastActive: "Il y a 1j"
  }
];
