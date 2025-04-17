
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const createAudio = () => {
  const audio = new Audio();
  return audio;
};

export const lullabies = [
  { 
    id: 'twinkle', 
    title: 'Twinkle Twinkle Little Star', 
    artist: 'Traditionnel', 
    duration: 135,
    audioSrc: 'https://example.com/audio/twinkle.mp3'
  },
  { 
    id: 'brahms', 
    title: 'Berceuse de Brahms', 
    artist: 'Johannes Brahms', 
    duration: 152,
    audioSrc: 'https://example.com/audio/brahms.mp3'
  },
  { 
    id: 'claire', 
    title: 'Au Clair de la Lune', 
    artist: 'Traditionnel', 
    duration: 118,
    audioSrc: 'https://example.com/audio/claire.mp3'
  },
  { 
    id: 'mozart', 
    title: 'Petite musique de nuit', 
    artist: 'Mozart', 
    duration: 147,
    audioSrc: 'https://example.com/audio/mozart.mp3'
  },
  { 
    id: 'frere', 
    title: 'Frère Jacques', 
    artist: 'Traditionnel', 
    duration: 98,
    audioSrc: 'https://example.com/audio/frere.mp3'
  },
];
