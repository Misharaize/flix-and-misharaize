
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, Play, Pause, Volume2, VolumeX, Maximize, PictureInPicture2, Download } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  onPlayPause: () => void;
  onMute: () => void;
  onPrevious?: () => void;
  onNext: () => void;
  onFullscreen: () => void;
  onPictureInPicture: () => void;
  onMiniPlayer: () => void;
  onDownload: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const VideoControls = ({
  isPlaying,
  isMuted,
  onPlayPause,
  onMute,
  onPrevious,
  onNext,
  onFullscreen,
  onPictureInPicture,
  onMiniPlayer,
  onDownload,
  hasNext,
  hasPrevious
}: VideoControlsProps) => {
  return (
    <div className="flex items-center justify-between bg-black/80 text-white p-4 rounded-b-lg">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="text-white hover:bg-white/20"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onPlayPause}
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={!hasNext}
          className="text-white hover:bg-white/20"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onMute}
          className="text-white hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          className="text-white hover:bg-white/20"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onMiniPlayer}
          className="text-white hover:bg-white/20"
          title="Mini Player"
        >
          <PictureInPicture2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onPictureInPicture}
          className="text-white hover:bg-white/20"
          title="Picture in Picture"
        >
          <PictureInPicture2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-white hover:bg-white/20"
          title="Fullscreen"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
