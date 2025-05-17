
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CertificateGenerator from '@/components/certificate/CertificateGenerator';
import SEOTags from '@/components/certificate/SEOTags';

const CertificateGeneratorPage = () => {
  return (
    <div className="min-h-screen">
      <SEOTags />
      <NavBar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-babybaby-cosmic">
          Générateur de Certificat d'Accomplissement
        </h1>
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12">
          Créez un certificat personnalisé pour célébrer les accomplissements de votre enfant. 
          Personnalisez les détails et téléchargez-le pour le partager avec vos proches.
        </p>
        <CertificateGenerator />
      </div>
      <Footer />
    </div>
  );
};

export default CertificateGeneratorPage;
