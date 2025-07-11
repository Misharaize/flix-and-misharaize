
import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { HeroSection } from '@/components/Hero/HeroSection';
import { VideoCarousel } from '@/components/Video/VideoCarousel';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { searchYouTubeVideos, YouTubeVideo } from '@/services/youtubeApi';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [trendingVideos, setTrendingVideos] = useState<YouTubeVideo[]>([]);
  const [musicVideos, setMusicVideos] = useState<YouTubeVideo[]>([]);
  const [techVideos, setTechVideos] = useState<YouTubeVideo[]>([]);
  const [gamingVideos, setGamingVideos] = useState<YouTubeVideo[]>([]);
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        console.log('Loading videos...');
        
        // Load different categories of videos
        const [trending, music, tech, gaming, popular] = await Promise.all([
          searchYouTubeVideos('trending viral 2024', 12),
          searchYouTubeVideos('music hits 2024', 8),
          searchYouTubeVideos('technology review 2024', 8),
          searchYouTubeVideos('gaming highlights 2024', 8),
          searchYouTubeVideos('popular videos 2024', 24)
        ]);

        setTrendingVideos(trending.items);
        setMusicVideos(music.items);
        setTechVideos(tech.items);
        setGamingVideos(gaming.items);
        setAllVideos(popular.items);
        
        console.log('All videos loaded successfully');
      } catch (error) {
        console.error('Error loading videos:', error);
        toast({
          title: "Error loading videos",
          description: "Unable to load videos. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Featured Video Carousels */}
        <VideoCarousel 
          title="🔥 Trending Now" 
          videos={trendingVideos} 
          loading={loading} 
        />
        
        <VideoCarousel 
          title="🎵 Music Hits" 
          videos={musicVideos} 
          loading={loading} 
        />
        
        <VideoCarousel 
          title="💻 Tech Reviews" 
          videos={techVideos} 
          loading={loading} 
        />
        
        <VideoCarousel 
          title="🎮 Gaming" 
          videos={gamingVideos} 
          loading={loading} 
        />
        
        {/* All Videos Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">All Videos</h2>
            <p className="text-muted-foreground">Discover amazing content on Misharaize Flix</p>
          </div>
          
          <VideoGrid videos={allVideos} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
