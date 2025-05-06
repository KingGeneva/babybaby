
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface DiscussionProps {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  comments: number;
  likes: number;
  tags: string[];
  lastActive: string;
}

const DiscussionCard = ({ discussion }: { discussion: DiscussionProps }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-medium hover:text-babybaby-cosmic transition-colors">
              <Link to={`/forum/topics/${discussion.id}`}>
                {discussion.title}
              </Link>
            </h4>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Star className="h-4 w-4" />
              <span>{discussion.likes}</span>
              <MessageCircle className="h-4 w-4 ml-2" />
              <span>{discussion.comments}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm my-3 line-clamp-2">
            {discussion.excerpt}
          </p>
          <div className="flex flex-wrap items-center justify-between mt-3">
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
              {discussion.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">Par <span className="font-medium">{discussion.author}</span></span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{discussion.lastActive}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DiscussionCard;
