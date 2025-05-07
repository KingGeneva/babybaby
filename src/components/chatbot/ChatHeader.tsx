
import React from 'react';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="bg-babybaby-cosmic p-4 text-white flex items-center">
      <img 
        src="/lovable-uploads/d68c0988-9046-4709-813b-aa748f804176.png" 
        alt="BabyBot" 
        className="h-6 w-6 mr-2" 
      />
      <div>
        <h3 className="font-semibold">BabyBot</h3>
        <p className="text-xs opacity-80">Assistant virtuel</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-auto text-white/80 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChatHeader;
