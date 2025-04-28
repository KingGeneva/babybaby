
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadLullaby } from './utils';
import { LullabyFile } from './types';

interface UploadLullabyProps {
  onUploadComplete?: () => void;
}

const UploadLullaby = ({ onUploadComplete }: UploadLullabyProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const title = file.name.split('.')[0].replace(/-/g, ' ');
      await uploadLullaby(file, { title, artist: 'Traditionnel' });
      
      toast({
        title: 'Berceuse téléversée',
        description: 'Le fichier a été ajouté avec succès',
      });
      
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erreur de téléversement',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="lullaby">Ajouter une berceuse</Label>
        <Input
          id="lullaby"
          type="file"
          accept=".wav,.mp3"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default UploadLullaby;
