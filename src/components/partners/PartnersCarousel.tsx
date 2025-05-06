
import React from 'react';
import { motion } from 'framer-motion';

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
  const marqueeVariants = {
    animate: {
      x: [0, -1035],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 15,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="bg-white py-8 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-babybaby-cosmic mb-2">
          Nos Partenaires
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Ces marques de confiance nous accompagnent pour vous offrir le meilleur pour votre bébé
        </p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex min-w-full items-center gap-8 px-4"
          variants={marqueeVariants}
          animate="animate"
        >
          {partners.concat(partners).map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              className="flex-shrink-0 w-32 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-4 hover:shadow-md transition-shadow"
            >
              <a 
                href={partner.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
              >
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="max-w-full max-h-full object-contain" 
                />
                <span className="sr-only">{partner.name}</span>
              </a>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PartnersCarousel;
