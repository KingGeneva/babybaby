
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AuthNotice: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6 text-babybaby-cosmic">Forum des Parents</h1>
      <p className="text-lg mb-8">Connectez-vous pour accéder au forum et partager avec d'autres parents.</p>
      <Button onClick={() => navigate('/auth')} size="lg">
        Se connecter
      </Button>
    </div>
  );
};

export default AuthNotice;
