
export interface Lullaby {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioSrc: string;
  fileType: 'wav' | 'mp3';
}

export interface AudioPlayerState {
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
}

export interface LullabyFile {
  name: string;
  artist: string;
  file: File;
}
