
import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  quickReplies: string[];
  onQuickReply: (msg: string) => void;
  show: boolean;
};

const QuickReplies: React.FC<Props> = ({ quickReplies, onQuickReply, show }) => {
  if (!show) return null;
  return (
    <div className="px-4 py-2 bg-gray-50 flex overflow-x-auto gap-2">
      {quickReplies.map((reply, idx) => (
        <Button
          key={idx}
          variant="outline"
          size="sm"
          className="whitespace-nowrap text-xs"
          onClick={() => onQuickReply(reply)}
        >
          {reply}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplies;
