
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Filter } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock search results
  const mockSearchResults = [
    {
      id: 'search1',
      title: 'Amazing Technology Tutorial 2024',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '12:45',
      views: 125000,
      likes: 8500,
      channelName: 'Tech Guru',
      channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
      publishedAt: '2024-01-15T00:00:00Z',
      tags: ['Technology', 'Tutorial', 'Programming']
    },
    {
      id: 'search2',
      title: 'Best Music Mix 2024 - Top Hits',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      duration: '45:30',
      views: 2500000,
      likes: 180000,
      channelName: 'Music Central',
      channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music',
      publishedAt: '2024-01-10T00:00:00Z',
      tags: ['Music', 'Mix', 'Pop']
    }
  ];

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock results based on query
      const filteredResults = mockSearchResults.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const newParams = new URLSearchParams();
      newParams.set('q', query.trim());
      window.history.pushState(null, '', `?${newParams.toString()}`);
      performSearch(query.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Search videos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-muted/50"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button type="submit" size="lg" disabled={loading}>
              Search
            </Button>
            <Button variant="outline" size="lg">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>
          
          {searchParams.get('q') && (
            <div className="text-muted-foreground">
              Search results for: <span className="font-medium text-foreground">"{searchParams.get('q')}"</span>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <VideoGrid videos={[]} loading={true} />
          ) : results.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <VideoGrid videos={results} />
            </>
          ) : searchParams.get('q') ? (
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
                Find your favorite videos across YouTube and our platform
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
