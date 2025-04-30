
import { Lullaby, LullabyFile } from './types';

// Default lullabies list
export const defaultLullabies: Lullaby[] = [
  {
    id: "lullaby-1",
    title: "Douce Nuit",
    artist: "Traditionnel",
    duration: 180,
    audioSrc: "/audio/douce-nuit.mp3",
    fileType: "mp3" as "mp3"
  },
  {
    id: "lullaby-2",
    title: "Au Clair de la Lune",
    artist: "Traditionnel",
    duration: 150,
    audioSrc: "/audio/au-clair-de-la-lune.mp3",
    fileType: "mp3" as "mp3"
  },
  {
    id: "lullaby-3",
    title: "Berceuse de Brahms",
    artist: "Johannes Brahms",
    duration: 210,
    audioSrc: "/audio/brahms-lullaby.mp3",
    fileType: "mp3" as "mp3"
  },
  {
    id: "lullaby-4",
    title: "La Chanson du Vent",
    artist: "Nature Sounds",
    duration: 240,
    audioSrc: "/audio/chanson-du-vent.mp3",
    fileType: "mp3" as "mp3"
  }
];

// Create an audio element
export const createAudio = (): HTMLAudioElement => {
  console.log('Creating new audio element');
  const audio = new Audio();
  return audio;
};

// Format time in minutes:seconds
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
