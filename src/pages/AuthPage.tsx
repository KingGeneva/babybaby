
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';
import P5Canvas from '@/components/P5Canvas';

const AuthPage = () => {
  const { user, loading } = useAuth();

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <P5Canvas className="fixed inset-0 -z-10" />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-center text-babybaby-cosmic">
          Accès au Tableau de Bord
        </h1>
        
        <AuthForm />
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;
