
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Upload, Play, Pause } from 'lucide-react';
import { uploadLullaby, getAdminLullabies, deleteLullaby } from '@/components/tools/lullaby/utils';

interface LullabyItem {
  name: string;
  url: string;
}

const AdminLullabiesTab = () => {
  const [lullabies, setLullabies] = useState<LullabyItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio] = useState(new Audio());
  const { toast } = useToast();

  // Load existing lullabies
  useEffect(() => {
    fetchLullabies();
  }, []);

  // Stop audio on component unmount
  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  const fetchLullabies = async () => {
    setIsLoading(true);
    try {
      const items = await getAdminLullabies();
      setLullabies(items);
    } catch (error) {
      console.error('Error fetching lullabies:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les berceuses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier audio',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      await uploadLullaby(audioFile, { title, artist });
      
      // Reset form
      setTitle('');
      setArtist('');
      setAudioFile(null);
      
      // Refresh list
      await fetchLullabies();
      
      toast({
        title: 'Succès',
        description: 'La berceuse a été ajoutée avec succès',
      });
    } catch (error) {
      console.error('Error uploading lullaby:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'upload',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePlayPause = (lullaby: LullabyItem) => {
    if (playing === lullaby.name) {
      audio.pause();
      setPlaying(null);
    } else {
      audio.src = lullaby.url;
      audio.play();
      setPlaying(lullaby.name);
      
      // Add event listener for when audio ends
      audio.onended = () => {
        setPlaying(null);
      };
    }
  };

  const handleDelete = async (lullaby: LullabyItem) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette berceuse ?')) {
      try {
        // Stop playing if it's the current track
        if (playing === lullaby.name) {
          audio.pause();
          setPlaying(null);
        }
        
        await deleteLullaby(lullaby.name);
        
        // Refresh list
        await fetchLullabies();
        
        toast({
          title: 'Succès',
          description: 'La berceuse a été supprimée',
        });
      } catch (error) {
        console.error('Error deleting lullaby:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer la berceuse',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle berceuse</CardTitle>
        </CardHeader>
        <CardContent>
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
            
            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> 
                  Téléversement...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> 
                  Ajouter la berceuse
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Lullabies List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Liste des berceuses ({lullabies.length})</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-babybaby-cosmic mx-auto"></div>
            <p className="mt-2">Chargement des berceuses...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lullabies.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                Aucune berceuse trouvée. Ajoutez-en une à l'aide du formulaire ci-dessus.
              </p>
            ) : (
              lullabies.map((lullaby) => (
                <Card key={lullaby.name} className="border-l-4 border-l-babybaby-cosmic">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="truncate flex-1">
                        <h4 className="font-medium">{lullaby.name.split('-').slice(1).join('-').replace(/\.[^/.]+$/, '').replace(/-/g, ' ')}</h4>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handlePlayPause(lullaby)}
                        >
                          {playing === lullaby.name ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(lullaby)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLullabiesTab;
