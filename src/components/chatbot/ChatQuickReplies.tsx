
import React from 'react';
import { Button } from '@/components/ui/button';
import { QuickReply } from './types';

interface ChatQuickRepliesProps {
  quickReplies: QuickReply[];
  onSelectReply: (reply: string) => void;
}

const ChatQuickReplies: React.FC<ChatQuickRepliesProps> = ({ 
  quickReplies, 
  onSelectReply 
}) => {
  return (
    <div className="px-4 py-2 bg-gray-50 flex overflow-x-auto gap-2">
      {quickReplies.map((reply, index) => (
        <Button 
          key={index} 
          variant="outline" 
          size="sm" 
          className="whitespace-nowrap text-xs"
          onClick={() => onSelectReply(reply)}
        >
          {reply}
        </Button>
      ))}
    </div>
  );
};

export default ChatQuickReplies;
