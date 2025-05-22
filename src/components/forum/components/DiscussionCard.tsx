
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

export interface DiscussionProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  replies: number;
  lastActivity: string;
}

interface DiscussionCardProps {
  discussion: DiscussionProps;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      console.error('Invalid date:', dateString, error);
      return 'date inconnue';
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-card p-4 hover:cosmic-glow transition-all duration-300">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border-2 border-babybaby-cosmic/20">
            <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
            <AvatarFallback className="bg-gradient-to-br from-babybaby-cosmic to-blue-400 text-white">{getInitials(discussion.author.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <Link to={`/forum/topics/${discussion.id}`} className="hover:text-babybaby-cosmic">
              <h3 className="font-medium text-lg line-clamp-1">{discussion.title}</h3>
            </Link>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {discussion.excerpt}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{discussion.author.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{formatDate(discussion.lastActivity)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MessageCircle size={12} />
                <span>{discussion.replies} réponses</span>
              </div>
              
              <Badge variant="outline" className="ml-auto text-xs cosmic-border">
                {discussion.category.name}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscussionCard;
