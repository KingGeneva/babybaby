
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        throw new Error(error.message || 'Une erreur est survenue lors de l\'envoi du message.');
      }

      console.log('Email sent successfully:', data);
      
      toast({
        title: "Message envoyé!",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Reset the form
      setFormData({ name: '', email: '', subject: '', message: '' });
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Mail className="text-babybaby-cosmic h-5 w-5" />, text: "contact@babybaby.org", href: "mailto:contact@babybaby.org" },
    { icon: <Phone className="text-babybaby-cosmic h-5 w-5" />, text: "01 23 45 67 89", href: "tel:0123456789" },
    { icon: <MessageSquare className="text-babybaby-cosmic h-5 w-5" />, text: "Chat en direct", href: "#" }
  ];

  return (
    <section id="contact" className="py-16 bg-gradient-to-t from-babybaby-lightblue/30 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-babybaby-cosmic">Contactez-nous</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une question, une suggestion ? N'hésitez pas à nous contacter. Notre équipe est là pour vous répondre.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="text-xl font-bold mb-6 text-babybaby-cosmic">Envoyez-nous un message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  type="text" 
                  placeholder="Votre nom" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input 
                  type="email" 
                  placeholder="Votre email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input 
                  type="text" 
                  placeholder="Sujet" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="bg-white/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Textarea 
                  placeholder="Votre message" 
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-white/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-babybaby-cosmic hover:bg-sky-600 transition-colors button-glow flex gap-2 items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold mb-6 text-babybaby-cosmic">Nos coordonnées</h3>
              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => (
                  <a 
                    href={item.href}
                    key={index}
                    className="flex items-center gap-3 hover:text-babybaby-cosmic transition-colors group"
                  >
                    <div className="bg-babybaby-lightblue p-2 rounded-full group-hover:bg-babybaby-cosmic/20 transition-colors">
                      {item.icon}
                    </div>
                    <span>{item.text}</span>
                  </a>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h4 className="text-lg font-semibold mb-3 text-babybaby-cosmic">Horaires</h4>
                <p className="text-gray-600 mb-2">Lundi - Vendredi: 9h - 18h</p>
                <p className="text-gray-600">Samedi: 10h - 16h</p>
              </div>
            </div>
            
            <motion.div 
              className="mt-8 text-center p-4 bg-babybaby-pink/20 rounded-lg"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-700 font-medium">
                Rejoignez notre <span className="text-babybaby-cosmic font-semibold">communauté</span> pour échanger avec d'autres parents !
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
