
import { Header } from '@/components/Layout/Header';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Users, Video, Heart, Eye, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  const userStats = {
    uploads: 15,
    followers: 1250,
    following: 89,
    totalViews: 125000,
    totalLikes: 8900
  };

  const userVideos = [
    {
      id: 'user1',
      title: 'My First Video Tutorial',
      description: 'Learn the basics in this comprehensive tutorial video. Perfect for beginners looking to get started.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '8:45',
      views: 15000,
      likes: 890,
      channelName: user?.username || 'User',
      channelAvatar: user?.avatar,
      publishedAt: '2024-01-20T00:00:00Z',
      tags: ['Tutorial', 'Beginner']
    },
    {
      id: 'user2',
      title: 'Cooking My Favorite Recipe',
      description: 'Join me in the kitchen as I prepare my all-time favorite recipe. Easy to follow steps included!',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      duration: '12:30',
      views: 8500,
      likes: 456,
      channelName: user?.username || 'User',
      channelAvatar: user?.avatar,
      publishedAt: '2024-01-18T00:00:00Z',
      tags: ['Cooking', 'Food']
    }
  ];

  const likedVideos = [
    {
      id: 'liked1',
      title: 'Amazing Tech Review 2024',
      description: 'Comprehensive review of the latest technology trends and gadgets for 2024. Must watch for tech enthusiasts.',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      duration: '15:20',
      views: 450000,
      likes: 25000,
      channelName: 'Tech Reviewer',
      channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techrev',
      publishedAt: '2024-01-15T00:00:00Z',
      tags: ['Technology', 'Review']
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-2xl">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <Button variant="outline" className="mt-2 sm:mt-0">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined January 2024</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Earth</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Content creator passionate about technology, music, and education. 
                  Welcome to my channel!
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.uploads}</div>
                    <div className="text-sm text-muted-foreground">Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{formatNumber(userStats.followers)}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{formatNumber(userStats.totalViews)}</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{formatNumber(userStats.totalLikes)}</div>
                    <div className="text-sm text-muted-foreground">Total Likes</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Liked</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Playlists</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Uploaded Videos ({userVideos.length})</h2>
              <Button asChild>
                <Link to="/upload">
                  Upload New Video
                </Link>
              </Button>
            </div>
            {userVideos.length > 0 ? (
              <VideoGrid videos={userVideos} />
            ) : (
              <div className="text-center py-16">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating content and share it with the world!
                </p>
                <Button asChild>
                  <Link to="/upload">Upload Your First Video</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="liked" className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Liked Videos ({likedVideos.length})</h2>
            </div>
            {likedVideos.length > 0 ? (
              <VideoGrid videos={likedVideos} />
            ) : (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No liked videos</h3>
                <p className="text-muted-foreground">
                  Videos you like will appear here
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="playlists" className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Playlists (0)</h2>
            </div>
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
              <p className="text-muted-foreground mb-4">
                Create playlists to organize your favorite videos
              </p>
              <Button>Create Playlist</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
