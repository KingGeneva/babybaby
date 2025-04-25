
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { emailSchema } from '../validation';

interface ResetPasswordFormProps {
  onModeChange: (mode: 'login') => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onModeChange }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
      
      setLoading(true);
      setError('');

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth'
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe",
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 mb-4">
          Un email de réinitialisation a été envoyé à {email}.
        </p>
        <div className="space-y-4">
          <Button variant="outline" onClick={() => onModeChange('login')}>
            Retour à la connexion
          </Button>
          <p className="text-sm text-gray-500">
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
        </div>
      </div>
    );
  }

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
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Envoyer le lien
      </Button>

      <Button
        variant="link"
        className="w-full"
        onClick={() => onModeChange('login')}
        disabled={loading}
      >
        Retour à la connexion
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
