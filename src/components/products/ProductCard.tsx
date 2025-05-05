
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative pb-[56.25%] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4" 
        />
        {product.isNew && (
          <div className="absolute top-2 right-2 bg-babybaby-cosmic text-white text-xs font-bold px-2 py-1 rounded-full">
            NOUVEAU
          </div>
        )}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discount}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 h-12">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-babybaby-cosmic">{product.price}</span>
          <a 
            href={product.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            Acheter
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
