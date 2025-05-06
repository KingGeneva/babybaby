
import React from 'react';
import { ForumPost } from '@/components/forum/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp } from 'lucide-react';

interface PostItemProps {
  post: ForumPost;
  index: number;
  page: number;
  formatDate: (dateString: string) => string;
  formatExactDate: (dateString: string) => string;
  handleLikePost: (postId: string) => Promise<void>;
  getInitials: (name?: string) => string;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  index,
  page,
  formatDate,
  formatExactDate,
  handleLikePost,
  getInitials
}) => {
  return (
    <Card id={`post-${post.id}`} className="relative">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user?.avatar_url} alt={post.user?.username || 'Utilisateur'} />
            <AvatarFallback>{getInitials(post.user?.username)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div className="font-medium">
                {post.user?.username || 'Utilisateur'}
              </div>
              <div className="text-sm text-gray-500" title={formatExactDate(post.created_at)}>
                {formatDate(post.created_at)}
              </div>
            </div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="flex justify-end mt-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleLikePost(post.id)}
                className={post.has_liked ? "text-red-500" : "text-gray-500"}
              >
                <ThumbsUp 
                  size={16} 
                  className={`mr-1 ${post.has_liked ? "fill-red-500 text-red-500" : ""}`} 
                />
                {post.likes_count || 0}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="absolute top-2 right-2 text-xs text-gray-400">
        #{index + 1 + (page - 1) * 10}
      </div>
    </Card>
  );
};

export default PostItem;
