
import React from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import SEOTags from '@/components/home/SEOTags';
import HomePageContent from '@/components/home/HomePageContent';
import ProductSchema from '@/components/home/ProductSchema';

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <SEOTags />
      <ProductSchema />
      <NavBar />
      <HeroSection />
      <HomePageContent />
      <Footer />
    </div>
  );
};

export default Index;
