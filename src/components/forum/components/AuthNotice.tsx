
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthNotice: React.FC = () => {
  return (
    <div className="container mx-auto max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-babybaby-cosmic/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <LockKeyhole size={32} className="text-babybaby-cosmic" />
            </div>
            <CardTitle className="text-2xl font-bold text-babybaby-cosmic">
              Accès Réservé
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Pour accéder au forum et participer aux discussions, veuillez vous connecter ou créer un compte.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
                <Link to="/auth?mode=login">
                  Se connecter
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth?mode=register">
                  Créer un compte
                </Link>
              </Button>
              <div className="pt-4 text-sm text-gray-500">
                <p>Rejoignez notre communauté de parents et profitez de tous les avantages!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthNotice;
