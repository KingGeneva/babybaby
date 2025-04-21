
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BabyIcon, Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessagesList from "./MessagesList";
import QuickReplies from "./QuickReplies";
import { quickReplies } from "./useChatbot";

type ChatWindowProps = {
  isOpen: boolean;
  close: () => void;
  messages: any[];
  inputValue: string;
  isTyping: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onQuickReply: (msg: string) => void;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  close,
  messages,
  inputValue,
  isTyping,
  onInputChange,
  onSend,
  onQuickReply,
}) => (
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
          {/* BabyIcon n'est pas dans lucide-react, conservons le reste */}
          <span className="h-6 w-6 mr-2">
            <svg height={24} width={24} viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="7" r="5" strokeWidth="2"/><path d="M2 17c1-1 4-3 10-3s9 2 10 3" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          <div>
            <h3 className="font-semibold">BabyBot</h3>
            <p className="text-xs opacity-80">Assistant virtuel</p>
          </div>
          <button
            onClick={close}
            className="ml-auto text-white/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Messages */}
        <MessagesList messages={messages} isTyping={isTyping} />
        {/* Quick replies */}
        <QuickReplies quickReplies={quickReplies} onQuickReply={onQuickReply} show={messages.length <= 2} />
        {/* Input */}
        <div className="p-3 border-t border-gray-200">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              onSend();
            }}
          >
            <Input
              type="text"
              placeholder="Écrivez votre message..."
              value={inputValue}
              onChange={onInputChange}
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
);

export default ChatWindow;
