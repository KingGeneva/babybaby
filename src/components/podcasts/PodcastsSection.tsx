
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Podcast } from './types';
import { podcastsData } from './podcastsData';
import PodcastPlayer from './PodcastPlayer';
import PodcastCard from './PodcastCard';

const PodcastsSection: React.FC = () => {
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  
  const handlePlayPodcast = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    
    // Scroll to player if on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('podcast-player')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };
  
  // Show only the first 3 podcasts on homepage
  const featuredPodcasts = podcastsData.slice(0, 3);
  
  return (
    <section className="py-16 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Headphones className="mx-auto h-10 w-10 text-babybaby-cosmic mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">Podcasts BabyBaby</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des discussions enrichissantes avec des experts pour vous accompagner dans votre parcours parental
          </p>
        </motion.div>

        {selectedPodcast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
            id="podcast-player"
          >
            <PodcastPlayer podcast={selectedPodcast} />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {featuredPodcasts.map((podcast) => (
            <motion.div
              key={podcast.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <PodcastCard 
                podcast={podcast} 
                onPlay={handlePlayPodcast}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button 
            variant="link" 
            className="text-babybaby-cosmic"
            asChild
          >
            <Link to="/podcasts">
              Voir tous nos podcasts
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PodcastsSection;
