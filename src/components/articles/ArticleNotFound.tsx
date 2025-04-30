
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/common/SEOHead';

const ArticleNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Article introuvable"
        description="L'article que vous recherchez n'existe pas ou a été supprimé."
      />
      <NavBar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Article introuvable</h1>
          <p className="mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/articles')}>
            Retourner aux articles
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleNotFound;
