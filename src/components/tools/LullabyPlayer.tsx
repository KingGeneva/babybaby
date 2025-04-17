
import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface Lullaby {
  id: string;
  title: string;
  artist: string;
  duration: number; // en secondes
}

interface LullabyPlayerProps {
  className?: string;
}

const lullabies: Lullaby[] = [
  { id: 'twinkle', title: 'Twinkle Twinkle Little Star', artist: 'Traditionnel', duration: 135 },
  { id: 'brahms', title: 'Berceuse de Brahms', artist: 'Johannes Brahms', duration: 152 },
  { id: 'claire', title: 'Au Clair de la Lune', artist: 'Traditionnel', duration: 118 },
  { id: 'mozart', title: 'Petite musique de nuit', artist: 'Mozart', duration: 147 },
  { id: 'frere', title: 'Frère Jacques', artist: 'Traditionnel', duration: 98 },
];

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
  
  const currentLullaby = lullabies[currentLullabyIndex];

  // Initialiser l'audio
  useEffect(() => {
    // Dans une application réelle, nous utiliserions de vrais fichiers audio
    // Pour cette démo, nous simulons l'audio avec l'API Web Audio
    
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);
  
  // Gérer la fin de la lecture
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
  
  // Simulation de la lecture audio (dans un projet réel, ceci serait géré par l'événement 'timeupdate' de l'audio)
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentLullaby.duration) {
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
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
  }, [isPlaying, currentLullaby]);
  
  // Gérer les changements de volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  const togglePlayPause = () => {
    // Dans un vrai lecteur, nous démarrerions ou arrêterions la lecture audio réelle
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
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
  };
  
  const handleProgressChange = (values: number[]) => {
    setCurrentTime(values[0]);
    // Dans un vrai lecteur, nous changerions également la position de lecture audio
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        {/* Informations sur la berceuse */}
        <div className="text-center py-4">
          <h3 className="text-lg font-medium">{currentLullaby.title}</h3>
          <p className="text-sm text-muted-foreground">{currentLullaby.artist}</p>
        </div>
        
        {/* Barre de progression */}
        <div className="space-y-2">
          <Slider 
            value={[currentTime]} 
            min={0} 
            max={currentLullaby.duration} 
            step={1}
            onValueChange={handleProgressChange}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentLullaby.duration)}</span>
          </div>
        </div>
        
        {/* Contrôles de lecture */}
        <div className="flex justify-center items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={playPrevious}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={playNext}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Contrôles de volume */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider 
              className="flex-1" 
              value={[volume]} 
              min={0} 
              max={100} 
              step={1} 
              onValueChange={values => {
                setVolume(values[0]);
                setIsMuted(values[0] === 0);
              }} 
            />
          </div>
        </div>
        
        {/* Liste des berceuses */}
        <div className="space-y-1 pt-4">
          <h4 className="text-sm font-medium mb-2">Berceuses</h4>
          {lullabies.map((lullaby, index) => (
            <div 
              key={lullaby.id}
              onClick={() => {
                setCurrentLullabyIndex(index);
                setCurrentTime(0);
                if (!isPlaying) {
                  setIsPlaying(true);
                }
              }}
              className={`p-2 rounded-md flex justify-between items-center cursor-pointer hover:bg-accent ${
                index === currentLullabyIndex ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {index === currentLullabyIndex && isPlaying ? (
                  <Badge variant="default" className="w-6 h-6 flex items-center justify-center p-0">
                    <Pause className="h-3 w-3" />
                  </Badge>
                ) : (
                  <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                    {index + 1}
                  </Badge>
                )}
                <div>
                  <p className="text-sm font-medium leading-none">{lullaby.title}</p>
                  <p className="text-xs text-muted-foreground">{lullaby.artist}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{formatTime(lullaby.duration)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LullabyPlayer;
