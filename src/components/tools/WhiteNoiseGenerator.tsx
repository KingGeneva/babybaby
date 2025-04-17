
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, PauseCircle, PlayCircle, Timer, Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface WhiteNoiseProps {
  className?: string;
}

type SoundType = 'white' | 'pink' | 'brown' | 'rain' | 'ocean' | 'fan';

interface Sound {
  type: SoundType;
  name: string;
  description: string;
}

const sounds: Sound[] = [
  { type: 'white', name: 'Bruit blanc', description: 'Fréquence équilibrée, idéal pour masquer les bruits' },
  { type: 'pink', name: 'Bruit rose', description: 'Plus doux que le bruit blanc, fréquences graves accentuées' },
  { type: 'brown', name: 'Bruit brun', description: 'Très calme avec beaucoup de graves, comme un grondement' },
  { type: 'rain', name: 'Pluie', description: 'Sons apaisants de pluie légère' },
  { type: 'ocean', name: 'Océan', description: 'Vagues douces et régulières' },
  { type: 'fan', name: 'Ventilateur', description: 'Bruit constant d\'un ventilateur' },
];

const WhiteNoiseGenerator: React.FC<WhiteNoiseProps> = ({ className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [soundType, setSoundType] = useState<SoundType>('white');
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [remainingTime, setRemainingTime] = useState(30 * 60); // en secondes
  
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const noiseSource = useRef<AudioBufferSourceNode | null>(null);
  const timerInterval = useRef<number | null>(null);
  const audioBuffers = useRef<Record<SoundType, AudioBuffer | null>>({
    white: null,
    pink: null,
    brown: null,
    rain: null,
    ocean: null,
    fan: null,
  });
  
  // Initialisation de l'audio context
  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNode.current = audioContext.current.createGain();
    gainNode.current.connect(audioContext.current.destination);
    
    // Préchargement des sons
    const loadSoundBuffer = async (type: SoundType) => {
      // Dans un vrai projet, ces sons seraient stockés dans des fichiers
      // Pour cette démo, on génère le son en JavaScript
      
      const ctx = audioContext.current!;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(2, 2 * sampleRate, sampleRate);
      
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        
        if (type === 'white') {
          // Bruit blanc - distribution uniforme
          for (let i = 0; i < channelData.length; i++) {
            channelData[i] = Math.random() * 2 - 1;
          }
        } else if (type === 'pink') {
          // Bruit rose - approximation avec filtres
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          
          for (let i = 0; i < channelData.length; i++) {
            const white = Math.random() * 2 - 1;
            
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            
            channelData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            channelData[i] *= 0.11; // ajustement du volume
            
            b6 = white * 0.115926;
          }
        } else if (type === 'brown') {
          // Bruit brun - intégration simple
          let lastOut = 0;
          
          for (let i = 0; i < channelData.length; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + (0.02 * white)) / 1.02;
            channelData[i] = lastOut * 3.5; // ajustement du volume
          }
        } else if (type === 'rain') {
          // Pluie - modulation du bruit blanc
          for (let i = 0; i < channelData.length; i++) {
            const phase = i / channelData.length;
            const intensity = 0.7 + 0.3 * Math.sin(phase * Math.PI * 20);
            channelData[i] = (Math.random() * 2 - 1) * intensity * 0.7;
          }
        } else if (type === 'ocean') {
          // Océan - modulation lente du bruit blanc
          for (let i = 0; i < channelData.length; i++) {
            const phase = i / channelData.length;
            const wave = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2);
            channelData[i] = (Math.random() * 2 - 1) * (0.4 + 0.6 * wave);
          }
        } else if (type === 'fan') {
          // Ventilateur - bruit blanc filtré
          let lastOut = 0;
          
          for (let i = 0; i < channelData.length; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + (0.1 * white)) / 1.1;
            channelData[i] = lastOut * 2 + white * 0.2;
          }
        }
      }
      
      audioBuffers.current[type] = buffer;
    };
    
    // Charger tous les types de son
    Promise.all(sounds.map(sound => loadSoundBuffer(sound.type)));
    
    // Nettoyage
    return () => {
      if (noiseSource.current) {
        noiseSource.current.stop();
      }
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, []);
  
  // Gérer les changements de volume
  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume / 100;
    }
  }, [volume]);
  
  // Gérer la minuterie
  useEffect(() => {
    if (timerActive && isPlaying) {
      setRemainingTime(timerMinutes * 60);
      
      timerInterval.current = window.setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            stopSound();
            setTimerActive(false);
            clearInterval(timerInterval.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [timerActive, timerMinutes, isPlaying]);
  
  const playSound = () => {
    if (audioContext.current && gainNode.current && audioBuffers.current[soundType]) {
      // Réactiver le contexte audio si suspendu
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
      
      // Arrêter le son précédent s'il est en cours
      if (noiseSource.current) {
        noiseSource.current.stop();
      }
      
      // Créer une nouvelle source
      noiseSource.current = audioContext.current.createBufferSource();
      noiseSource.current.buffer = audioBuffers.current[soundType];
      noiseSource.current.loop = true;
      noiseSource.current.connect(gainNode.current);
      
      // Appliquer le volume
      gainNode.current.gain.value = volume / 100;
      
      // Démarrer la lecture
      noiseSource.current.start();
      setIsPlaying(true);
    }
  };
  
  const stopSound = () => {
    if (noiseSource.current) {
      noiseSource.current.stop();
      setIsPlaying(false);
      
      // Arrêter la minuterie si active
      if (timerActive && timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    }
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      stopSound();
    } else {
      playSound();
    }
  };
  
  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSoundTypeChange = (value: SoundType) => {
    setSoundType(value);
    if (isPlaying) {
      stopSound();
      setTimeout(() => {
        playSound();
      }, 50);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Générateur de Bruit Blanc
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center py-8">
          <Button 
            variant="ghost" 
            size="lg" 
            className="h-24 w-24 rounded-full border-2" 
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <PauseCircle className="h-12 w-12 text-babybaby-cosmic" />
            ) : (
              <PlayCircle className="h-12 w-12 text-babybaby-cosmic" />
            )}
          </Button>
        </div>
        
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Volume</Label>
              <span>{volume}%</span>
            </div>
            <Slider 
              value={[volume]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(values) => setVolume(values[0])}
              className="cursor-pointer"
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Type de son</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sounds.map(sound => (
                <Button
                  key={sound.type}
                  variant={soundType === sound.type ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleSoundTypeChange(sound.type)}
                >
                  {sound.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Minuterie
              </Label>
              
              <Button
                variant={timerActive ? "default" : "outline"}
                size="sm"
                onClick={toggleTimer}
                disabled={!isPlaying}
              >
                {timerActive ? "Activée" : "Désactivée"}
              </Button>
            </div>
            
            {timerActive && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Durée</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(remainingTime)}
                  </Badge>
                </div>
                <Slider
                  value={[timerMinutes]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={values => setTimerMinutes(values[0])}
                  className="cursor-pointer"
                  disabled={isPlaying}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 min</span>
                  <span>120 min</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-2 text-center text-sm text-muted-foreground">
          <p>Le bruit blanc aide votre bébé à s'endormir en masquant les bruits extérieurs</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhiteNoiseGenerator;
