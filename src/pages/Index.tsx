
import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { HeroSection } from '@/components/Hero/HeroSection';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { searchYouTubeVideos, YouTubeVideo } from '@/services/youtubeApi';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [trendingVideos, setTrendingVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTrendingVideos = async () => {
      try {
        console.log('Loading trending videos...');
        // Search for popular/trending content
        const response = await searchYouTubeVideos('trending popular 2024', 24);
        setTrendingVideos(response.items);
        console.log('Trending videos loaded:', response.items.length);
      } catch (error) {
        console.error('Error loading trending videos:', error);
        toast({
          title: "Error loading videos",
          description: "Unable to load trending videos. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrendingVideos();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Trending Videos</h2>
          <p className="text-muted-foreground">Discover the most popular videos on Misharaize Flix</p>
        </div>
        
        <VideoGrid videos={trendingVideos} loading={loading} />
      </div>
    </div>
  );
};

export default Index;
