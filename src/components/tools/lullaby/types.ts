
export interface Lullaby {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioSrc: string;
}

export interface AudioPlayerState {
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
}
