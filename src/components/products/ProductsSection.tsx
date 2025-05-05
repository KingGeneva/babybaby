import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { products } from './productsData';
import ProductCard from './ProductCard';

const ProductsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const featuredProducts = products.filter(product => product.isFeatured);
  const otherProducts = products.filter(product => !product.isFeatured).slice(0, 3);

  return (
    <section className="py-16 bg-gray-50" id="products">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-babybaby-cosmic mb-4">
            Produits recommandés
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits pour bébé, soigneusement choisis pour leur qualité et leur utilité
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Featured product highlighted */}
          {featuredProducts.map((product) => (
            <motion.div 
              key={product.id} 
              variants={itemVariants}
              className="lg:col-span-2 lg:row-span-2"
            >
              <div className="h-full">
                <ProductCard product={product} />
              </div>
            </motion.div>
          ))}

          {/* Other products */}
          {otherProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-10">
          <a 
            href="#" 
            className="inline-block border-2 border-babybaby-cosmic text-babybaby-cosmic hover:bg-babybaby-cosmic hover:text-white transition-colors px-6 py-2 rounded-full font-medium"
          >
            Voir tous les produits recommandés
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
