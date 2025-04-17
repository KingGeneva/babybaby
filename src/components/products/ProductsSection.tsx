
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Import lazy du composant ProductCard
const ProductCard = lazy(() => import('./ProductCard'));

// Placeholder pour le chargement des cartes
const ProductCardPlaceholder = () => (
  <div className="w-full h-[250px] animate-pulse bg-gray-100 rounded-lg"></div>
);

// Données de produits recommandés
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
  },
  {
    id: 4,
    title: "Moniteur de sommeil connecté",
    description: "Surveillance avancée du sommeil avec analyse des cycles et alertes.",
    price: 149.99,
    image: "/placeholder.svg",
    animationType: "monitor" as const
  }
];

const ProductsSection: React.FC = () => {
  const [visibleProducts, setVisibleProducts] = useState<number[]>([]);
  const isMobile = useIsMobile();
  
  // Chargement progressif des animations sur mobile
  useEffect(() => {
    if (isMobile) {
      // Sur mobile, on charge progressivement les produits
      const loadProducts = async () => {
        for (let i = 0; i < products.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setVisibleProducts(prev => [...prev, products[i].id]);
        }
      };
      loadProducts();
    } else {
      // Sur desktop, on charge tous les produits immédiatement
      setVisibleProducts(products.map(p => p.id));
    }
  }, [isMobile]);

  return (
    <section className="py-12 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">Produits Recommandés</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Des produits sélectionnés avec soin par notre équipe pour faciliter votre quotidien.
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
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="relative static mr-2 translate-y-0" />
            <CarouselNext className="relative static ml-2 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ProductsSection;
