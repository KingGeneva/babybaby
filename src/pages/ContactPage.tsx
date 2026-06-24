import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Loader2,
  MapPin,
  Clock,
  LifeBuoy,
  Handshake,
  Newspaper,
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import SEOHead from '@/components/common/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EMAIL = 'contact@babybaby.org';
const PHONE_DISPLAY = '1 (581) 436-BABY';
const PHONE_E164 = '+15814362229'; // BABY = 2229

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom doit faire moins de 100 caractères'),
  email: z
    .string()
    .trim()
    .email('Courriel invalide')
    .max(255, 'Le courriel doit faire moins de 255 caractères'),
  subject: z
    .string()
    .trim()
    .min(1, 'Le sujet est requis')
    .max(200, 'Le sujet doit faire moins de 200 caractères'),
  message: z
    .string()
    .trim()
    .min(10, 'Le message doit faire au moins 10 caractères')
    .max(2000, 'Le message doit faire moins de 2000 caractères'),
});

const topics = [
  { value: 'support', label: 'Aide et support' },
  { value: 'partenariat', label: 'Partenariat / Collaboration' },
  { value: 'presse', label: 'Presse / Médias' },
  { value: 'confidentialite', label: 'Confidentialité / Données' },
  { value: 'autre', label: 'Autre demande' },
];

const channels = [
  {
    icon: LifeBuoy,
    title: 'Aide et support',
    description: 'Une question sur l’application, ton compte ou un cours ?',
    action: { label: 'Voir la FAQ', href: '/faq' },
  },
  {
    icon: Handshake,
    title: 'Partenariats',
    description: 'Marques, professionnels et organismes — écrivons-nous.',
    action: { label: 'Écrire à l’équipe', href: `mailto:${EMAIL}?subject=Partenariat` },
  },
  {
    icon: Newspaper,
    title: 'Presse & médias',
    description: 'Demandes d’entrevues, citations, dossier de presse.',
    action: { label: 'Contacter la presse', href: `mailto:${EMAIL}?subject=Demande%20presse` },
  },
  {
    icon: ShieldCheck,
    title: 'Confidentialité',
    description: 'Questions sur tes données ou exercice de tes droits (Loi 25).',
    action: { label: 'Nous écrire', href: `mailto:${EMAIL}?subject=Confidentialit%C3%A9` },
  },
];

