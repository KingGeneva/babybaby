
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ForumEditor from '../ForumEditor';

interface ReplyFormProps {
  replyContent: string;
  setReplyContent: (content: string) => void;
  handleSubmitReply: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  replyContent,
  setReplyContent,
  handleSubmitReply,
  submitting
}) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Répondre</h3>
      <Card>
        <CardContent className="p-5">
          <form onSubmit={handleSubmitReply}>
            <ForumEditor 
              value={replyContent}
              onChange={setReplyContent}
              placeholder="Votre réponse..."
              minHeight="200px"
            />
            <div className="flex justify-end mt-4">
              <Button 
                type="submit" 
                className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                disabled={!replyContent.trim() || submitting}
              >
                {submitting ? 'Publication...' : 'Publier'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReplyForm;
