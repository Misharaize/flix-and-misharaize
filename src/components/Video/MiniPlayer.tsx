
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MiniPlayerProps {
  videoId: string;
  title: string;
  onClose: () => void;
  onMaximize: () => void;
}

export const MiniPlayer = ({ videoId, title, onClose, onMaximize }: MiniPlayerProps) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const miniPlayerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (miniPlayerRef.current) {
      const rect = miniPlayerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={miniPlayerRef}
      className="fixed z-50 bg-black rounded-lg shadow-2xl overflow-hidden cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px',
        height: '200px',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Video Player */}
      <div className="relative w-full h-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&iv_load_policy=3&fs=0&controls=0&disablekb=1&enablejsapi=1`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        
        {/* Control Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors group">
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-black/60 hover:bg-black/80 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-black/60 hover:bg-black/80 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-black/60 hover:bg-black/80 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-black/60 hover:bg-black/80 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Title Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2 text-xs truncate">
        {title}
      </div>
    </div>
  );
};
