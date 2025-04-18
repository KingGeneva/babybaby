
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check, Send } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }
    
    if (!consent) {
      toast.error("Veuillez accepter notre politique de confidentialité");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          name: name || null,
          consent_given: true
        });

      if (error) {
        if (error.message.includes('Email already subscribed')) {
          toast.error("Cet email est déjà abonné à notre newsletter");
        } else {
          toast.error("Une erreur est survenue lors de l'inscription");
        }
        throw error;
      }

      setSubmitted(true);
      toast.success("Merci pour votre inscription !");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setEmail('');
        setName('');
        setConsent(false);
        setSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="glass-card p-6 md:p-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-4 text-center">Restez Informé</h3>
      <p className="text-gray-700 mb-6 text-center">
        Inscrivez-vous à notre newsletter pour recevoir nos conseils parentaux et être informé des nouvelles fonctionnalités.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-4">
          <Input
            type="text"
            placeholder="Votre nom (optionnel)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/50"
            disabled={submitting || submitted}
          />
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/50"
            required
            disabled={submitting || submitted}
          />
        </div>
        
        <div className="flex items-start space-x-2 mb-4">
          <Checkbox 
            id="consent" 
            checked={consent}
            onCheckedChange={(checked) => setConsent(!!checked)}
            disabled={submitting || submitted}
          />
          <Label htmlFor="consent" className="text-sm text-gray-600">
            J'accepte de recevoir des emails de BabyBaby et j'ai lu et compris la <a href="#" className="text-babybaby-cosmic underline">politique de confidentialité</a>. Je peux me désinscrire à tout moment.
          </Label>
        </div>
        
        <Button 
          type="submit"
          className={`w-full ${submitted ? 'bg-green-500' : 'bg-babybaby-cosmic'}`}
          disabled={submitting || submitted}
        >
          {submitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" cy="12" r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </motion.div>
          ) : submitted ? (
            <Check size={20} />
          ) : (
            <Send size={20} />
          )}
          <span className="ml-2">
            {submitted ? 'Inscrit' : 'S\'inscrire'}
          </span>
        </Button>
      </form>
    </motion.div>
  );
};

export default NewsletterForm;
