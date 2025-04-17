import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';

interface Ebook {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  downloadUrl: string;
  fileType: string;
  fileSize: string;
}

const ebooks: Ebook[] = [
  {
    id: 1,
    title: "Guide complet de l'alimentation de 0 à 3 ans",
    description: "Tout ce qu'il faut savoir pour bien nourrir votre enfant durant ses premières années.",
    coverImage: "/placeholder.svg",
    downloadUrl: "#",
    fileType: "PDF",
    fileSize: "3.2 MB"
  },
  {
    id: 2,
    title: "Les étapes essentielles du développement",
    description: "Comprendre et accompagner les étapes clés du développement de votre bébé.",
    coverImage: "/placeholder.svg",
    downloadUrl: "#",
    fileType: "PDF",
    fileSize: "2.7 MB"
  },
  {
    id: 3,
    title: "Sommeil de bébé : astuces et conseils",
    description: "Des méthodes douces pour aider votre bébé à mieux dormir.",
    coverImage: "/placeholder.svg",
    downloadUrl: "#",
    fileType: "PDF",
    fileSize: "1.8 MB"
  },
  {
    id: 4,
    title: "Activités d'éveil pour les tout-petits",
    description: "Des idées ludiques pour stimuler le développement et l'éveil de votre bébé.",
    coverImage: "/placeholder.svg",
    downloadUrl: "#",
    fileType: "PDF",
    fileSize: "2.5 MB"
  },
  {
    id: 5,
    title: "La diversification alimentaire pas à pas",
    description: "Un guide complet pour introduire les aliments solides en toute sécurité.",
    coverImage: "/placeholder.svg",
    downloadUrl: "#",
    fileType: "PDF",
    fileSize: "3.0 MB"
  },
  {
    id: 6,
    title: "10 astuces pour voyager avec bébé",
    description: "Comment préparer et profiter sereinement de vos voyages en famille.",
    coverImage: "/placeholder.svg",
    downloadUrl: "#",
    fileType: "PDF",
    fileSize: "1.5 MB"
  },
  {
    id: 7,
    title: "Comment bien accompagner le sommeil de bébé",
    description: "Un guide complet pour comprendre et améliorer le sommeil de votre enfant.",
    coverImage: "/placeholder.svg",
    downloadUrl: "#",
    fileType: "PDF",
    fileSize: "2.9 MB"
  }
];

const EbooksSection: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = isMobile ? 1 : 3;
  
  const totalPages = Math.ceil(ebooks.length / itemsPerPage);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + itemsPerPage) >= ebooks.length 
        ? 0 
        : prevIndex + itemsPerPage
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - itemsPerPage) < 0 
        ? Math.max(0, ebooks.length - itemsPerPage) 
        : prevIndex - itemsPerPage
    );
  };
  
  const visibleEbooks = ebooks.slice(currentIndex, currentIndex + itemsPerPage);
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Book className="mx-auto h-10 w-10 text-babybaby-cosmic mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">Nos E-books Gratuits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des ressources expertisées pour vous accompagner dans votre parcours parental
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-babybaby-cosmic text-babybaby-cosmic"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Précédent</span>
            </Button>
            
            <div className="flex gap-2 justify-center">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    Math.floor(currentIndex / itemsPerPage) === idx 
                      ? "w-6 bg-babybaby-cosmic" 
                      : "w-2 bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(idx * itemsPerPage)}
                  aria-label={`Page ${idx + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-babybaby-cosmic text-babybaby-cosmic"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Suivant</span>
            </Button>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {visibleEbooks.map((ebook) => (
              <motion.div
                key={ebook.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="aspect-[3/4] rounded-md overflow-hidden mb-4 group">
                      <img 
                        src={ebook.coverImage} 
                        alt={ebook.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <CardTitle className="text-lg font-semibold leading-tight">{ebook.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-gray-600">
                      {ebook.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3 pt-4">
                    <div className="text-sm text-gray-500 w-full flex justify-between">
                      <span>{ebook.fileType}</span>
                      <span>{ebook.fileSize}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 border-babybaby-cosmic text-babybaby-cosmic hover:bg-babybaby-cosmic hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button 
            variant="link" 
            className="text-babybaby-cosmic"
          >
            Voir tous nos e-books
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EbooksSection;
