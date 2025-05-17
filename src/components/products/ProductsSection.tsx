
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from './ProductCard'; // Import direct au lieu de lazy loading

// Placeholder simplifié et optimisé
const ProductCardPlaceholder = () => (
  <div className="w-full h-[320px] animate-pulse bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl"></div>
);

// Données de produits recommandés
const products = [
  {
    id: 1,
    title: "Ensemble grenouillère et chaussettes pour bébé M&M'S®",
    description: "Adorable ensemble comprenant une grenouillère jaune et des chaussettes assorties, parfait pour les plus petits fans de M&M'S®.",
    price: 31.99,
    image: "/lovable-uploads/af7cb1bb-a9c3-4487-9f11-9c050013463d.png",
    animationType: "toy" as const,
    link: "https://www.tkqlhce.com/click-101432391-15872736?url=https%3A%2F%2Fwww.mms.com%2Fen-us%2Fmms-apparel%2Fheritage-mms-onesie%2Fct2291-p.html%3Fcolor%3Dyellow%26size%3D12MO&cjsku=3000881311002"
  },
  {
    id: 2,
    title: "Poussette légère pliable Summer Infant",
    description: "Cette poussette Summer Infant ultra-légère et compacte est idéale pour les déplacements quotidiens, avec un pliage facile et rapide.",
    price: 129.99,
    image: "/lovable-uploads/d50b4331-6d8b-45e6-9e58-e8fc2d198a37.png",
    animationType: "toy" as const,
    link: "https://a.co/d/81ZhfsY"
  },
  {
    id: 3,
    title: "Couffin 3 en 1 multifonction",
    description: "Un couffin polyvalent qui se transforme en berceau et espace de rangement, parfait pour le sommeil et le confort de bébé.",
    price: 149.99,
    image: "/lovable-uploads/af44cf46-3e2e-404e-9c33-6bc75e1a24a1.png",
    animationType: "bottle" as const,
    link: "https://a.co/d/d8LeJeN"
  },
  {
    id: 4,
    title: "Panier-cadeau pour garçon, par Baby Basket",
    description: "Offrez toute la joie que vous ressentez avec ce fabuleux panier familial, rempli de tout ce qu'il faut pour le nouveau-né et ses fiers parents !",
    price: 338.99,
    image: "/lovable-uploads/705d0c2d-1501-4890-be56-dc7905704c1f.png",
    animationType: "toy" as const,
    link: "https://www.anrdoezrs.net/click-101432391-13366800?url=https%3A%2F%2Fwww.babybasket.com%2FFabulous-Family-Boy-Gift-Basket&cjsku=335"
  }
];

const ProductsSection: React.FC = () => {
  const [visibleProducts, setVisibleProducts] = useState<number[]>([]);
  const isMobile = useIsMobile();
  
  // Optimisation: Chargement progressif pour une meilleure performance
  useEffect(() => {
    // Charger immédiatement le premier produit pour un affichage rapide
    setVisibleProducts([products[0].id]);
    
    // Charge progressivement les autres produits
    const loadRemainingProducts = async () => {
      // Petit délai pour prioriser les éléments visibles
      await new Promise(resolve => setTimeout(resolve, 100));
      
      for (let i = 1; i < products.length; i++) {
        setVisibleProducts(prev => [...prev, products[i].id]);
        // Délai plus court entre chaque chargement
        await new Promise(resolve => setTimeout(resolve, isMobile ? 150 : 100));
      }
    };
    
    loadRemainingProducts();
  }, [isMobile]);

  return (
    <section className="py-16 bg-gradient-to-b from-sky-50/50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-10%" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">
            Nos produits premium
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Sélectionnés avec soin pour le confort et l'épanouissement de votre enfant
          </p>
        </motion.div>

        <Carousel 
          className="w-full max-w-screen-xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product, index) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  {visibleProducts.includes(product.id) ? (
                    <ProductCard product={product} index={index} />
                  ) : (
                    <ProductCardPlaceholder />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative static mr-2 translate-y-0 rounded-full border-babybaby-cosmic/20 hover:bg-babybaby-cosmic hover:text-white" />
            <CarouselNext className="relative static ml-2 translate-y-0 rounded-full border-babybaby-cosmic/20 hover:bg-babybaby-cosmic hover:text-white" />
          </div>
        </Carousel>

        <div className="mt-16 flex justify-center">
          <motion.a 
            href="https://babybaby.boutique"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-babybaby-cosmic text-white px-8 py-4 rounded-full font-medium hover:shadow-lg hover:bg-babybaby-cosmic/90 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Voir tous les produits
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
