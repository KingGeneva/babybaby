
import React from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import SEOTags from '@/components/home/SEOTags';
import HomePageContent from '@/components/home/HomePageContent';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <SEOTags />
      <NavBar />
      <HeroSection />
      <HomePageContent />
      <Footer />
    </div>
  );
};

export default Index;
