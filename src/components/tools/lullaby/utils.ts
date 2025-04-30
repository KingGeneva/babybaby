
import { Lullaby, LullabyFile } from './types';
import { supabase } from '@/integrations/supabase/client';

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

// Get lullabies from Supabase Storage or use defaults
export const getLullabies = async (): Promise<Lullaby[]> => {
  try {
    // Log that we're trying to get lullabies
    console.log('Trying to get lullabies from Supabase Storage');
    
    // Fetch list of files from the lullabies bucket
    const { data: files, error } = await supabase
      .storage
      .from('lullabies')
      .list();
      
    if (error) {
      console.error('Error retrieving lullabies from storage:', error);
      return defaultLullabies;
    }
    
    if (!files || files.length === 0) {
      console.log('No custom lullabies found, using defaults');
      return defaultLullabies;
    }
    
    // Filter for audio files
    const audioFiles = files.filter(file => 
      file.name.endsWith('.mp3') || file.name.endsWith('.wav')
    );
    
    if (audioFiles.length === 0) {
      return defaultLullabies;
    }
    
    // Create signed URLs for each audio file
    const customLullabies = await Promise.all(audioFiles.map(async (file) => {
      // Get public URL for the file
      const { data: urlData } = await supabase
        .storage
        .from('lullabies')
        .createSignedUrl(file.name, 3600); // valid for 1 hour
      
      const title = file.name.split('.')[0].replace(/-/g, ' ');
      const fileExtension = file.name.split('.').pop() as 'mp3' | 'wav';
      
      // Create lullaby object
      return {
        id: `custom-${file.id}`,
        title: title.charAt(0).toUpperCase() + title.slice(1), // Capitalize first letter
        artist: "Personnalisé",
        duration: 180, // Default duration
        audioSrc: urlData?.signedUrl || '',
        fileType: fileExtension
      };
    }));
    
    // Combine default and custom lullabies
    return [...defaultLullabies, ...customLullabies];
  } catch (error) {
    console.error('Error retrieving custom lullabies:', error);
    return defaultLullabies;
  }
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

// Upload a lullaby to Supabase Storage
export const uploadLullaby = async (file: File, metadata: { title: string, artist: string }): Promise<void> => {
  try {
    console.log('Uploading lullaby to Supabase Storage:', file.name);
    
    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase
      .storage
      .from('lullabies')
      .upload(fileName, file);
      
    if (error) throw error;
    
    console.log('Lullaby uploaded successfully:', fileName);
  } catch (error) {
    console.error('Error uploading lullaby:', error);
    throw new Error('Failed to upload lullaby');
  }
};

// Get a list of admin uploadable lullabies for the admin interface
export const getAdminLullabies = async (): Promise<Array<{name: string, url: string}>> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('lullabies')
      .list();
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Get public URLs for each file
    return await Promise.all(data.map(async (item) => {
      const { data: urlData } = await supabase
        .storage
        .from('lullabies')
        .createSignedUrl(item.name, 3600);
        
      return {
        name: item.name,
        url: urlData?.signedUrl || ''
      };
    }));
  } catch (error) {
    console.error('Error getting admin lullabies:', error);
    return [];
  }
};

// Delete a lullaby from Supabase Storage
export const deleteLullaby = async (fileName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .storage
      .from('lullabies')
      .remove([fileName]);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting lullaby:', error);
    return false;
  }
};
