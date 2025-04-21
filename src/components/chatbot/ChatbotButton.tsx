
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useChatbot } from './useChatbot';

const ChatbotButton = () => {
  const {
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
  } = useChatbot();

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          className="bg-babybaby-cosmic text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-babybaby-cosmic/90 transition-colors"
          onClick={toggleOpen}
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

      <ChatWindow
        isOpen={isOpen}
        close={close}
        messages={messages}
        inputValue={inputValue}
        isTyping={isTyping}
        onInputChange={onInputChange}
        onSend={handleSendMessage}
        onQuickReply={handleQuickReply}
      />
    </>
  );
};

export default ChatbotButton;
