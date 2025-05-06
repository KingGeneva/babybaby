
import React from 'react';
import { ForumPost } from '@/components/forum/types';
import { MessageCircle } from 'lucide-react';
import PostItem from './PostItem';
import ForumPagination from '../ForumPagination';

interface TopicRepliesProps {
  posts: ForumPost[];
  page: number;
  totalPages: number;
  formatDate: (dateString: string) => string;
  formatExactDate: (dateString: string) => string;
  handleLikePost: (postId: string) => Promise<void>;
  handlePageChange: (newPage: number) => void;
  getInitials: (name?: string) => string;
}

const TopicReplies: React.FC<TopicRepliesProps> = ({
  posts,
  page,
  totalPages,
  formatDate,
  formatExactDate,
  handleLikePost,
  handlePageChange,
  getInitials
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">
        Réponses {posts.length > 0 ? `(${posts.length})` : ''}
      </h2>
      
      {posts.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <MessageCircle size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Aucune réponse pour le moment.</p>
          <p className="text-gray-600">Soyez le premier à répondre !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <PostItem 
              key={post.id}
              post={post}
              index={index}
              page={page}
              formatDate={formatDate}
              formatExactDate={formatExactDate}
              handleLikePost={handleLikePost}
              getInitials={getInitials}
            />
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="mt-6">
          <ForumPagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
    </div>
  );
};

export default TopicReplies;
