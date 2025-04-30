
import { Lullaby, LullabyFile } from './types';

// Default lullabies list
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

// Get lullabies from local storage or use defaults
export const getLullabies = async (): Promise<Lullaby[]> => {
  try {
    // Log that we're trying to get lullabies
    console.log('Trying to get custom lullabies from localStorage');
    
    const storedLullabies = localStorage.getItem('custom-lullabies');
    if (storedLullabies) {
      console.log('Found custom lullabies:', storedLullabies);
      const parsed = JSON.parse(storedLullabies) as Lullaby[];
      // Combine default lullabies with custom ones
      return [...lullabies, ...parsed];
    } else {
      console.log('No custom lullabies found, using defaults');
    }
  } catch (error) {
    console.error('Error retrieving custom lullabies:', error);
  }
  
  return lullabies;
};

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

// Upload a lullaby
export const uploadLullaby = async (file: File, metadata: { title: string, artist: string }): Promise<void> => {
  try {
    console.log('Uploading lullaby:', file.name);
    
    // Create a URL for the audio file
    const audioUrl = URL.createObjectURL(file);
    console.log('Created URL:', audioUrl);
    
    // Get file type
    const fileType = file.name.toLowerCase().endsWith('.wav') ? 'wav' : 'mp3';
    
    // Create a new lullaby object
    const newLullaby: Lullaby = {
      id: `custom-${Date.now()}`,
      title: metadata.title || file.name.split('.')[0],
      artist: metadata.artist || 'Personnalisé',
      duration: 180, // Default duration until we can determine it
      audioSrc: audioUrl,
      fileType: fileType
    };

    console.log('Created lullaby object:', newLullaby);

    // Create an Audio element to get the duration
    const audio = new Audio(audioUrl);
    
    await new Promise<void>((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        console.log('Audio metadata loaded, duration:', audio.duration);
        if (audio.duration !== Infinity) {
          newLullaby.duration = audio.duration;
        }
        resolve();
      });
      
      // Handle errors or if metadata can't be loaded
      audio.addEventListener('error', (e) => {
        console.error('Failed to load audio metadata:', e);
        resolve();
      });
      
      // Set a timeout in case the metadata never loads
      setTimeout(() => {
        console.log('Metadata loading timed out');
        resolve();
      }, 3000);
    });
    
    // Save to local storage
    const storedLullabies = localStorage.getItem('custom-lullabies');
    let customLullabies: Lullaby[] = [];
    
    if (storedLullabies) {
      customLullabies = JSON.parse(storedLullabies);
    }
    
    customLullabies.push(newLullaby);
    localStorage.setItem('custom-lullabies', JSON.stringify(customLullabies));
    console.log('Saved lullaby to localStorage, total custom:', customLullabies.length);
    
  } catch (error) {
    console.error('Error uploading lullaby:', error);
    throw new Error('Failed to upload lullaby');
  }
};
