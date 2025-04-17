
import React from 'react';
import NavBar from '@/components/NavBar';
import ToolsSection from '@/components/tools/ToolsSection';
import Footer from '@/components/Footer';

const ToolsPage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24">
        <ToolsSection />
      </div>
      <Footer />
    </div>
  );
};

export default ToolsPage;
