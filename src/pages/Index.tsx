
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import LazyLoadedSections from '@/components/home/LazyLoadedSections';
import HomePageSEO from '@/components/home/HomePageSEO';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';

// Optimized Homepage without dashboard demo for better performance and SEO
const Index = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  
  return (
    <div className="min-h-screen overflow-hidden">
      <HomePageSEO />
      
      <NavBar />
      <HeroSection />
      
      {/* Features section */}
      <FeaturesSection />
      
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
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
        {/* Lazy loaded sections from existing component */}
        <LazyLoadedSections 
          demoGrowthData={[
            { name: "1 mois", taille: 52, poids: 4.1 },
            { name: "2 mois", taille: 56, poids: 5.3 },
            { name: "3 mois", taille: 59, poids: 6.0 },
            { name: "4 mois", taille: 62, poids: 6.7 }
          ]} 
          showDevelopmentSection={true}
        />
      </motion.div>
    </div>
  );
};

export default Index;
