
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating?: number;
  photoUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Marie L.",
    role: "Maman d'un bébé de 6 mois",
    content: "BabyBaby m'a aidée à suivre chaque étape du développement de mon fils. Les conseils hebdomadaires sont précieux !",
    rating: 5
  },
  {
    name: "Thomas R.",
    role: "Papa de jumeaux",
    content: "L'abonnement vaut vraiment le coup. Les outils exclusifs m'ont aidé à organiser notre routine familiale.",
    rating: 5
  },
  {
    name: "Sophie M.",
    role: "Nouvelle maman",
    content: "Je recommande la newsletter à toutes les mamans. Des conseils personnalisés chaque semaine !",
    rating: 4
  }
];

interface SocialProofProps {
  testimonialIndex?: number;
  compact?: boolean;
  className?: string;
}

const SocialProof: React.FC<SocialProofProps> = ({ 
  testimonialIndex = 0,
  compact = false,
  className = ""
}) => {
  const testimonial = testimonials[testimonialIndex % testimonials.length];
  
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600">
          Plus de 2000 parents abonnés
        </p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className={`bg-white/80 p-4 rounded-lg shadow-sm ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-sm italic mb-2">"{testimonial.content}"</p>
          <div className="flex mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <div>
            <p className="text-xs font-medium">{testimonial.name}</p>
            <p className="text-xs text-gray-600">{testimonial.role}</p>
          </div>
        </div>
        
        {testimonial.photoUrl && (
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={testimonial.photoUrl} alt={testimonial.name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SocialProof;
