
const YOUTUBE_API_KEY = 'AIzaSyCciiz8wB3yKhMGa8mEU3fGF_r1R-Qix2w';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes?: number;
  channelName: string;
  channelAvatar?: string;
  publishedAt: string;
  tags?: string[];
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// Convert YouTube API duration (PT4M13S) to readable format (4:13)
const parseDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1]?.replace('H', '') || '0');
  const minutes = parseInt(match[2]?.replace('M', '') || '0');
  const seconds = parseInt(match[3]?.replace('S', '') || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format view count numbers
const formatViewCount = (viewCount: string): number => {
  return parseInt(viewCount) || 0;
};

export const searchYouTubeVideos = async (
  query: string,
  maxResults: number = 20,
  pageToken?: string
): Promise<YouTubeSearchResponse> => {
  try {
    console.log('Searching YouTube with query:', query);
    
    const searchUrl = `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}${
      pageToken ? `&pageToken=${pageToken}` : ''
    }`;

    console.log('Search URL:', searchUrl);
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error('YouTube API Search Error:', searchData);
      throw new Error(searchData.error?.message || 'Search failed');
    }

    console.log('Search response:', searchData);

    // Get video IDs for additional details
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Get video details (duration, view count, etc.)
    const detailsUrl = `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    console.log('Getting video details for IDs:', videoIds);
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsResponse.ok) {
      console.error('YouTube API Details Error:', detailsData);
    }

    // Get channel details for avatars
    const channelIds = searchData.items.map((item: any) => item.snippet.channelId).join(',');
    const channelUrl = `${YOUTUBE_API_BASE_URL}/channels?part=snippet&id=${channelIds}&key=${YOUTUBE_API_KEY}`;
    
    console.log('Getting channel details for IDs:', channelIds);
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (!channelResponse.ok) {
      console.error('YouTube API Channel Error:', channelData);
    }

    // Combine all data
    const videos = searchData.items.map((item: any, index: number) => {
      const details = detailsData.items?.find((d: any) => d.id === item.id.videoId);
      const channel = channelData.items?.find((c: any) => c.id === item.snippet.channelId);
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        duration: details ? parseDuration(details.contentDetails.duration) : '0:00',
        views: details ? formatViewCount(details.statistics.viewCount) : 0,
        likes: details ? parseInt(details.statistics.likeCount || '0') : 0,
        channelName: item.snippet.channelTitle,
        channelAvatar: channel?.snippet?.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        tags: item.snippet.tags || []
      };
    });

    console.log('Processed videos:', videos);

    return {
      items: videos,
      nextPageToken: searchData.nextPageToken,
      prevPageToken: searchData.prevPageToken,
      pageInfo: searchData.pageInfo
    };
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw error;
  }
};

export const getVideoDetails = async (videoId: string): Promise<YouTubeVideo | null> => {
  try {
    console.log('Getting video details for:', videoId);
    
    const videoUrl = `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    
    console.log('Video details URL:', videoUrl);
    const response = await fetch(videoUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('YouTube API Video Details Error:', data);
      throw new Error(data.error?.message || 'Video not found');
    }

    if (!data.items || data.items.length === 0) {
      console.error('No video found with ID:', videoId);
      return null;
    }

    const video = data.items[0];
    console.log('Video data:', video);
    
    // Get channel details
    const channelUrl = `${YOUTUBE_API_BASE_URL}/channels?part=snippet&id=${video.snippet.channelId}&key=${YOUTUBE_API_KEY}`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (!channelResponse.ok) {
      console.error('YouTube API Channel Details Error:', channelData);
    }

    const result = {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description || '',
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
      duration: parseDuration(video.contentDetails.duration),
      views: formatViewCount(video.statistics.viewCount),
      likes: parseInt(video.statistics.likeCount || '0'),
      channelName: video.snippet.channelTitle,
      channelAvatar: channelData.items?.[0]?.snippet?.thumbnails?.default?.url,
      publishedAt: video.snippet.publishedAt,
      tags: video.snippet.tags || []
    };

    console.log('Processed video result:', result);
    return result;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};
