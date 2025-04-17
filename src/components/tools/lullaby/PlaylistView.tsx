
import React from 'react';
import { Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Lullaby } from './types';
import { formatTime } from './utils';

interface PlaylistViewProps {
  lullabies: Lullaby[];
  currentIndex: number;
  isPlaying: boolean;
  onSongSelect: (index: number) => void;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  lullabies,
  currentIndex,
  isPlaying,
  onSongSelect,
}) => {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium mb-2">Berceuses</h4>
      {lullabies.map((lullaby, index) => (
        <div 
          key={lullaby.id}
          onClick={() => onSongSelect(index)}
          className={`p-2 rounded-md flex justify-between items-center cursor-pointer hover:bg-accent ${
            index === currentIndex ? 'bg-accent' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            {index === currentIndex && isPlaying ? (
              <Badge variant="default" className="w-6 h-6 flex items-center justify-center p-0 bg-babybaby-cosmic">
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
  );
};

export default PlaylistView;
