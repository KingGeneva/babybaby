
import { useState } from "react";

export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bonjour ! Je suis BabyBot, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
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

  const fetchAIResponse = async (history: Message[], ajoutUserMsg: string) => {
    try {
      const gptMessages = history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })).concat([{ role: "user", content: ajoutUserMsg }]);
      setIsTyping(true);
      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: gptMessages }),
      });
      const data = await response.json();
      return data.content ?? "🤖 Une erreur s'est produite. Veuillez réessayer.";
    } catch (e) {
      return "🤖 La connexion à l'IA a échoué. Vérifiez votre connexion et réessayez.";
    } finally {
      setIsTyping(false);
    }
  };

  // Envoi d'un message utilisateur
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMessage]);
    setInputValue('');
    setIsTyping(true);
    const aiText = await fetchAIResponse(messages, inputValue);
    const botResponse: Message = {
      id: messages.length + 2,
      text: aiText,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  // Réponse rapide
  const handleQuickReply = async (reply: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: reply,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMessage]);
    setIsTyping(true);
    const aiText = await fetchAIResponse(messages, reply);
    const botResponse: Message = {
      id: messages.length + 2,
      text: aiText,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
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
