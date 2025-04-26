
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '../validation';

interface RegisterFormProps {
  onModeChange: (mode: 'login') => void;
  sendCustomEmail: (email: string, type: 'signup') => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onModeChange, sendCustomEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      
      setLoading(true);
      setError('');

      // Utilisation des redirections correctes pour Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            // Données supplémentaires à associer à l'utilisateur si nécessaire
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user && !data.session) {
        await sendCustomEmail(email, 'signup');
      }
      
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err.message.includes('User already registered')) {
        setError("Un compte existe déjà avec cet email");
      } else {
        setError(err.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
          disabled={loading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        S'inscrire
      </Button>

      <Button
        variant="link"
        className="w-full"
        onClick={() => onModeChange('login')}
        disabled={loading}
      >
        Déjà un compte ? Se connecter
      </Button>
    </form>
  );
};

export default RegisterForm;
