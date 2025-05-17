
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEbookViewer } from '@/hooks/useEbookViewer';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EbookViewerContainer from '@/components/ebooks/viewer/EbookViewerContainer';
import EbookHeader from '@/components/ebooks/viewer/EbookHeader';
import SEOHead from '@/components/common/SEOHead';

const EbookViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { 
    ebook, 
    pdfUrl, 
    isLoading, 
    error, 
    handleRetry 
  } = useEbookViewer(id);

  const handleNavigateBack = () => {
    navigate('/ebooks');
  };

  // Safe default values
  const title = ebook ? `${ebook.title} | BabyBaby E-books` : 'Lecture d\'E-book | BabyBaby';
  const description = ebook?.description || 'Consultez notre bibliothèque d\'e-books gratuits pour les parents.';
  const canonicalUrl = id ? `https://babybaby.app/ebooks/${id}` : 'https://babybaby.app/ebooks';
  const imageUrl = ebook?.coverImage || '/lovable-uploads/d76e5129-3f95-434d-87a3-66c35ce002dd.png';

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        ogImage={imageUrl}
      />
      
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
