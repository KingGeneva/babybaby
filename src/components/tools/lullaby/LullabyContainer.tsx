
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { defaultLullabies } from './utils';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import LullabyInfo from './LullabyInfo';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import PlaylistView from './PlaylistView';
import ProgressBar from './ProgressBar';

interface LullabyContainerProps {
  className?: string;
}

const LullabyContainer: React.FC<LullabyContainerProps> = ({ className }) => {
  // Utiliser directement les berceuses par défaut au lieu d'essayer de les charger dynamiquement
  const lullabies = defaultLullabies;

  const {
    currentLullabyIndex,
    currentLullaby,
    state,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleMute,
    handleProgressChange,
    handleVolumeChange,
    setCurrentLullabyIndex
  } = useAudioPlayer({
    lullabies: lullabies
  });

  const handleSongSelect = (index: number) => {
    setCurrentLullabyIndex(index);
    if (!state.isPlaying) {
      togglePlayPause();
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
        <LullabyInfo lullaby={currentLullaby} />
        
        <ProgressBar
          currentTime={state.currentTime}
          duration={currentLullaby.duration}
          onProgressChange={handleProgressChange}
        />
        
        <PlayerControls
          state={state}
          onPlayPause={togglePlayPause}
          onPrevious={playPrevious}
          onNext={playNext}
        />
        
        <VolumeControl
          volume={state.volume}
          isMuted={state.isMuted}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={toggleMute}
        />
        
        <PlaylistView
          lullabies={lullabies}
          currentIndex={currentLullabyIndex}
          isPlaying={state.isPlaying}
          onSongSelect={handleSongSelect}
        />
      </CardContent>
    </Card>
  );
};

export default LullabyContainer;
