
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '../validation';

interface LoginFormProps {
  onModeChange: (mode: 'register' | 'reset') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onModeChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      
      setLoading(true);
      setError('');

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
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err.message.includes('Invalid login credentials')) {
        setError("Email ou mot de passe incorrect");
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Button 
            variant="link" 
            className="p-0 h-auto text-xs"
            onClick={() => onModeChange('reset')}
            type="button"
          >
            Mot de passe oublié ?
          </Button>
        </div>
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
        Se connecter
      </Button>

      <Button
        variant="link"
        className="w-full"
        onClick={() => onModeChange('register')}
        disabled={loading}
      >
        Pas encore de compte ? S'inscrire
      </Button>
    </form>
  );
};

export default LoginForm;
