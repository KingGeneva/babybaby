
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/HeroSection';
import SEOTags from '@/components/home/SEOTags';
import HomePageContent from '@/components/home/HomePageContent';

const Index = () => {
  return (
    <MainLayout>
      <SEOTags />
      <div className="overflow-hidden">
        <HeroSection />
        <HomePageContent />
      </div>
    </MainLayout>
  );
};

export default Index;
