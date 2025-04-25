
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Validation schemas
const emailSchema = z.string().email("Email invalide").min(1, "Email requis");
const passwordSchema = z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères");

const AuthForm: React.FC = () => {
  // Define mode type explicitly to match all three possible values
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
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

  // Validation des entrées
  const validateInputs = () => {
    setError('');
    
    try {
      emailSchema.parse(email);
      
      if (mode !== 'reset') {
        passwordSchema.parse(password);
      }
      
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre tableau de bord parental",
        });
        navigate('/parental-dashboard');
      } 
      else if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin + '/auth'
          }
        });
        
        if (error) throw error;
        
        if (data?.user && !data.session) {
          sendCustomEmail(email, 'signup');
        }
        
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte",
        });
      }
      else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/auth'
        });
        
        if (error) throw error;
        
        setResetSent(true);
        toast({
          title: "Email envoyé",
          description: "Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe",
        });
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      
      // Gestion des erreurs plus précises
      if (error.message.includes('Invalid login credentials')) {
        setError("Email ou mot de passe incorrect");
      } else if (error.message.includes('User already registered')) {
        setError("Un compte existe déjà avec cet email");
      } else if (error.message.includes('Email rate limit')) {
        setError("Trop de tentatives. Veuillez réessayer plus tard");
      } else {
        setError(error.message || "Une erreur s'est produite");
      }
      
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
            {mode === 'login' ? 'Connexion' : 
             mode === 'register' ? 'Inscription' : 'Réinitialiser le mot de passe'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login' ? 'Accédez à votre tableau de bord parental' : 
             mode === 'register' ? 'Créez votre compte pour suivre la croissance de votre bébé' : 
             'Recevez un email pour réinitialiser votre mot de passe'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {mode === 'reset' && resetSent ? (
            <div className="text-center py-4">
              <p className="text-green-600 mb-4">
                Un email de réinitialisation a été envoyé à {email}.
              </p>
              <Button variant="outline" onClick={() => setMode('login')}>
                Retour à la connexion
              </Button>
            </div>
          ) : (
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
                  disabled={loading}
                  aria-invalid={!!error}
                />
              </div>
              
              {mode !== 'reset' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    {mode === 'login' && (
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs"
                        onClick={() => setMode('reset')}
                        type="button"
                      >
                        Mot de passe oublié ?
                      </Button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={mode !== 'reset'}
                    disabled={loading}
                    aria-invalid={!!error}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'login' ? 'Se connecter' : 
                 mode === 'register' ? "S'inscrire" : 'Envoyer le lien'}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          {(mode !== 'reset' || resetSent) && (
            <Button
              variant="link"
              className="w-full"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              disabled={loading}
            >
              {mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </Button>
          )}
          
          {mode === 'reset' && resetSent && (
            <p className="text-sm text-gray-500 text-center">
              Vous n'avez pas reçu d'email ? Vérifiez vos spams ou 
              <Button 
                variant="link" 
                className="p-0 h-auto"
                onClick={() => setResetSent(false)}
                type="button"
              >
                essayez à nouveau
              </Button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;

