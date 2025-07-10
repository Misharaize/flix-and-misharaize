
import { Play, Eye, ThumbsUp, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes?: number;
  channelName: string;
  channelAvatar?: string;
  publishedAt: string;
  tags?: string[];
}

export const VideoCard = ({
  id,
  title,
  thumbnail,
  duration,
  views,
  likes,
  channelName,
  channelAvatar,
  publishedAt,
  tags = []
}: VideoCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    if (diffInHours < 720) return `${Math.floor(diffInHours / 168)}w ago`;
    return `${Math.floor(diffInHours / 720)}mo ago`;
  };

  return (
    <Card className="video-card group border-0 bg-card/50 hover:bg-card/80 transition-colors">
      <Link to={`/watch/${id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={thumbnail}
            alt={title}
            className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-black/70 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
          
          {/* Duration */}
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 bg-black/70 text-white hover:bg-black/70 text-xs"
          >
            {duration}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/watch/${id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Channel info */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {channelAvatar ? (
              <img src={channelAvatar} alt={channelName} className="w-full h-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <span className="text-sm text-muted-foreground font-medium truncate">{channelName}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{formatNumber(views)}</span>
            </div>
            {likes !== undefined && (
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{formatNumber(likes)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo(publishedAt)}</span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs py-0 px-2 h-5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
