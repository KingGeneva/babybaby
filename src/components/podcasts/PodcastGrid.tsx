
import React from 'react';
import { Podcast } from './types';
import PodcastCard from './PodcastCard';
import { motion } from 'framer-motion';

interface PodcastGridProps {
  podcasts: Podcast[];
  onPlayPodcast: (podcast: Podcast) => void;
}

const PodcastGrid: React.FC<PodcastGridProps> = ({ podcasts, onPlayPodcast }) => {
  if (podcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun podcast ne correspond à votre recherche</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {podcasts.map((podcast) => (
        <motion.div
          key={podcast.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PodcastCard 
            podcast={podcast} 
            onPlay={onPlayPodcast}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PodcastGrid;
