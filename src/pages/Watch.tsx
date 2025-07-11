import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { VideoDownload } from '@/components/Video/VideoDownload';
import { ThumbsUp, ThumbsDown, Share, Download, Flag, Eye, Calendar, User, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getVideoDetails, searchYouTubeVideos, YouTubeVideo } from '@/services/youtubeApi';
import { useToast } from '@/hooks/use-toast';

const Watch = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState<YouTubeVideo[]>([]);
  const [showDownload, setShowDownload] = useState(false);

  // Mock comments for now
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
    }
  ];

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoId) return;
      
      setLoading(true);
      try {
        console.log('Loading video with API key:', videoId);
        
        const videoData = await getVideoDetails(videoId);
        if (videoData) {
          console.log('Video loaded successfully:', videoData);
          setVideo(videoData);
          setComments(mockComments);
          
          const searchQuery = videoData.title.split(' ').slice(0, 3).join(' ');
          console.log('Loading related videos with query:', searchQuery);
          const relatedResponse = await searchYouTubeVideos(searchQuery, 10);
          const filtered = relatedResponse.items.filter(v => v.id !== videoId);
          setRelatedVideos(filtered.slice(0, 8));
          console.log('Related videos loaded:', filtered.length);
        } else {
          console.error('Failed to load video data');
          toast({
            title: "Video not found",
            description: "The video you're looking for doesn't exist or is unavailable.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading video:', error);
        toast({
          title: "Error loading video",
          description: "Unable to load video details. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId, toast]);

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
    toast({
      title: liked ? "Removed like" : "Liked video",
      description: liked ? "You removed your like from this video" : "Thanks for liking this video!",
    });
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
    toast({
      title: disliked ? "Removed dislike" : "Disliked video",
      description: disliked ? "You removed your dislike from this video" : "Thanks for your feedback!",
    });
  };

  const handleShare = () => {
    if (navigator.share && video) {
      navigator.share({
        title: video.title,
        text: `Check out this video: ${video.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Video link copied to clipboard!",
      });
    }
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
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader className="h-8 w-8 animate-spin mr-3" />
            <span>Loading video...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">Video not found</h3>
            <p className="text-muted-foreground mb-4">
              The video you're looking for doesn't exist or is unavailable.
            </p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
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
            {/* YouTube Player with Watermark */}
            <div className="aspect-video bg-black rounded-lg mb-4 relative overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&iv_load_policy=3&origin=${window.location.origin}&enablejsapi=1&controls=1&fs=1&cc_load_policy=0&disablekb=0`}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                style={{ border: 'none' }}
                referrerPolicy="strict-origin-when-cross-origin"
              />
              
              <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm border border-white/20 shadow-lg z-10">
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-extrabold">
                  Misharaize Flix
                </span>
              </div>
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
                    <span>{formatNumber((video.likes || 0) + (liked ? 1 : 0))}</span>
                  </Button>
                  <Button
                    variant={disliked ? "default" : "outline"}
                    size="sm"
                    onClick={handleDislike}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDownload(true)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Download Modal */}
              {showDownload && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <VideoDownload
                    videoId={videoId!}
                    videoTitle={video.title}
                    onClose={() => setShowDownload(false)}
                  />
                </div>
              )}

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
                      <Button className="mt-2">Subscribe</Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="whitespace-pre-wrap text-sm line-clamp-6">{video.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-4">
                    Comments ({comments.length})
                  </h3>
                  
                  {user ? (
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
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        Please login to add comments
                      </p>
                      <Button asChild>
                        <Link to="/login">Login</Link>
                      </Button>
                    </div>
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
              {relatedVideos.length > 0 ? (
                <div className="space-y-4">
                  {relatedVideos.map((relatedVideo) => (
                    <Link
                      key={relatedVideo.id}
                      to={`/watch/${relatedVideo.id}`}
                      className="flex space-x-3 group"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={relatedVideo.thumbnail}
                          alt={relatedVideo.title}
                          className="w-40 aspect-video object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                          {relatedVideo.duration}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{relatedVideo.channelName}</p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                          <span>{formatNumber(relatedVideo.views)} views</span>
                          <span>•</span>
                          <span>{timeAgo(relatedVideo.publishedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading related videos...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
