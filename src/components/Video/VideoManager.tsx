
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { VideoActions } from './VideoActions';
import { VideoDownload } from './VideoDownload';

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
  const [showDownload, setShowDownload] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
            
            <VideoActions
              videoId={videoId}
              title={title}
              likes={likes}
              onDownloadClick={() => setShowDownload(true)}
            />
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
