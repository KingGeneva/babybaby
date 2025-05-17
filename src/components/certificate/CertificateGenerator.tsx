
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Download, Share2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Certificate from './Certificate';
import html2canvas from 'html2canvas';

type CertificateFormValues = {
  recipientName: string;
  achievementText: string;
  date: string;
  signatureText: string;
};

const CertificateGenerator = () => {
  const [certificate, setCertificate] = useState<CertificateFormValues>({
    recipientName: 'Prénom Nom',
    achievementText: 'pour avoir franchi une étape importante dans son développement',
    date: format(new Date(), 'dd/MM/yyyy', { locale: fr }),
    signatureText: 'Créateur de BabyBaby',
  });
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<CertificateFormValues>({
    defaultValues: certificate,
  });
  
  const handleFormSubmit = (data: CertificateFormValues) => {
    setCertificate(data);
    toast.success("Le certificat a été mis à jour !");
  };
  
  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsDownloading(true);
      const loadingToastId = toast("Préparation du certificat...");
      
      // Attendre un peu pour s'assurer que le DOM est stable
      setTimeout(async () => {
        const canvas = await html2canvas(certificateRef.current!, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
          allowTaint: true,
        });
        
        const image = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = `certificat-${certificate.recipientName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = image;
        link.click();
        
        toast.dismiss(loadingToastId as string);
        toast.success("Certificat téléchargé avec succès !");
        setIsDownloading(false);
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la génération du certificat:', error);
      toast.error("Une erreur est survenue lors de la génération du certificat.");
      setIsDownloading(false);
    }
  };
  
  const handleShare = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsSharing(true);
      const loadingToastId = toast("Préparation du partage...");
      
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      });
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95);
      });
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], 'certificat.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: 'Certificat d\'Accomplissement',
          text: `Certificat d'accomplissement pour ${certificate.recipientName}`,
          files: [new File([blob], 'certificat.png', { type: 'image/png' })],
        });
        toast.dismiss(loadingToastId as string);
        toast.success("Partage réussi !");
      } else {
        // Fallback pour les navigateurs qui ne supportent pas Web Share API
        const shareUrl = URL.createObjectURL(blob);
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.dismiss(loadingToastId as string);
        toast.success("Lien du certificat copié dans le presse-papier.");
      }
      setIsSharing(false);
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast.error("Une erreur est survenue lors du partage.");
      setIsSharing(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Personnalisez votre certificat</h2>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipientName">Nom du destinataire</Label>
            <Input
              id="recipientName"
              placeholder="Prénom Nom"
              {...form.register('recipientName')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="achievementText">Texte d'accomplissement</Label>
            <Textarea
              id="achievementText"
              placeholder="pour avoir franchi une étape importante dans son développement"
              {...form.register('achievementText')}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              placeholder="JJ/MM/AAAA"
              {...form.register('date')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signatureText">Texte sous signature</Label>
            <Input
              id="signatureText"
              placeholder="Créateur de BabyBaby"
              {...form.register('signatureText')}
            />
          </div>
          
          <Button type="submit" className="w-full">Mettre à jour le certificat</Button>
        </form>
        
        <div className="flex gap-4 mt-6">
          <Button 
            onClick={handleDownload} 
            className="flex-1 flex items-center justify-center gap-2"
            disabled={isDownloading}
          >
            <Download size={18} />
            {isDownloading ? 'Téléchargement...' : 'Télécharger'}
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="flex-1 flex items-center justify-center gap-2"
            disabled={isSharing}
          >
            <Share2 size={18} />
            {isSharing ? 'Partage...' : 'Partager'}
          </Button>
        </div>
      </Card>
      
      <div className="flex justify-center items-center">
        <div ref={certificateRef}>
          <Certificate 
            recipientName={certificate.recipientName}
            achievementText={certificate.achievementText}
            date={certificate.date}
            signatureText={certificate.signatureText}
          />
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
