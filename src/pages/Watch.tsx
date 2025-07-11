
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { VideoManager } from '@/components/Video/VideoManager';
import { useQuery } from '@tanstack/react-query';
import { youtubeApi } from '@/services/youtubeApi';
import { Loader } from 'lucide-react';

const Watch = () => {
  const { videoId } = useParams<{ videoId: string }>();

  const { data: videoData, isLoading: videoLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => youtubeApi.getVideoDetails(videoId!),
    enabled: !!videoId,
  });

  const { data: relatedVideos, isLoading: relatedLoading } = useQuery({
    queryKey: ['related', videoId],
    queryFn: () => youtubeApi.searchVideos('trending', 12),
    enabled: !!videoId,
  });

  if (videoLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <p className="text-muted-foreground">The video you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=1&color=white&controls=1&disablekb=0&enablejsapi=1&origin=${window.location.origin}`}
                title={videoData.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              {/* Misharaize Flix Watermark */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-medium backdrop-blur-sm">
                Misharaize Flix
              </div>
            </div>

            {/* Video Details */}
            <VideoManager
              videoId={videoId!}
              title={videoData.title}
              description={videoData.description}
              channelName={videoData.channelName}
              views={videoData.views}
              likes={videoData.likes}
              publishedAt={videoData.publishedAt}
              tags={videoData.tags}
            />

            {/* Comments Section */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">U</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">User123</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm">Great video! Really helpful content.</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">Anonymous</span>
                      <span className="text-xs text-muted-foreground">5 hours ago</span>
                    </div>
                    <p className="text-sm">Thanks for sharing this!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Related Videos</h3>
            {relatedLoading ? (
              <div className="flex justify-center">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {relatedVideos?.slice(0, 10).map((video) => (
                  <div key={video.id} className="flex space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="relative w-40 aspect-video flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{video.channelName}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <span>{video.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
