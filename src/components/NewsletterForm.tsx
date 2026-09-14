import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Gift } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SubscriptionBenefits from './subscription/SubscriptionBenefits';
import SocialProof from './subscription/SocialProof';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().trim().email('Email invalide').max(255),
  name: z.string().trim().max(100).optional(),
  age_segment: z.enum(['pregnancy', '0-3m', '4-6m', '7-12m', '1-2y', '2y+', 'unknown']),
  baby_date: z.string().optional(),
});

type Segment = z.infer<typeof newsletterSchema>['age_segment'];

const SEGMENTS: { value: Segment; label: string }[] = [
  { value: 'pregnancy', label: '🤰 Grossesse' },
  { value: '0-3m', label: '👶 0-3 mois' },
  { value: '4-6m', label: '🍼 4-6 mois' },
  { value: '7-12m', label: '🧸 7-12 mois' },
  { value: '1-2y', label: '🚼 1-2 ans' },
  { value: '2y+', label: '🎈 2 ans +' },
  { value: 'unknown', label: '🤔 Préfère ne pas dire' },
];

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [segment, setSegment] = useState<Segment>('unknown');
  const [babyDate, setBabyDate] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const needsDate = segment !== 'unknown';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error('Veuillez accepter notre politique de confidentialité');
      return;
    }
    setSubmitting(true);
    try {
      const validated = newsletterSchema.parse({
        email,
        name: name || undefined,
        age_segment: segment,
        baby_date: babyDate || undefined,
      });

      const payload: {
        email: string;
        age_segment: string;
        baby_birth_date?: string;
        expected_due_date?: string;
      } = {
        email: validated.email,
        age_segment: validated.age_segment,
      };
      if (validated.baby_date) {
        if (validated.age_segment === 'pregnancy') {
          payload.expected_due_date = validated.baby_date;
        } else {
          payload.baby_birth_date = validated.baby_date;
        }
      }

      const { error } = await supabase.from('newsletter_subscribers').insert(payload);
      if (error) {
        if (error.message.toLowerCase().includes('duplicate') || error.code === '23505') {
          toast.error('Cet email est déjà abonné à notre newsletter');
        } else {
          toast.error("Une erreur est survenue lors de l'inscription");
        }
        throw error;
      }

      setSubmitted(true);
      toast.success('Merci ! Contenu adapté à votre étape bébé en route 💌');

      setTimeout(() => {
        setEmail('');
        setName('');
        setBabyDate('');
        setSegment('unknown');
        setConsent(false);
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
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
      lang="fr"
    >
      <h3 className="text-2xl font-bold mb-2 text-center">Du contenu adapté à votre bébé</h3>
      <p className="text-muted-foreground mb-6 text-center text-sm">
        Indiquez l'étape pour recevoir uniquement les conseils qui vous concernent.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-2">
        <div>
          <h4 className="font-semibold mb-4 text-primary">Pourquoi s'abonner ?</h4>
          <SubscriptionBenefits />
          <div className="mt-4">
            <SocialProof compact className="mt-4" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-4">
            <Input
              type="text"
              placeholder="Votre nom (optionnel)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting || submitted}
              aria-label="Votre nom"
            />
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting || submitted}
              aria-label="Votre adresse email"
            />

            <div>
              <Label className="text-sm font-medium mb-2 block">Étape de votre bébé</Label>
              <RadioGroup
                value={segment}
                onValueChange={(v) => setSegment(v as Segment)}
                className="grid grid-cols-2 gap-2"
              >
                {SEGMENTS.map((s) => (
                  <Label
                    key={s.value}
                    htmlFor={`seg-${s.value}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-border cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-xs"
                  >
                    <RadioGroupItem value={s.value} id={`seg-${s.value}`} className="sr-only" />
                    <span>{s.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {needsDate && (
              <div>
                <Label htmlFor="baby-date" className="text-xs text-muted-foreground">
                  {segment === 'pregnancy' ? 'Date prévue (optionnel)' : 'Date de naissance (optionnel)'}
                </Label>
                <Input
                  id="baby-date"
                  type="date"
                  value={babyDate}
                  onChange={(e) => setBabyDate(e.target.value)}
                  disabled={submitting || submitted}
                />
              </div>
            )}
          </div>

          <div className="flex items-start space-x-2 mb-4">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(!!checked)}
              disabled={submitting || submitted}
            />
            <Label htmlFor="consent" className="text-xs text-muted-foreground">
              J'accepte de recevoir des emails de BabyBaby et la{' '}
              <a href="/privacy-policy" className="text-primary underline">
                politique de confidentialité
              </a>
              .
            </Label>
          </div>

          <Button
            type="submit"
            className={`w-full ${submitted ? 'bg-green-500 hover:bg-green-500' : ''}`}
            disabled={submitting || submitted}
          >
            {submitting ? (
              'Inscription…'
            ) : submitted ? (
              <Check size={20} />
            ) : (
              <>
                <Gift size={18} className="mr-2" />
                Recevoir les conseils adaptés
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default NewsletterForm;
