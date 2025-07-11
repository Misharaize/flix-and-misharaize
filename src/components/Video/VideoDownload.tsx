
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoDownloadProps {
  videoId: string;
  videoTitle: string;
  onClose?: () => void;
}

interface DownloadOption {
  quality: string;
  format: string;
  size: string;
  type: 'video' | 'audio';
}

const downloadOptions: DownloadOption[] = [
  { quality: '1080p', format: 'mp4', size: '~200MB', type: 'video' },
  { quality: '720p', format: 'mp4', size: '~120MB', type: 'video' },
  { quality: '480p', format: 'mp4', size: '~80MB', type: 'video' },
  { quality: '360p', format: 'mp4', size: '~50MB', type: 'video' },
  { quality: 'High', format: 'mp3', size: '~5MB', type: 'audio' },
  { quality: 'Medium', format: 'mp3', size: '~3MB', type: 'audio' },
];

export const VideoDownload = ({ videoId, videoTitle, onClose }: VideoDownloadProps) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleDownload = async (option: DownloadOption) => {
    const downloadKey = `${option.quality}-${option.format}`;
    setDownloading(downloadKey);

    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a download link simulation
      const link = document.createElement('a');
      link.href = `https://www.youtube.com/watch?v=${videoId}`;
      link.download = `${videoTitle}-${option.quality}.${option.format}`;
      link.target = '_blank';
      link.click();

      setCompleted(prev => new Set([...prev, downloadKey]));
      
      toast({
        title: "Download started",
        description: `${videoTitle} (${option.quality}) download has been initiated.`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "Unable to download the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Download Video</span>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {videoTitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <h4 className="font-medium text-sm">Video Downloads</h4>
          {downloadOptions.filter(opt => opt.type === 'video').map((option) => {
            const downloadKey = `${option.quality}-${option.format}`;
            const isDownloading = downloading === downloadKey;
            const isCompleted = completed.has(downloadKey);
            
            return (
              <div key={downloadKey} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{option.quality}</span>
                      <Badge variant="secondary">{option.format.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.size}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(option)}
                  disabled={isDownloading}
                  size="sm"
                  variant={isCompleted ? "secondary" : "default"}
                >
                  {isDownloading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Downloading...
                    </>
                  ) : isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3">
          <h4 className="font-medium text-sm">Audio Downloads</h4>
          {downloadOptions.filter(opt => opt.type === 'audio').map((option) => {
            const downloadKey = `${option.quality}-${option.format}`;
            const isDownloading = downloading === downloadKey;
            const isCompleted = completed.has(downloadKey);
            
            return (
              <div key={downloadKey} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{option.quality} Quality</span>
                      <Badge variant="secondary">{option.format.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.size}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(option)}
                  disabled={isDownloading}
                  size="sm"
                  variant={isCompleted ? "secondary" : "default"}
                >
                  {isDownloading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Downloading...
                    </>
                  ) : isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Download Notice:</p>
              <p>Downloads are subject to YouTube's terms of service. Please ensure you have the right to download content.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
