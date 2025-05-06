
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Logo from '@/components/Logo';

interface EmptyCategoryProps {
  handleCreateTopic: () => void;
}

const EmptyCategory: React.FC<EmptyCategoryProps> = ({ handleCreateTopic }) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <Logo size="md" showText={false} />
      </div>
      <h3 className="text-xl font-medium mb-4">Aucune discussion dans cette catégorie</h3>
      <p className="text-gray-600 mb-6">Soyez le premier à lancer une discussion !</p>
      <Button 
        className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90" 
        onClick={handleCreateTopic}
      >
        <PlusCircle size={18} className="mr-2" />
        Nouvelle discussion
      </Button>
    </div>
  );
};

export default EmptyCategory;
