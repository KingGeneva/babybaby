
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { podcastsData } from '@/components/podcasts/podcastsData';
import PodcastGrid from '@/components/podcasts/PodcastGrid';
import { Podcast } from '@/components/podcasts/types';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import SEOHead from '@/components/common/SEOHead';
import PodcastPlayer from '@/components/podcasts/PodcastPlayer';

const PodcastsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  const filteredPodcasts = podcastsData.filter(podcast => {
    return podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           podcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           podcast.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePlayPodcast = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    
    // Scroll to player if selected
    setTimeout(() => {
      document.getElementById('podcast-player')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead 
        title="Podcasts pour Parents | BabyBaby"
        description="Écoutez notre collection de podcasts gratuits pour accompagner les parents. Discussions avec des experts sur le sommeil, l'alimentation, le développement et plus."
        canonicalUrl="https://babybaby.app/podcasts"
      />
      
      <NavBar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 text-babybaby-cosmic">
                Podcasts BabyBaby
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Des conversations avec des experts pour vous accompagner dans votre parcours parental
              </p>
            </div>
            
            {selectedPodcast && (
              <div className="mb-10" id="podcast-player">
                <PodcastPlayer podcast={selectedPodcast} />
              </div>
            )}
            
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un podcast..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <PodcastGrid 
              podcasts={filteredPodcasts} 
              onPlayPodcast={handlePlayPodcast}
            />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PodcastsPage;
