
import React from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  url: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Sommeil",
    description: "Tout pour le bon sommeil de bébé",
    image: "/lovable-uploads/af44cf46-3e2e-404e-9c33-6bc75e1a24a1.png",
    url: "https://babybaby.boutique/categories/sommeil"
  },
  {
    id: 2,
    name: "Alimentation",
    description: "Biberons, chaises hautes et accessoires",
    image: "/lovable-uploads/d50b4331-6d8b-45e6-9e58-e8fc2d198a37.png",
    url: "https://babybaby.boutique/categories/alimentation"
  },
  {
    id: 3,
    name: "Jouets",
    description: "Pour l'éveil et le développement",
    image: "/lovable-uploads/705d0c2d-1501-4890-be56-dc7905704c1f.png",
    url: "https://babybaby.boutique/categories/jouets"
  },
  {
    id: 4,
    name: "Vêtements",
    description: "Confortables et élégants",
    image: "/lovable-uploads/af7cb1bb-a9c3-4487-9f11-9c050013463d.png",
    url: "https://babybaby.boutique/categories/vetements"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-babybaby-cosmic">
        Catégories populaires
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={item}>
            <a 
              href={category.url}
              className="block h-full group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md h-full hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 text-babybaby-cosmic group-hover:text-babybaby-cosmic/80 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedCategories;
