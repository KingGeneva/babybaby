
import React, { useRef, useEffect } from 'react';
import { Message } from './types';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatTypingIndicator from './ChatTypingIndicator';
import ChatQuickReplies from './ChatQuickReplies';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  quickReplies: string[];
  onSendMessage: (message: string) => void;
  onQuickReplySelect: (reply: string) => void;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  quickReplies,
  onSendMessage,
  onQuickReplySelect,
  isTyping
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col opacity-0 scale-95 animate-enter"
      style={{
        animation: 'fadeIn 0.2s ease-out forwards',
      }}
    >
      <ChatHeader onClose={onClose} />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && <ChatTypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length <= 2 && (
        <ChatQuickReplies 
          quickReplies={quickReplies}
          onSelectReply={onQuickReplySelect}
        />
      )}
      
      <ChatInput onSendMessage={onSendMessage} isTyping={isTyping} />
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
