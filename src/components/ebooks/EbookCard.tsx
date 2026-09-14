
import React from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ebook } from './types';
import { useAuth } from '@/contexts/AuthContext';

interface EbookCardProps {
  ebook: Ebook;
  onDownload: (ebook: Ebook) => void;
  isLoading: boolean;
}

const EbookCard: React.FC<EbookCardProps> = ({ ebook, onDownload, isLoading }) => {
  const { user } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full library-card-wrap"
    >
      <Card className="library-card h-full flex flex-col transition-all duration-300 rounded-lg">
        <CardHeader className="pb-4">
          <div className="aspect-[3/4] rounded-sm overflow-hidden mb-4 group bg-muted">
            <img 
              src={ebook.coverImage} 
              alt={ebook.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          </div>
          <CardTitle className="text-lg font-semibold leading-tight">{ebook.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-muted-foreground">
            {ebook.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-4">
          <div className="text-sm text-muted-foreground w-full flex justify-between">
            <span>{ebook.fileType}</span>
            <span>{ebook.fileSize}</span>
          </div>
          {user ? (
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => onDownload(ebook)}
                disabled={isLoading}
              >
                <Download className="h-4 w-4" />
                {isLoading ? 'Préparation...' : 'Télécharger'}
              </Button>
              <Button variant="default" className="flex-1" asChild>
                <Link to={`/ebooks/${ebook.id}`}>
                  <BookOpen className="h-4 w-4" />
                  Lire
                </Link>
                </Link>
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              className="w-full"
              asChild
            >
              <Link to="/auth">
                <Lock className="h-4 w-4" />
                Connectez-vous pour accéder
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EbookCard;
