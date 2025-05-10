
import React, { useState, useRef, useEffect } from 'react';
import { Podcast } from './types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PodcastPlayerProps {
  podcast: Podcast;
  onEnded?: () => void;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast, onEnded }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(podcast.audioUrl);
    audioRef.current = audio;
    
    audio.volume = volume;
    audio.muted = isMuted;
    
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setError("Impossible de charger l'audio. Veuillez réessayer.");
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [podcast.audioUrl, onEnded]);
  
  // Update volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Erreur de lecture:", err);
          setIsPlaying(false);
        });
        
        // Start progress tracking
        progressIntervalRef.current = window.setInterval(() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }, 1000);
      } else {
        audioRef.current.pause();
        
        // Stop progress tracking
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);
  
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  const handleProgressChange = (values: number[]) => {
    if (audioRef.current) {
      const newTime = values[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    
    // If volume is set to 0, mute; if it's increased from 0, unmute
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };
  
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15);
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const restart = () => {
    if (audioRef.current) {
      setError(null);
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.error("Erreur lors du redémarrage:", err);
        setError("Impossible de lire l'audio. Veuillez réessayer.");
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <img 
          src={podcast.coverImage}
          alt={podcast.title}
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
        <div>
          <h3 className="font-bold">{podcast.title}</h3>
          <p className="text-sm text-gray-500">{podcast.author}</p>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 flex items-center gap-1"
            onClick={restart}
          >
            <RefreshCw className="h-3 w-3" /> Réessayer
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-babybaby-cosmic"></div>
          <span className="ml-2 text-sm">Chargement...</span>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mb-2">
            <Slider
              defaultValue={[0]}
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleProgressChange}
              className="mb-1"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full p-2" 
                onClick={skipBackward}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                className={cn(
                  "rounded-full h-10 w-10 flex items-center justify-center bg-babybaby-cosmic hover:bg-babybaby-cosmic/90",
                )}
                onClick={togglePlayPause}
              >
                {isPlaying ? 
                  <Pause className="h-5 w-5" /> : 
                  <Play className="h-5 w-5 ml-0.5" />
                }
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full p-2" 
                onClick={skipForward}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 w-24">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1" 
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? 
                  <VolumeX className="h-4 w-4" /> : 
                  <Volume2 className="h-4 w-4" />
                }
              </Button>
              
              <Slider 
                defaultValue={[0.8]} 
                value={[volume]} 
                max={1} 
                step={0.01} 
                onValueChange={handleVolumeChange} 
                className="w-16" 
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PodcastPlayer;
