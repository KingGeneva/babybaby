
import React from "react";
import type { Message } from "./useChatbot";

type Props = {
  messages: Message[];
  isTyping?: boolean;
};

const MessagesList: React.FC<Props> = ({ messages, isTyping }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.sender === "user"
                ? "bg-babybaby-cosmic text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <p className="text-sm">{message.text}</p>
            <p className="text-xs mt-1 opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesList;
