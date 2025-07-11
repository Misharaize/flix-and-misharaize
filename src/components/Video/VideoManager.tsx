
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  Share, 
  ThumbsUp, 
  ThumbsDown,
  Download,
  Bookmark,
  Flag,
  MoreVertical
} from 'lucide-react';
import { VideoDownload } from './VideoDownload';
import { useToast } from '@/hooks/use-toast';

interface VideoManagerProps {
  videoId: string;
  title: string;
  description?: string;
  channelName: string;
  views: number;
  likes: number;
  publishedAt: string;
  tags?: string[];
}

export const VideoManager = ({ 
  videoId, 
  title, 
  description, 
  channelName, 
  views, 
  likes,
  publishedAt,
  tags = []
}: VideoManagerProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const { toast } = useToast();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
    toast({
      title: isLiked ? "Removed from liked videos" : "Added to liked videos",
      description: isLiked ? "Video removed from your liked videos" : "Video added to your liked videos",
    });
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved videos" : "Saved to watch later",
      description: isSaved ? "Video removed from your saved videos" : "Video saved to watch later",
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/watch/${videoId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this video: ${title}`,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Video link has been copied to clipboard",
      });
    }
  };

  const handleReport = () => {
    toast({
      title: "Video reported",
      description: "Thank you for reporting this video. We'll review it shortly.",
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Video Title */}
          <div>
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          </div>

          {/* Video Stats and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{formatNumber(views)} views</span>
              <span>•</span>
              <span>{new Date(publishedAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="flex items-center space-x-2"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{formatNumber(likes + (isLiked ? 1 : 0))}</span>
              </Button>
              
              <Button
                variant={isDisliked ? "default" : "outline"}
                size="sm"
                onClick={handleDislike}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Share</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDownload(true)}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Download</span>
              </Button>
              
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
              >
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Save</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReport}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Channel Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {channelName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{channelName}</h3>
                <p className="text-sm text-muted-foreground">1.2M subscribers</p>
              </div>
            </div>
            <Button variant="default" size="sm">
              Subscribe
            </Button>
          </div>

          {/* Description */}
          {description && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{description}</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Download Modal */}
      {showDownload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Download Video</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDownload(false)}
              >
                ✕
              </Button>
            </div>
            <VideoDownload
              videoId={videoId}
              videoTitle={title}
              onDownloadComplete={() => setShowDownload(false)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};
