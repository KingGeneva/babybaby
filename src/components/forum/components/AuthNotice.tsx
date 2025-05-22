
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
        <Card className="glass-card neu-shadow overflow-hidden">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto glass w-20 h-20 rounded-full flex items-center justify-center mb-4"
            >
              <LockKeyhole size={36} className="text-babybaby-cosmic" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-babybaby-cosmic to-blue-500 bg-clip-text text-transparent">
              Accès Réservé
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-2">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Pour accéder au forum et participer aux discussions, veuillez vous connecter ou créer un compte.
            </p>
            <div className="space-y-3">
              <Button asChild className="cosmic-button w-full hover-lift">
                <Link to="/auth?mode=login">
                  Se connecter
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 border-babybaby-cosmic text-babybaby-cosmic hover:bg-babybaby-cosmic/10 hover-lift">
                <Link to="/auth?mode=register">
                  Créer un compte
                </Link>
              </Button>
              <div className="pt-4 text-sm text-gray-500 dark:text-gray-400">
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
