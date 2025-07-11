
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share, 
  ThumbsUp, 
  ThumbsDown,
  Download,
  Bookmark,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoActionsProps {
  videoId: string;
  title: string;
  likes: number;
  onDownloadClick: () => void;
}

export const VideoActions = ({ 
  videoId, 
  title, 
  likes,
  onDownloadClick
}: VideoActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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
        onClick={onDownloadClick}
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
  );
};
