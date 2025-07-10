
import { Header } from '@/components/Layout/Header';
import { HeroSection } from '@/components/Hero/HeroSection';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockVideos = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '3:33',
      views: 1400000000,
      likes: 15000000,
      channelName: 'Rick Astley',
      channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mNLbKmoXEefGPvlJ6a7qC5eD3BnrjHm2vp-KdAO9mEQIE=s176-c-k-c0x00ffffff-no-rj',
      publishedAt: '2009-10-25T00:00:00Z',
      tags: ['Music', 'Classic', '80s']
    },
    {
      id: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      duration: '4:42',
      views: 8200000000,
      likes: 50000000,
      channelName: 'Luis Fonsi',
      channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mVCOVv5QVHqrvjE3L48vTPwCjY8RO5NyIZRN4g5b8o8wE=s176-c-k-c0x00ffffff-no-rj',
      publishedAt: '2017-01-12T00:00:00Z',
      tags: ['Music', 'Latin', 'Pop']
    },
    {
      id: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE(강남스타일) M/V',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      duration: '4:13',
      views: 4800000000,
      likes: 25000000,
      channelName: 'officialpsy',
      channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_kQSVfIzXsqCmTQy-eBJ8sZBtH5GcI8lgTWOcNSyKQFjQo=s176-c-k-c0x00ffffff-no-rj',
      publishedAt: '2012-07-15T00:00:00Z',
      tags: ['Music', 'K-Pop', 'Dance']
    },
    {
      id: 'fJ9rUzIMcZQ',
      title: 'Queen – Bohemian Rhapsody (Official Video Remastered)',
      thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
      duration: '5:55',
      views: 1900000000,
      likes: 18000000,
      channelName: 'Queen Official',
      channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_klNGJJ0YsOjwB54E5EjE_v4EG0YXPqZUKGYhHj1O6rOpI=s176-c-k-c0x00ffffff-no-rj',
      publishedAt: '2008-08-01T00:00:00Z',
      tags: ['Music', 'Rock', 'Classic']
    },
    {
      id: 'L_jWHffIx5E',
      title: 'Marshmello ft. Bastille - Happier (Official Music Video)',
      thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg',
      duration: '3:54',
      views: 3200000000,
      likes: 23000000,
      channelName: 'Marshmello',
      channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_leZKk1KHdkBx-TqCd6FZKxM8LOpBSdlwz9f_IwUeFqH94=s176-c-k-c0x00ffffff-no-rj',
      publishedAt: '2018-08-17T00:00:00Z',
      tags: ['EDM', 'Pop', 'Electronic']
    },
    {
      id: 'YQHsXMglC9A',
      title: 'Adele - Hello (Official Music Video)',
      thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg',
      duration: '6:07',
      views: 3500000000,
      likes: 16000000,
      channelName: 'Adele',
      channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mNh6lMNPYnE7RCF-HnNNMLKJhPSQWZ6RTUt7d7wNH6bYI=s176-c-k-c0x00ffffff-no-rj',
      publishedAt: '2015-10-22T00:00:00Z',
      tags: ['Music', 'Pop', 'Soul']
    },
    {
      id: 'JGwWNGJdvx8',
      title: 'Ed Sheeran - Shape of You (Official Video)',
      thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      duration: '4:24',
      views: 5900000000,
      likes: 33000000,
      channelName: 'Ed Sheeran',
      channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mUZL5cg8-Tl2kBLWgHbD6KuUhLPsRN4k0bw5RQrRFBhJw=s176-c-k-c0x00ffffff-no-rj',
      publishedAt: '2017-01-30T00:00:00Z',
      tags: ['Music', 'Pop', 'Acoustic']
    },
    {
      id: '60ItHLz5WEA',
      title: 'Alan Walker - Faded',
      thumbnail: 'https://img.youtube.com/vi/60ItHLz5WEA/maxresdefault.jpg',
      duration: '3:32',
      views: 3100000000,
      likes: 21000000,
      channelName: 'Alan Walker',
      channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_n4vKMz0YRqDZqD-3Pk5KRTj7TDR8RTXgcWU0FoBKGLj7o=s176-c-k-c0x00ffffff-no-rj',
      publishedAt: '2015-12-03T00:00:00Z',
      tags: ['EDM', 'Electronic', 'Progressive House']
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTrendingVideos(mockVideos);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Video Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending">
            <div>
              <h2 className="text-2xl font-bold mb-6">Trending Videos</h2>
              <VideoGrid videos={trendingVideos} loading={loading} />
            </div>
          </TabsContent>
          
          <TabsContent value="music">
            <div>
              <h2 className="text-2xl font-bold mb-6">Music Videos</h2>
              <VideoGrid 
                videos={trendingVideos.filter(video => 
                  video.tags?.some(tag => ['Music', 'Pop', 'Rock', 'EDM'].includes(tag))
                )} 
                loading={loading} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="gaming">
            <div>
              <h2 className="text-2xl font-bold mb-6">Gaming Content</h2>
              <VideoGrid videos={[]} loading={false} />
              <div className="text-center py-12">
                <p className="text-muted-foreground">No gaming content available yet. Check back later!</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
