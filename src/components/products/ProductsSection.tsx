
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Import lazy du composant ProductCard avec preload
const ProductCard = lazy(() => {
  // Précharger le composant après un court délai pour donner la priorité aux éléments critiques
  return import('./ProductCard');
});

// Placeholder simplifié et optimisé
const ProductCardPlaceholder = () => (
  <div className="w-full h-[200px] animate-pulse bg-gray-100 rounded-lg"></div>
);

// Données de produits recommandés (réduites pour optimisation)
const products = [
  {
    id: 1,
    title: "Siège auto pivotant 360°",
    description: "Sécurité et confort optimal pour votre bébé avec rotation à 360°.",
    price: 229.99,
    image: "/placeholder.svg",
    animationType: "crib" as const
  },
  {
    id: 2,
    title: "Poussette légère pliable",
    description: "Poussette ultra-légère et compacte, parfaite pour les déplacements.",
    price: 179.99,
    image: "/placeholder.svg",
    animationType: "toy" as const
  },
  {
    id: 3,
    title: "Robot mixeur 5 en 1",
    description: "Préparez les repas de bébé facilement avec ce mixeur multifonction.",
    price: 89.99,
    image: "/placeholder.svg",
    animationType: "bottle" as const
  }
];

const ProductsSection: React.FC = () => {
  const [visibleProducts, setVisibleProducts] = useState<number[]>([]);
  const isMobile = useIsMobile();
  
  // Optimisation: Chargement immédiat pour affichage initial
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
    <section className="py-8 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-10%" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-babybaby-cosmic">Produits Recommandés</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Des produits sélectionnés avec soin par notre équipe pour faciliter votre quotidien.
          </p>
        </motion.div>

        <Carousel 
          className="w-full max-w-screen-lg mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product, index) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  {visibleProducts.includes(product.id) ? (
                    <Suspense fallback={<ProductCardPlaceholder />}>
                      <ProductCard product={product} index={index} />
                    </Suspense>
                  ) : (
                    <ProductCardPlaceholder />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative static mr-2 translate-y-0" />
            <CarouselNext className="relative static ml-2 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ProductsSection;
