
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, PauseCircle, Volume2 } from 'lucide-react';

interface PodcastPlayerProps {
  audioSrc: string;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(audioSrc));
  
  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Erreur lors de la lecture audio:", error);
        console.log("Nom du fichier audio:", audio.src);
        console.log("État de l'audio:", audio.readyState);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Clean up audio on component unmount
  useEffect(() => {
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.pause();
    };
  }, [audio]);

  return (
    <Card className="bg-gradient-to-r from-babybaby-cosmic/10 to-purple-100 mb-8">
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-shrink-0">
          <Volume2 className="h-10 w-10 text-babybaby-cosmic" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium mb-1">Podcast BabyBaby</h3>
          <p className="text-sm text-gray-600 mb-2">Écoutez notre segment audio dédié à ce sujet</p>
          <Button 
            onClick={togglePlayPause}
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <PauseCircle className="h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="h-5 w-5" />
                Écouter le segment du podcast
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PodcastPlayer;
