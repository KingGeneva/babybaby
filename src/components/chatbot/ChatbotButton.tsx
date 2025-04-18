
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, BabyIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bonjour ! Je suis BabyBot, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
    sender: 'bot',
    timestamp: new Date()
  }
];

// Sample quick replies
const quickReplies = [
  "Comment fonctionne l'application ?",
  "J'ai besoin d'aide avec le suivi de croissance",
  "Comment ajouter un profil de bébé ?",
  "Parlez-moi des outils disponibles"
];

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Bot responses based on keywords
  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut')) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
    }
    
    if (lowerCaseMessage.includes('profil') || lowerCaseMessage.includes('ajouter bébé')) {
      return "Pour ajouter un profil de bébé, connectez-vous à votre compte, puis cliquez sur 'Ajouter un bébé' dans votre tableau de bord. Vous pourrez ensuite remplir les informations nécessaires.";
    }
    
    if (lowerCaseMessage.includes('croissance') || lowerCaseMessage.includes('poids') || lowerCaseMessage.includes('taille')) {
      return "Le suivi de croissance vous permet d'enregistrer la taille, le poids et le périmètre crânien de votre bébé. Vous pouvez visualiser ces données sur des courbes de croissance et les comparer aux normes de référence.";
    }
    
    if (lowerCaseMessage.includes('outil') || lowerCaseMessage.includes('fonction')) {
      return "BabyBaby propose plusieurs outils : calculateur d'ovulation, générateur de prénoms, bruit blanc pour aider bébé à dormir, suivi de croissance, et bien d'autres. Vous pouvez les découvrir dans la section 'Outils' de l'application.";
    }
    
    if (lowerCaseMessage.includes('compte') || lowerCaseMessage.includes('inscription') || lowerCaseMessage.includes('connexion')) {
      return "Pour créer un compte, cliquez sur 'Se connecter' en haut à droite, puis 'Créer un compte'. L'inscription est gratuite et vous donne accès à toutes les fonctionnalités de base de l'application.";
    }
    
    if (lowerCaseMessage.includes('paiement') || lowerCaseMessage.includes('abonnement') || lowerCaseMessage.includes('premium')) {
      return "BabyBaby propose une version gratuite et une version premium avec des fonctionnalités avancées. Vous pouvez consulter les différentes offres dans la section 'Abonnement' après vous être connecté.";
    }
    
    return "Je ne suis pas sûr de comprendre votre question. Pourriez-vous la reformuler ou choisir l'un des sujets suggérés ci-dessous ?";
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
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
  
  const handleQuickReply = (reply: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: reply,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setIsTyping(true);
    
    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(reply),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          className="bg-babybaby-cosmic text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-babybaby-cosmic/90 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-babybaby-cosmic p-4 text-white flex items-center">
              <BabyIcon className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-semibold">BabyBot</h3>
                <p className="text-xs opacity-80">Assistant virtuel</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="ml-auto text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-babybaby-cosmic text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick replies */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-gray-50 flex overflow-x-auto gap-2">
                {quickReplies.map((reply, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm" 
                    className="whitespace-nowrap text-xs"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Input */}
            <div className="p-3 border-t border-gray-200">
              <form 
                className="flex gap-2" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  type="text"
                  placeholder="Écrivez votre message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                  disabled={isTyping}
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotButton;
