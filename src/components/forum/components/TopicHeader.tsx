
import React from 'react';
import { ForumTopic } from '@/components/forum/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Pin, Lock, User, Clock, Eye, MessageCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { sanitizeHtml } from '@/utils/sanitize';

interface TopicHeaderProps {
  topic: ForumTopic | null;
  formatDate: (dateString: string) => string;
  formatExactDate: (dateString: string) => string;
  handleLikeTopic: () => Promise<void>;
}

const TopicHeader: React.FC<TopicHeaderProps> = ({ 
  topic, 
  formatDate, 
  formatExactDate, 
  handleLikeTopic 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="font-normal p-0"
          onClick={() => topic?.category?.slug ? 
            navigate(`/forum/categories/${topic.category.slug}`) : 
            navigate('/forum')}
        >
          <ChevronLeft size={16} className="mr-1" />
          {topic?.category?.name || 'Forum'}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            {topic?.is_pinned && <Pin size={16} className="text-orange-500" />}
            {topic?.is_locked && <Lock size={16} className="text-gray-500" />}
            <CardTitle className="text-2xl font-bold text-babybaby-cosmic">{topic?.title}</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{topic?.user?.username || 'Utilisateur'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span title={formatExactDate(topic?.created_at || '')}>
                {formatDate(topic?.created_at || '')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{topic?.views_count || 0} vues</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{topic?.posts_count || 0} réponses</span>
            </div>
            <Badge variant="outline" className="ml-auto">
              {topic?.category?.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(topic?.content || '') }} />
        </CardContent>
        <CardFooter className="flex justify-between pt-0 pb-3">
          <div></div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLikeTopic}
            className={topic?.has_liked ? "text-red-500 border-red-200" : ""}
          >
            <Heart 
              size={16} 
              className={`mr-1 ${topic?.has_liked ? "fill-red-500 text-red-500" : ""}`} 
            />
            J'aime {topic?.likes_count ? `(${topic.likes_count})` : ''}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TopicHeader;
