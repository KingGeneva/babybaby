
import { Lullaby } from './types';

// Liste des berceuses par défaut
export const lullabies: Lullaby[] = [
  {
    id: "lullaby-1",
    title: "Douce Nuit",
    artist: "Traditionnel",
    duration: 180,
    audioSrc: "/audio/douce-nuit.mp3",
    fileType: "mp3"
  },
  {
    id: "lullaby-2",
    title: "Au Clair de la Lune",
    artist: "Traditionnel",
    duration: 150,
    audioSrc: "/audio/au-clair-de-la-lune.mp3",
    fileType: "mp3"
  },
  {
    id: "lullaby-3",
    title: "Berceuse de Brahms",
    artist: "Johannes Brahms",
    duration: 210,
    audioSrc: "/audio/brahms-lullaby.mp3",
    fileType: "mp3"
  },
  {
    id: "lullaby-4",
    title: "La Chanson du Vent",
    artist: "Nature Sounds",
    duration: 240,
    audioSrc: "/audio/chanson-du-vent.mp3",
    fileType: "mp3"
  }
];

// Fonction pour récupérer les berceuses depuis le stockage local ou utiliser les défauts
export const getLullabies = async (): Promise<Lullaby[]> => {
  try {
    const storedLullabies = localStorage.getItem('custom-lullabies');
    if (storedLullabies) {
      const parsed = JSON.parse(storedLullabies) as Lullaby[];
      return [...lullabies, ...parsed];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des berceuses personnalisées:', error);
  }
  
  return lullabies;
};

// Fonction pour créer un élément audio
export const createAudio = (): HTMLAudioElement => {
  const audio = new Audio();
  return audio;
};

// Fonction pour formater le temps en minutes:secondes
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
