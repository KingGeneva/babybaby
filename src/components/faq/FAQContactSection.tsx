import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail } from 'lucide-react';

const FAQContactSection: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 text-center">
      <h3 className="text-xl font-semibold mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button className="flex items-center gap-2 bg-babybaby-cosmic hover:bg-babybaby-cosmic/90">
          <MessageSquare className="h-4 w-4" />
          Discuter avec notre chatbot
        </Button>
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link to="/contact">
            <Mail className="h-4 w-4" />
            Contacter notre équipe
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FAQContactSection;
