
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bonjour ! Je suis BabyBot, votre assistant parental expert. Comment puis-je vous aider aujourd'hui ?",
    sender: "bot",
    timestamp: new Date(),
  },
];

// Réponses rapides par défaut
export const quickReplies = [
  "Comment fonctionne l'application ?",
  "J'ai besoin d'aide avec le suivi de croissance",
  "Comment ajouter un profil de bébé ?",
  "Parlez-moi des outils disponibles",
];

const CHATBOT_API_URL = "https://pxynugnbikiwbsqdgewx.functions.supabase.co/chatgpt-babybot";

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Gère l'ouverture/fermeture
  const toggleOpen = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  const fetchAIResponse = async (history: Message[], userMsg: string) => {
    try {
      const gptMessages = history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })).concat([{ role: "user", content: userMsg }]);
      
      setIsTyping(true);
      
      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: gptMessages }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API ChatGPT:", errorText);
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.content) {
        throw new Error("Réponse invalide du serveur");
      }
      
      return data.content;
    } catch (e) {
      console.error("Erreur chatbot:", e);
      toast({
        title: "Erreur de communication",
        description: "Impossible de contacter l'assistant. Veuillez réessayer.",
        variant: "destructive",
      });
      return "🤖 Une erreur s'est produite. Veuillez réessayer dans un instant.";
    } finally {
      setIsTyping(false);
    }
  };

  // Envoi d'un message utilisateur
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    
    // Créer et ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    
    // Déclencher l'affichage de l'indicateur de frappe
    setIsTyping(true);
    
    try {
      // Obtenir la réponse de l'IA
      const aiText = await fetchAIResponse(messages, inputValue);
      
      // Créer et ajouter le message de réponse du bot
      const botResponse: Message = {
        id: messages.length + 2,
        text: aiText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Réponse rapide
  const handleQuickReply = async (reply: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: reply,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsTyping(true);
    
    try {
      const aiText = await fetchAIResponse(messages, reply);
      
      const botResponse: Message = {
        id: messages.length + 2,
        text: aiText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse rapide:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Entrée utilisateur
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  return {
    isOpen,
    toggleOpen,
    close,
    messages,
    inputValue,
    isTyping,
    setInputValue,
    handleSendMessage,
    handleQuickReply,
    onInputChange,
  };
}
