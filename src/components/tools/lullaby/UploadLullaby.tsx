
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';
import { uploadLullaby } from './utils';

const UploadLullaby: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier audio",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      await uploadLullaby(audioFile, { title, artist });
      
      setTitle('');
      setArtist('');
      setAudioFile(null);
      
      toast({
        title: "Succès",
        description: "La berceuse a été téléchargée avec succès",
      });
    } catch (error) {
      console.error('Error uploading lullaby:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du téléchargement de la berceuse",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Ajouter une berceuse</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la berceuse"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="artist">Artiste</Label>
          <Input
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artiste ou créateur"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="audioFile">Fichier audio (MP3, WAV)</Label>
          <Input
            id="audioFile"
            type="file"
            accept=".mp3,.wav"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        
        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Téléversement...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Ajouter la berceuse
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default UploadLullaby;
