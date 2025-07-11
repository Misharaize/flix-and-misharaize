
import { Header } from '@/components/Layout/Header';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfilePictureUpload } from '@/components/Profile/ProfilePictureUpload';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Video, Heart, Settings, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [showPictureUpload, setShowPictureUpload] = useState(false);
  const { toast } = useToast();

  const userStats = {
    uploads: 15,
    followers: 1250,
    following: 89,
    totalViews: 125000,
    totalLikes: 8900
  };

  const [userVideos, setUserVideos] = useState([
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
  ]);

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

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (user && updateUser) {
      updateUser({ ...user, avatar: newAvatarUrl });
    }
    setShowPictureUpload(false);
  };

  const handleDeleteVideo = (videoId: string) => {
    const videoToDelete = userVideos.find(v => v.id === videoId);
    if (videoToDelete) {
      const confirmDelete = window.confirm(`Are you sure you want to delete "${videoToDelete.title}"? This action cannot be undone.`);
      if (confirmDelete) {
        setUserVideos(prev => prev.filter(v => v.id !== videoId));
        toast({
          title: "Video deleted",
          description: "Your video has been successfully deleted.",
        });
      }
    }
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
              <div className="relative">
                <Avatar 
                  className="h-32 w-32 border-4 border-primary cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowPictureUpload(true)}
                >
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                  <Settings className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <Button 
                      variant="outline"
                      onClick={() => setShowPictureUpload(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
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

        {/* Profile Picture Upload Modal */}
        {showPictureUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Update Profile Picture</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPictureUpload(false)}
                >
                  ✕
                </Button>
              </div>
              <ProfilePictureUpload
                currentAvatar={user.avatar}
                username={user.username}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </div>
          </div>
        )}

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
              <Video className="h-4 w-4" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userVideos.map((video) => (
                  <div key={video.id} className="relative group">
                    <div 
                      className="relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => window.open(`/watch/${video.id}`, '_blank')}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{formatNumber(video.views)} views</span>
                          <span>•</span>
                          <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(video.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
