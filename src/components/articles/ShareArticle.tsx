
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareArticleProps {
  article: {
    title: string;
    excerpt: string;
    image: string;
    id: number;
  };
}

const ShareArticle: React.FC<ShareArticleProps> = ({ article }) => {
  const { toast } = useToast();
  
  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: `${window.location.origin}/articles/${article.id}`,
      files: [],
    };

    try {
      // Try to fetch the image and convert it to a file
      if (article.image && article.image !== '/placeholder.svg') {
        const response = await fetch(article.image);
        const blob = await response.blob();
        const file = new File([blob], 'article-image.jpg', { type: 'image/jpeg' });
        shareData.files = [file];
      }

      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Article partagé",
          description: "L'article a été partagé avec succès",
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(
          `${article.title}\n\n${article.excerpt}\n\n${window.location.origin}/articles/${article.id}`
        );
        toast({
          title: "Lien copié",
          description: "Le lien de l'article a été copié dans le presse-papier",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du partage",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-babybaby-cosmic"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Partager
    </Button>
  );
};

export default ShareArticle;
