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

  // Cette fonction prépare l'historique et interroge l'IA sur l'Edge Function
  const fetchAIResponse = async (history: Message[], ajoutUserMsg: string) => {
    try {
      // Conversion de l'historique dans le format esperado par OpenAI
      const gptMessages = history.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })).concat([{ role: "user", content: ajoutUserMsg }]);

      setIsTyping(true);
      const response = await fetch(
        "https://pxynugnbikiwbsqdgewx.functions.supabase.co/chatgpt-babybot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: gptMessages }),
        }
      );
      const data = await response.json();

      return data.content ?? "🤖 Une erreur s'est produite. Veuillez réessayer.";
    } catch (e) {
      return "🤖 La connexion à l'IA a échoué. Vérifiez votre connexion et réessayez.";
    } finally {
      setIsTyping(false);
    }
  };

  // Lorsque l'utilisateur envoie un message
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // On interroge l'agent IA via l'Edge Function
    const aiText = await fetchAIResponse(messages, inputValue);
    const botResponse: Message = {
      id: messages.length + 2,
      text: aiText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  // Quick Reply adapté pour l'IA
  const handleQuickReply = async (reply: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: reply,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);

    const aiText = await fetchAIResponse(messages, reply);
    const botResponse: Message = {
      id: messages.length + 2,
      text: aiText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
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
