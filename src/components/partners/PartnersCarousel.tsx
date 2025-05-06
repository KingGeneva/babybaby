
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

interface Partner {
  id: number;
  name: string;
  logo: string;
  url: string;
}

const partners: Partner[] = [
  {
    id: 9,
    name: "O030",
    logo: "/lovable-uploads/7d0b9eea-9e79-427d-8afa-f18467a2a11d.png",
    url: "https://o030.com"
  },
  {
    id: 10,
    name: "BabyBasket",
    logo: "/lovable-uploads/d9c8fef0-bfcf-4ae5-bf0e-047d471cc207.png",
    url: "https://babybasket.com"
  },
  {
    id: 11,
    name: "PaternityLab",
    logo: "/lovable-uploads/b8cc3c2a-bb9a-4560-baf1-44055b2ca3a1.png",
    url: "https://www.kqzyfj.com/click-101432391-15736233"
  },
  {
    id: 12,
    name: "MFIMedical",
    logo: "/lovable-uploads/c872500f-5877-4395-bb3c-089e296bf56b.png",
    url: "https://www.tkqlhce.com/click-101432391-15891524"
  },
  {
    id: 13,
    name: "Amazon",
    logo: "/lovable-uploads/a93271f8-e9db-49ed-99e9-d683dd53ba12.png",
    url: "https://www.amazon.com"
  },
  {
    id: 14,
    name: "M&M's",
    logo: "/lovable-uploads/37a80789-9d1e-40dc-a8d0-d1e9e4ba2230.png",
    url: "https://mms.com"
  },
  {
    id: 15,
    name: "Deux par deux",
    logo: "/lovable-uploads/55b1f730-647d-463b-8db9-2e33309e02c1.png",
    url: "https://www.anrdoezrs.net/click-101432391-15735100"
  },
  {
    id: 16,
    name: "Coco Moon Hawaii",
    logo: "/lovable-uploads/eca18429-7255-460c-853e-b2b623f14afe.png",
    url: "https://www.kqzyfj.com/click-101432391-17061544"
  }
];

const PartnersCarousel = () => {
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Arrêter l'autoplay lorsqu'un utilisateur a interagi avec le carousel
    const handleUserInteraction = () => {
      setAutoPlayEnabled(false);
    };

    window.addEventListener('click', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  return (
    <section className="bg-gradient-to-r from-white to-sky-50 py-12 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-babybaby-cosmic mb-3">
          Nos Partenaires
        </h2>
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="h-1 w-16 bg-babybaby-cosmic/30 rounded-full"></div>
          <div className="h-1 w-8 bg-babybaby-pink rounded-full"></div>
          <div className="h-1 w-16 bg-babybaby-cosmic/30 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Ces marques de confiance nous accompagnent pour vous offrir le meilleur pour votre bébé
        </p>
      </div>
      
      {/* Version mobile: carrousel automatique */}
      <div className="md:hidden overflow-hidden">
        <motion.div
          className="flex gap-8 px-4"
          animate={{
            x: autoPlayEnabled ? [0, -1400] : 0,
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {partners.concat(partners).map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              className="flex-shrink-0 w-36 h-24 bg-white rounded-lg flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-all"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <a 
                href={partner.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    className="max-w-full max-h-full object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                  />
                  {hoveredIndex === index && (
                    <div className="absolute inset-0 bg-babybaby-cosmic/5 flex items-center justify-center rounded backdrop-blur-sm">
                      <span className="text-xs font-medium text-babybaby-cosmic">{partner.name}</span>
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Version desktop: carrousel avec flèches */}
      <div className="hidden md:block">
        <Carousel
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="py-4">
            {partners.map((partner, index) => (
              <CarouselItem key={partner.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div 
                  className={cn(
                    "h-28 bg-white rounded-xl flex items-center justify-center p-4 mx-2",
                    "transition-all duration-300 transform",
                    "border border-gray-100 shadow-sm hover:shadow-md",
                    "hover:border-babybaby-cosmic/20 hover:bg-gradient-to-b hover:from-white hover:to-sky-50"
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <a 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center"
                    aria-label={`Visiter le site de ${partner.name}`}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img 
                        src={partner.logo} 
                        alt={`${partner.name} logo`} 
                        className={cn(
                          "max-w-[80%] max-h-[80%] object-contain",
                          "transition-all duration-300",
                          hoveredIndex === index ? "scale-110" : ""
                        )}
                      />
                      {hoveredIndex === index && (
                        <div className="absolute bottom-[-8px] left-0 right-0 flex justify-center">
                          <span className="text-xs font-medium text-babybaby-cosmic bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                            {partner.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 bg-white/80 hover:bg-white" />
          <CarouselNext className="right-1 bg-white/80 hover:bg-white" />
        </Carousel>
      </div>
      
      {/* Élément décoratif en fond */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-babybaby-lightblue/30 via-babybaby-pink/20 to-babybaby-lightblue/30 opacity-50"></div>
    </section>
  );
};

export default PartnersCarousel;
