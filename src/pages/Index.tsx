
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import LazyLoadedSections from '@/components/home/LazyLoadedSections';

// Données de démonstration pour le tableau de bord sur la page d'accueil
const demoGrowthData = [
  { name: '1 mois', taille: 52, poids: 4.1 },
  { name: '2 mois', taille: 56, poids: 5.2 },
  { name: '3 mois', taille: 59, poids: 6.0 },
  { name: '4 mois', taille: 62, poids: 6.7 },
  { name: '5 mois', taille: 65, poids: 7.3 },
  { name: '6 mois', taille: 67, poids: 7.8 },
];

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen overflow-hidden">
      <NavBar />
      <HeroSection />
      
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { 
              duration: 0.3,
              staggerChildren: 0.1
            } 
          },
        }}
      >
        <LazyLoadedSections demoGrowthData={demoGrowthData} />
      </motion.div>
    </div>
  );
};

export default Index;
