
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction pour envoyer un email personnalisé
  const sendCustomEmail = async (email: string, type: 'signup' | 'magiclink' | 'recovery', actionLink?: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      await fetch(`https://pxynugnbikiwbsqdgewx.supabase.co/functions/v1/send-custom-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData?.session?.access_token || ''}`,
        },
        body: JSON.stringify({
          email,
          type,
          meta: {
            action_link: actionLink || '',
          }
        }),
      });
      console.log(`Email personnalisé de type ${type} envoyé à ${email}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email personnalisé:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Tentative d'authentification...");
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        console.log("Résultat SignIn:", { data, error });
        
        if (error) throw error;
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre tableau de bord parental",
        });
        navigate('/parental-dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin + '/auth'
          }
        });
        console.log("Résultat SignUp:", { data, error });
        
        if (error) throw error;
        
        // Si l'inscription a réussi et qu'une confirmation par email est nécessaire
        if (data?.user && !data.session) {
          // Nous enverrons notre propre email personnalisé
          // Note: dans un environnement de production, il faudrait configurer Supabase pour utiliser notre webhook
          sendCustomEmail(email, 'signup');
        }
        
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte",
        });
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Accédez à votre tableau de bord parental' : 'Créez votre compte pour suivre la croissance de votre bébé'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
