
import React from 'react';
import { motion } from 'framer-motion';
import { Podcast } from './types';
import { Play, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

interface PodcastCardProps {
  podcast: Podcast;
  onPlay: (podcast: Podcast) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast, onPlay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="aspect-square rounded-md overflow-hidden mb-2 relative group">
            <img 
              src={podcast.coverImage} 
              alt={podcast.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="default" 
                className="bg-white text-babybaby-cosmic rounded-full hover:bg-gray-100"
                size="icon"
                onClick={() => onPlay(podcast)}
              >
                <Play className="h-5 w-5 ml-0.5" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <Badge variant="outline" className="text-xs bg-babybaby-cosmic/10 text-babybaby-cosmic border-babybaby-cosmic/30">
              {podcast.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {podcast.duration}
            </Badge>
          </div>
          <CardTitle className="text-lg font-bold leading-tight">{podcast.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-gray-600 line-clamp-3">
            {podcast.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex w-full justify-between items-center">
            <div className="text-sm text-gray-500">{podcast.date}</div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-babybaby-cosmic hover:text-babybaby-cosmic/90 hover:bg-babybaby-cosmic/10 p-2"
              onClick={() => onPlay(podcast)}
            >
              <Headphones className="h-4 w-4 mr-1" />
              Écouter
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PodcastCard;
