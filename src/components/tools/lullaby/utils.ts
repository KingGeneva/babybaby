
import { supabase } from '@/integrations/supabase/client';
import { Lullaby } from './types';

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const createAudio = () => {
  const audio = new Audio();
  return audio;
};

export const uploadLullaby = async (file: File, metadata: { title: string; artist: string }) => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !['wav', 'mp3'].includes(fileExt)) {
    throw new Error('Format de fichier non supporté. Utilisez WAV ou MP3.');
  }

  const fileName = `${metadata.title.toLowerCase().replace(/\s+/g, '-')}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('lullabies')
    .upload(fileName, file, {
      upsert: true,
      contentType: `audio/${fileExt}`,
      cacheControl: '3600',
    });

  if (error) throw error;
  return data;
};

export const getLullabies = async (): Promise<Lullaby[]> => {
  const { data: files, error } = await supabase.storage
    .from('lullabies')
    .list();

  if (error) throw error;

  return files.map(file => ({
    id: file.id,
    title: file.name.split('.')[0].replace(/-/g, ' '),
    artist: 'Traditionnel',
    duration: 120, // Default duration, would need to be extracted from file metadata
    audioSrc: supabase.storage.from('lullabies').getPublicUrl(file.name).data.publicUrl,
    fileType: file.name.split('.').pop() as 'wav' | 'mp3'
  }));
};

// Default lullabies for when no files are uploaded
export const lullabies: Lullaby[] = [
  { 
    id: 'twinkle', 
    title: 'Twinkle Twinkle Little Star', 
    artist: 'Traditionnel', 
    duration: 135,
    audioSrc: 'https://example.com/audio/twinkle.mp3',
    fileType: 'mp3'
  },
  { 
    id: 'brahms', 
    title: 'Berceuse de Brahms', 
    artist: 'Johannes Brahms', 
    duration: 152,
    audioSrc: 'https://example.com/audio/brahms.mp3',
    fileType: 'mp3'
  },
  { 
    id: 'claire', 
    title: 'Au Clair de la Lune', 
    artist: 'Traditionnel', 
    duration: 118,
    audioSrc: 'https://example.com/audio/claire.mp3',
    fileType: 'mp3'
  },
  { 
    id: 'mozart', 
    title: 'Petite musique de nuit', 
    artist: 'Mozart', 
    duration: 147,
    audioSrc: 'https://example.com/audio/mozart.mp3',
    fileType: 'mp3'
  },
  { 
    id: 'frere', 
    title: 'Frère Jacques', 
    artist: 'Traditionnel', 
    duration: 98,
    audioSrc: 'https://example.com/audio/frere.mp3',
    fileType: 'mp3'
  }
];
