
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check, Send } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Simule une requête API
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Merci pour votre inscription !");
      
      // Réinitialise après quelques secondes
      setTimeout(() => {
        setEmail('');
        setConsent(false);
        setSubmitted(false);
      }, 3000);
    }, 1500);
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
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow bg-white/50"
            disabled={submitting || submitted}
          />
          <Button 
            type="submit"
            className={`px-8 ${submitted ? 'bg-green-500' : 'bg-babybaby-cosmic'}`}
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
        </div>
        
        <div className="flex items-start space-x-2">
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
      </form>
    </motion.div>
  );
};

export default NewsletterForm;
