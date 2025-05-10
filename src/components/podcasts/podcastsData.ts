
import { Podcast } from './types';

export const podcastsData: Podcast[] = [
  {
    id: "pod-001",
    title: "Favoriser le sommeil de bébé",
    description: "Comment aider votre bébé à mieux dormir la nuit? Nos experts partagent leurs conseils et astuces pour établir une routine de sommeil efficace.",
    coverImage: "/lovable-uploads/2b2ef526-b96a-4319-a022-120bb0d2ca28.png",
    audioUrl: "https://cdn.freesound.org/previews/612/612074_7627547-lq.mp3",
    duration: "23:15",
    date: "2024-05-01",
    author: "Dr. Sophie Martin & Marie Dupont",
    category: "Sommeil",
    tags: ["sommeil", "routine", "coucher", "nuit"]
  },
  {
    id: "pod-002",
    title: "L'alimentation pendant la grossesse",
    description: "Tout ce que vous devez savoir sur la nutrition pendant la grossesse. Quels aliments favoriser et lesquels éviter?",
    coverImage: "/lovable-uploads/1c4b2b97-74e7-4e2c-b126-915c3aba4bf8.png",
    audioUrl: "https://cdn.freesound.org/previews/612/612092_3276067-lq.mp3",
    duration: "31:42",
    date: "2024-04-15",
    author: "Dr. Émilie Rousseau",
    category: "Grossesse",
    tags: ["grossesse", "nutrition", "alimentation", "santé"]
  },
  {
    id: "pod-003",
    title: "Bain de bébé : astuces et conseils",
    description: "Comment rendre le moment du bain agréable pour votre bébé et pour vous? Découvrez nos conseils pratiques.",
    coverImage: "/lovable-uploads/a6e4664e-9f3d-463c-8865-99ac1cf3ae70.png",
    audioUrl: "https://cdn.freesound.org/previews/612/612026_1648170-lq.mp3",
    duration: "18:30",
    date: "2024-04-22",
    author: "Dr. Marie Lambert",
    category: "Soins",
    tags: ["bain", "hygiène", "soins quotidiens", "routine"]
  }
];
