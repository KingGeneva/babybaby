
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ForumCategory, ForumTopic } from '@/components/forum/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Clock, Eye, Pin, Lock, ChevronRight } from 'lucide-react';

interface TopicListProps {
  topics: ForumTopic[];
  category: ForumCategory | null;
  formatDate: (dateString: string) => string;
}

const TopicList: React.FC<TopicListProps> = ({ topics, category, formatDate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {topics.map(topic => (
        <motion.div key={topic.id} variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link to={`/forum/topics/${topic.id}`} className="block">
                    <div className="flex items-center gap-2">
                      {topic.is_pinned && (
                        <Pin size={16} className="text-orange-500" />
                      )}
                      {topic.is_locked && (
                        <Lock size={16} className="text-gray-500" />
                      )}
                      <h3 className="text-lg font-medium text-babybaby-cosmic truncate hover:text-babybaby-cosmic/80">
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {topic.content}
                    </p>
                  </Link>
                </div>
                <div className="flex flex-col items-end ml-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} />
                    <span>{topic.views_count}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MessageCircle size={14} />
                    <span>{topic.posts_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Heart size={14} className={topic.has_liked ? "text-red-500 fill-red-500" : ""} />
                    <span>{topic.likes_count || 0}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between mt-4 text-xs">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-babybaby-cosmic border-babybaby-cosmic/30">
                    {category?.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock size={14} />
                  <span>{formatDate(topic.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TopicList;
