
import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioPlayerState } from './types';

interface PlayerControlsProps {
  state: AudioPlayerState;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  state,
  onPlayPause,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex justify-center items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onPrevious}
      >
        <SkipBack className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="default" 
        size="icon"
        className="h-12 w-12 rounded-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
        onClick={onPlayPause}
      >
        {state.isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onNext}
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default PlayerControls;