const faqs = [
  {
    q: 'Quel est le délai de réponse ?',
    a: 'Nous répondons généralement sous 1 à 2 jours ouvrables, du lundi au vendredi (heure de l’Est). Les demandes urgentes liées à la santé doivent être dirigées vers Info-Santé 811 ou le 911 en cas d’urgence.',
  },
  {
    q: 'Offrez-vous un soutien médical par téléphone ?',
    a: 'Non. BabyBaby n’est pas un service médical. Pour toute préoccupation de santé, contacte ton CLSC, Info-Santé 811, ou consulte ta ou ton pédiatre.',
  },
  {
    q: 'Comment proposer un partenariat ?',
    a: 'Écris-nous à contact@babybaby.org avec « Partenariat » en objet, ton organisation et le contexte. Nous revenons vers toi rapidement.',
  },
  {
    q: 'Comment exercer mes droits sur mes données ?',
    a: 'Conformément à la Loi 25 (Québec), tu peux demander l’accès, la rectification ou la suppression de tes données en écrivant à contact@babybaby.org.',
  },
];

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    topic: 'support',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const subjectWithTopic = `[${
        topics.find((t) => t.value === formData.topic)?.label ?? 'Contact'
      }] ${formData.subject}`;

      const validated = contactSchema.parse({
        name: formData.name,
        email: formData.email,
        subject: subjectWithTopic,
        message: formData.message,
      });

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: validated,
      });

      if (error) {
        throw new Error(
          error.message || "Une erreur est survenue lors de l'envoi du message.",
        );
      }

      toast({
        title: 'Message envoyé !',
        description: 'Nous te répondrons dans les plus brefs délais.',
      });
      setFormData({ name: '', email: '', subject: '', topic: 'support', message: '' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Erreur de validation',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erreur',
          description:
            error.message || "Une erreur est survenue lors de l'envoi du message.",
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact BabyBaby',
    url: 'https://babybaby.org/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'BabyBaby',
      url: 'https://babybaby.org',
      email: EMAIL,
      telephone: PHONE_E164,
      areaServed: 'CA-QC',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: EMAIL,
          telephone: PHONE_E164,
          areaServed: 'CA',
          availableLanguage: ['French', 'English'],
        },
      ],
    },
  };

  return (
    <>
      <SEOHead
        title="Contact"
        description="Contacte l’équipe BabyBaby : courriel contact@babybaby.org, téléphone 1 (581) 436-BABY, et formulaire de contact. Réponse sous 1 à 2 jours ouvrables."
        canonicalUrl="/contact"
        keywords={['contact babybaby', 'support parents', 'aide bébé québec', 'partenariat']}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(contactStructuredData)}
        </script>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-babybaby-lightblue/20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-babybaby-cosmic/10 via-transparent to-babybaby-pink/10 pointer-events-none" />
          <div className="container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-babybaby-cosmic/10 text-babybaby-cosmic mb-4">
                Nous joindre
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Parlons de toi et de ton bébé
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Une question, un besoin d’aide ou une idée à partager ? Notre équipe
                au Québec te répond avec bienveillance, sous 1 à 2 jours ouvrables.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
                  <a href={`mailto:${EMAIL}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    {EMAIL}
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`tel:${PHONE_E164}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {PHONE_DISPLAY}
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick info cards */}
        <section className="container mx-auto px-4 -mt-4 md:-mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              {
                icon: Mail,
                title: 'Courriel',
                value: EMAIL,
                href: `mailto:${EMAIL}`,
                note: 'Réponse en 1 à 2 jours ouvrables',
              },
              {
                icon: Phone,
                title: 'Téléphone',
                value: PHONE_DISPLAY,
                href: `tel:${PHONE_E164}`,
                note: 'Lun–Ven, 9h–17h (HE)',
              },
              {
                icon: MapPin,
                title: 'Basés au Québec',
                value: 'Québec, Canada',
                href: '#',
                note: 'Service en français et en anglais',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={i}
                  href={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-babybaby-lightblue text-babybaby-cosmic group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-foreground font-medium break-all">{item.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                </motion.a>
              );
            })}
          </div>
        </section>

        {/* Form + Sidebar */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Écris-nous un message
              </h2>
              <p className="text-muted-foreground mb-6">
                Remplis le formulaire ci-dessous. Plus tu nous donnes de contexte,
                mieux nous pourrons t’aider.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ex. Marie Tremblay"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Courriel</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="prenom@exemple.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Sujet de la demande</Label>
                    <Select
                      value={formData.topic}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, topic: value }))
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="topic">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Titre du message</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="En quelques mots…"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      maxLength={200}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Ton message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Décris ta demande, ton contexte, et toute information utile (âge du bébé, etc.)."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.message.length}/2000
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  En soumettant ce formulaire, tu acceptes que nous utilisions tes
                  informations pour te répondre, conformément à notre politique de
                  confidentialité.
                </p>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer mon message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-babybaby-cosmic" />
                  <h3 className="font-semibold text-foreground">Heures de service</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Lundi – Vendredi : 9 h – 17 h (HE)</li>
                  <li>Samedi : 10 h – 14 h (HE)</li>
                  <li>Dimanche : fermé</li>
                </ul>
                <Separator className="my-4" />
                <p className="text-xs text-muted-foreground">
                  Réponse moyenne par courriel : sous 24 h en semaine.
                </p>
              </div>

              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Urgence santé bébé ?
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  BabyBaby n’est pas un service d’urgence. En cas de doute :
                </p>
                <ul className="text-sm text-foreground space-y-1">
                  <li>
                    <strong>911</strong> — urgence vitale
                  </li>
                  <li>
                    <strong>Info-Santé 811</strong> — conseils infirmiers 24/7
                  </li>
                  <li>
                    <strong>CLSC</strong> — soutien périnatal local
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-3">Suis-nous</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
                    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.label}
                        className="p-2 rounded-xl bg-babybaby-lightblue text-babybaby-cosmic hover:bg-babybaby-cosmic hover:text-white transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* Channels */}
        <section className="container mx-auto px-4 pb-12 md:pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Choisis le bon canal
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Selon ta demande, nous t’orientons vers la personne ou la ressource
                la plus utile.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {channels.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col"
                  >
                    <div className="p-2 rounded-xl bg-babybaby-lightblue text-babybaby-cosmic w-fit mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1">
                      {c.description}
                    </p>
                    <Button
                      asChild
                      variant="link"
                      className="px-0 mt-3 text-babybaby-cosmic justify-start"
                    >
                      {c.action.href.startsWith('http') || c.action.href.startsWith('mailto') ? (
                        <a href={c.action.href}>{c.action.label} →</a>
                      ) : (
                        <Link to={c.action.href}>{c.action.label} →</Link>
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Questions fréquentes
              </h2>
              <p className="text-muted-foreground">
                Une réponse rapide est peut-être déjà là.
              </p>
            </div>
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-4">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-6">
              <Button asChild variant="outline">
                <Link to="/faq">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Voir toutes les FAQ
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;
