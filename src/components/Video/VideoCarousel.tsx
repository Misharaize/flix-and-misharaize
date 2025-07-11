
import { useState } from 'react';
import { VideoCard } from './VideoCard';
import { YouTubeVideo } from '@/services/youtubeApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoCarouselProps {
  title: string;
  videos: YouTubeVideo[];
  loading?: boolean;
}

export const VideoCarousel = ({ title, videos, loading = false }: VideoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videosPerPage = 4;
  const maxIndex = Math.max(0, videos.length - videosPerPage);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + videosPerPage, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - videosPerPage, 0));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: videosPerPage }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-80 animate-pulse">
              <div className="bg-muted rounded-lg aspect-video mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / videosPerPage)}%)` }}
        >
          {videos.map((video) => (
            <div key={video.id} className="flex-shrink-0 w-1/4 px-2">
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
