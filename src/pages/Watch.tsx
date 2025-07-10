
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Share, Download, Flag, Eye, Calendar, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Watch = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);

  // Mock video data
  const mockVideo = {
    id: videoId,
    title: 'Amazing Tech Tutorial - Learn Web Development in 2024',
    description: `Welcome to our comprehensive web development tutorial! In this video, we'll cover everything you need to know to get started with modern web development.

🚀 What you'll learn:
- HTML5 fundamentals
- CSS3 and modern styling
- JavaScript ES6+
- React.js basics
- API integration
- Deployment strategies

📚 Resources mentioned:
- Free code editor: VS Code
- Documentation: MDN Web Docs
- Practice platform: freeCodeCamp

⏰ Timestamps:
00:00 - Introduction
02:30 - HTML Basics
08:15 - CSS Styling
15:40 - JavaScript Fundamentals
25:20 - React Introduction
35:10 - Building a Project
45:30 - Deployment

Don't forget to like and subscribe for more tutorials!`,
    channelName: 'WebDev Pro',
    channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=webdev',
    views: 1250000,
    likes: 85000,
    dislikes: 1200,
    publishedAt: '2024-01-15T00:00:00Z',
    tags: ['Programming', 'Web Development', 'Tutorial', 'JavaScript', 'React']
  };

  const mockComments = [
    {
      id: '1',
      user: 'CodeMaster99',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=codemaster',
      content: 'This is exactly what I needed! The explanation is so clear and easy to follow.',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: '2',
      user: 'DevNewbie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newbie',
      content: 'Started my web dev journey with this video. Amazing tutorial!',
      timestamp: '5 hours ago',
      likes: 8
    },
    {
      id: '3',
      user: 'TechEnthusiast',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
      content: 'Love the production quality and the step-by-step approach. Keep it up!',
      timestamp: '1 day ago',
      likes: 25
    }
  ];

  const mockRelatedVideos = [
    {
      id: 'related1',
      title: 'Advanced JavaScript Concepts',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '18:30',
      views: 850000,
      likes: 45000,
      channelName: 'WebDev Pro',
      channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=webdev',
      publishedAt: '2024-01-10T00:00:00Z',
      tags: ['JavaScript', 'Advanced', 'Programming']
    },
    {
      id: 'related2',
      title: 'React Hooks Complete Guide',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      duration: '25:15',
      views: 920000,
      likes: 52000,
      channelName: 'React Masters',
      channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=react',
      publishedAt: '2024-01-12T00:00:00Z',
      tags: ['React', 'Hooks', 'Tutorial']
    }
  ];

  useEffect(() => {
    // Simulate loading video data
    setVideo(mockVideo);
    setComments(mockComments);
    setRelatedVideos(mockRelatedVideos);
  }, [videoId]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffInDays = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && user) {
      const newComment = {
        id: Date.now().toString(),
        user: user.username,
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        content: comment.trim(),
        timestamp: 'Just now',
        likes: 0
      };
      setComments([newComment, ...comments]);
      setComment('');
    }
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="aspect-video bg-muted rounded-lg mb-4"></div>
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg mb-4 relative overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              
              {/* Stats and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(video.views)} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{timeAgo(video.publishedAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{formatNumber(video.likes + (liked ? 1 : 0))}</span>
                  </Button>
                  <Button
                    variant={disliked ? "default" : "outline"}
                    size="sm"
                    onClick={handleDislike}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{formatNumber(video.dislikes + (disliked ? 1 : 0))}</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Channel Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={video.channelAvatar} alt={video.channelName} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{video.channelName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">1.2M subscribers</p>
                      <Button>Subscribe</Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="whitespace-pre-wrap text-sm">{video.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-4">
                    Comments ({comments.length})
                  </h3>
                  
                  {user && (
                    <form onSubmit={handleComment} className="mb-6">
                      <div className="flex space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[80px] resize-none"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setComment('')}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" size="sm" disabled={!comment.trim()}>
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar>
                          <AvatarImage src={comment.avatar} alt={comment.user} />
                          <AvatarFallback>
                            {comment.user.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span className="text-xs">{comment.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Related Videos</h3>
              <div className="space-y-4">
                {relatedVideos.map((video) => (
                  <Link
                    key={video.id}
                    to={`/watch/${video.id}`}
                    className="flex space-x-3 group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-40 aspect-video object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{video.channelName}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <span>{formatNumber(video.views)} views</span>
                        <span>•</span>
                        <span>{timeAgo(video.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
