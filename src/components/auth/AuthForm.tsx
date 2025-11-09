
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import ResetPasswordForm from './forms/ResetPasswordForm';
import { supabase } from '@/integrations/supabase/client';

type AuthMode = 'login' | 'register' | 'reset';

const AuthForm: React.FC = () => {
  const [mode, setMode] = React.useState<AuthMode>('login');

  // Fonction pour envoyer un email personnalisé
  const sendCustomEmail = async (email: string, type: 'signup' | 'magiclink' | 'recovery', actionLink?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-custom-email', {
        body: {
          email,
          type,
          meta: {
            action_link: actionLink || '',
          }
        }
      });

      if (error) {
        console.error("Erreur lors de l'envoi de l'email personnalisé:", error);
        return;
      }

      if (import.meta.env.DEV) {
        console.log(`Email personnalisé de type ${type} envoyé à ${email}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email personnalisé:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'login' ? 'Connexion' : 
           mode === 'register' ? 'Inscription' : 
           'Réinitialiser le mot de passe'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login' ? 'Accédez à votre tableau de bord parental' : 
           mode === 'register' ? 'Créez votre compte pour suivre la croissance de votre bébé' : 
           'Recevez un email pour réinitialiser votre mot de passe'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {mode === 'login' && (
          <LoginForm 
            onModeChange={(newMode) => setMode(newMode)} 
          />
        )}
        
        {mode === 'register' && (
          <RegisterForm 
            onModeChange={() => setMode('login')}
            sendCustomEmail={sendCustomEmail}
          />
        )}
        
        {mode === 'reset' && (
          <ResetPasswordForm 
            onModeChange={() => setMode('login')} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AuthForm;
