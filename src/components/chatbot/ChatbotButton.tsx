
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Message } from './types';
import { getBotResponse } from './botResponseService';
import ChatWindow from './ChatWindow';

// Sample quick replies
const quickReplies = [
  "Comment fonctionne l'application ?",
  "J'ai besoin d'aide avec le suivi de croissance",
  "Comment ajouter un profil de bébé ?",
  "Parlez-moi des outils disponibles"
];

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bonjour ! Je suis BabyBot, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
    sender: 'bot',
    timestamp: new Date()
  }
];

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const handleSendMessage = (inputValue: string) => {
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          className="bg-babybaby-cosmic text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-babybaby-cosmic/90 transition-colors"
          onClick={toggleChat}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </motion.button>
      </div>
      
      {/* Chat window */}
      <ChatWindow 
        isOpen={isOpen}
        onClose={toggleChat}
        messages={messages}
        quickReplies={quickReplies}
        onSendMessage={handleSendMessage}
        onQuickReplySelect={handleSendMessage}
        isTyping={isTyping}
      />
    </>
  );
};

export default ChatbotButton;
