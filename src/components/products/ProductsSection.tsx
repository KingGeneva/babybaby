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

// Données de produits recommandés (mises à jour avec les nouveaux produits)
const products = [
  {
    id: 1,
    title: "Siège auto pivotant 360° Evenflo Revolve360",
    description: "Le siège auto Evenflo Revolve360 offre une rotation complète à 360° pour une installation et un positionnement faciles de votre bébé, avec une sécurité optimale.",
    price: 399.99,
    image: "/lovable-uploads/24c181aa-ed3a-4de1-b24b-776e707993d9.png",
    animationType: "crib" as const,
    link: "https://a.co/d/0xN2yKz"
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
