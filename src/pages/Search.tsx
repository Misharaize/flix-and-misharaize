
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { Button } from '@/components/ui/button';
import { SearchIcon, Loader } from 'lucide-react';
import { searchYouTubeVideos, YouTubeVideo } from '@/services/youtubeApi';
import { useToast } from '@/hooks/use-toast';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, pageToken?: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      console.log('Searching for:', searchQuery);
      const response = await searchYouTubeVideos(searchQuery, 20, pageToken);
      
      if (pageToken) {
        setResults(prev => [...prev, ...response.items]);
      } else {
        setResults(response.items);
      }
      
      setNextPageToken(response.nextPageToken);
      console.log(`Found ${response.items.length} videos`);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const query = searchParams.get('q');
    if (nextPageToken && query) {
      performSearch(query, nextPageToken);
    }
  };

  const searchQuery = searchParams.get('q');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Results Header */}
        <div className="max-w-4xl mx-auto mb-8">
          {searchQuery && (
            <div className="text-muted-foreground">
              Search results for: <span className="font-medium text-foreground">"{searchQuery}"</span>
              {results.length > 0 && (
                <span className="ml-2">({results.length} videos found)</span>
              )}
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="max-w-7xl mx-auto">
          {loading && results.length === 0 ? (
            <VideoGrid videos={[]} loading={true} />
          ) : results.length > 0 ? (
            <>
              <VideoGrid videos={results} />
              
              {nextPageToken && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={loadMore} 
                    disabled={loading}
                    variant="outline"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        Loading more...
                      </>
                    ) : (
                      'Load More Videos'
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : searchQuery ? (
            <div className="text-center py-16">
              <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start searching</h3>
              <p className="text-muted-foreground">
                Find your favorite videos from YouTube
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
