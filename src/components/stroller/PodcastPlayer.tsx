
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, PauseCircle, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface PodcastPlayerProps {
  audioSrc: string;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audio] = useState(() => {
    const audioElement = new Audio();
    // Éviter les problèmes de CORS et les erreurs fatales de chargement
    audioElement.addEventListener('error', (e) => {
      console.error("Erreur de chargement audio:", e);
      toast.error("Le fichier audio est indisponible", {
        description: "Nous n'avons pas pu charger l'audio. Il sera disponible prochainement."
      });
      setAudioLoaded(false);
    });
    
    audioElement.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    
    // Essayer de charger l'audio
    try {
      audioElement.src = audioSrc;
      audioElement.load();
    } catch (error) {
      console.error("Erreur lors de l'initialisation audio:", error);
    }
    
    return audioElement;
  });
  
  const togglePlayPause = () => {
    if (!audioLoaded) {
      toast.error("Audio non disponible", { 
        description: "L'enregistrement audio n'a pas pu être chargé." 
      });
      return;
    }
    
    if (isPlaying) {
      audio.pause();
    } else {
      // Utilisation de catch pour gérer les erreurs de lecture
      audio.play().catch(error => {
        console.error("Erreur lors de la lecture audio:", error);
        toast.error("Impossible de lire l'audio", {
          description: "Une erreur s'est produite lors de la lecture. Veuillez réessayer plus tard."
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Clean up audio on component unmount
  useEffect(() => {
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      // Bonne pratique : libérer les ressources
      audio.src = '';
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
                {audioLoaded ? "Écouter le segment du podcast" : "Audio bientôt disponible"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PodcastPlayer;
