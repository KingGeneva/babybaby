
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';
import { useEbookViewer } from '@/hooks/useEbookViewer';
import EbookHeader from '@/components/ebooks/viewer/EbookHeader';
import EbookViewerContainer from '@/components/ebooks/viewer/EbookViewerContainer';

const EbookViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    ebook,
    pdfUrl,
    isLoading,
    error,
    handleRetry
  } = useEbookViewer(id);

  const handleNavigateBack = () => navigate('/ebooks');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {ebook && (
        <SEOHead 
          title={`Lire: ${ebook.title} | BabyBaby`}
          description={`Lisez "${ebook.title}" en ligne gratuitement - ${ebook.description}`}
          canonicalUrl={`https://babybaby.app/ebooks/${id}`}
          ogType="article"
          keywords={[...ebook.tags, 'lecture en ligne', 'flipbook', 'livre numérique', 'ebook gratuit']}
        />
      )}

      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <EbookHeader 
            ebook={ebook} 
            onNavigateBack={handleNavigateBack} 
          />
          
          <EbookViewerContainer 
            ebook={ebook}
            pdfUrl={pdfUrl}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onNavigateBack={handleNavigateBack}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EbookViewerPage;
