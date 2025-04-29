
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Lullaby, AudioPlayerState } from '../types';
import { createAudio } from '../utils';

interface UseAudioPlayerProps {
  lullabies: Lullaby[];
  initialLullabyIndex?: number;
}

interface UseAudioPlayerReturn {
  currentLullabyIndex: number;
  setCurrentLullabyIndex: React.Dispatch<React.SetStateAction<number>>;
  currentLullaby: Lullaby;
  state: AudioPlayerState;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleMute: () => void;
  handleProgressChange: (newTime: number) => void;
  handleVolumeChange: (newVolume: number) => void;
}

export const useAudioPlayer = ({ 
  lullabies,
  initialLullabyIndex = 0
}: UseAudioPlayerProps): UseAudioPlayerReturn => {
  const [currentLullabyIndex, setCurrentLullabyIndex] = useState(initialLullabyIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);
  const previousVolume = useRef(volume);
  const { toast } = useToast();

  const currentLullaby = lullabies[currentLullabyIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = createAudio();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);
  
  useEffect(() => {
    const handleEnded = () => {
      if (isLooping) {
        playNext();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [isLooping]);
  
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentLullaby.duration) {
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
            }
            if (isLooping) {
              playNext();
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentLullaby, isLooping]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentLullaby.audioSrc;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Erreur lors de la lecture:", err);
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lire la berceuse, veuillez réessayer.",
            variant: "destructive"
          });
          setIsPlaying(false);
        });
      }
    }
  }, [currentLullabyIndex]);
  
  const togglePlayPause = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Erreur lors de la lecture:", err);
        });
      }
    }
    setIsPlaying(!isPlaying);
    
    toast({
      title: isPlaying ? "Berceuse mise en pause" : "Berceuse en cours de lecture",
      description: isPlaying 
        ? "La lecture a été mise en pause" 
        : `"${currentLullaby.title}" est en cours de lecture`,
    });
  };
  
  const playNext = () => {
    setCurrentTime(0);
    setCurrentLullabyIndex(prev => (prev + 1) % lullabies.length);
  };
  
  const playPrevious = () => {
    setCurrentTime(0);
    setCurrentLullabyIndex(prev => (prev - 1 + lullabies.length) % lullabies.length);
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setVolume(0);
    }
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Son activé" : "Son désactivé",
      description: isMuted 
        ? "Le volume a été rétabli" 
        : "Le son a été coupé",
    });
  };
  
  const handleProgressChange = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  return {
    currentLullabyIndex,
    setCurrentLullabyIndex,
    currentLullaby,
    state: { isPlaying, currentTime, volume, isMuted, isLooping },
    togglePlayPause,
    playNext,
    playPrevious,
    toggleMute,
    handleProgressChange,
    handleVolumeChange
  };
};
