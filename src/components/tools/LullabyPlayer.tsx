import React, { useState, useEffect, useRef } from 'react';
import { Music, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { lullabies, getLullabies, createAudio } from './lullaby/utils';
import PlayerControls from './lullaby/PlayerControls';
import VolumeControl from './lullaby/VolumeControl';
import PlaylistView from './lullaby/PlaylistView';
import ProgressBar from './lullaby/ProgressBar';
import UploadLullaby from './lullaby/UploadLullaby';
import { Lullaby } from './lullaby/types';
import { useQuery } from '@tanstack/react-query';

interface LullabyPlayerProps {
  className?: string;
}

const LullabyPlayer: React.FC<LullabyPlayerProps> = ({ className }) => {
  const [currentLullabyIndex, setCurrentLullabyIndex] = useState(0);
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

  const { data: storedLullabies, refetch } = useQuery({
    queryKey: ['lullabies'],
    queryFn: getLullabies,
    initialData: lullabies
  });

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

  const handleSongSelect = (index: number) => {
    setCurrentLullabyIndex(index);
    setCurrentTime(0);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Lecteur de Berceuses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <h3 className="text-lg font-medium">{currentLullaby.title}</h3>
          <p className="text-sm text-muted-foreground">{currentLullaby.artist}</p>
        </div>
        
        <ProgressBar
          currentTime={currentTime}
          duration={currentLullaby.duration}
          onProgressChange={handleProgressChange}
        />
        
        <PlayerControls
          state={{ isPlaying, currentTime, volume, isMuted, isLooping }}
          onPlayPause={togglePlayPause}
          onPrevious={playPrevious}
          onNext={playNext}
        />
        
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={toggleMute}
        />
        
        <PlaylistView
          lullabies={storedLullabies}
          currentIndex={currentLullabyIndex}
          isPlaying={isPlaying}
          onSongSelect={handleSongSelect}
        />

        <UploadLullaby onUploadComplete={refetch} />
      </CardContent>
    </Card>
  );
};

export default LullabyPlayer;
