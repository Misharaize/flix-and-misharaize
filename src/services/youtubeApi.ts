
const YOUTUBE_API_KEY = 'AIzaSyAnpFS40Wq-ND2KB9Ff0WNAxmkFVLU90bc';
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
  items: any[];
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
    const searchUrl = `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}${
      pageToken ? `&pageToken=${pageToken}` : ''
    }`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error(searchData.error?.message || 'Search failed');
    }

    // Get video IDs for additional details
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Get video details (duration, view count, etc.)
    const detailsUrl = `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    // Get channel details for avatars
    const channelIds = searchData.items.map((item: any) => item.snippet.channelId).join(',');
    const channelUrl = `${YOUTUBE_API_BASE_URL}/channels?part=snippet&id=${channelIds}&key=${YOUTUBE_API_KEY}`;
    
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    // Combine all data
    const videos = searchData.items.map((item: any, index: number) => {
      const details = detailsData.items.find((d: any) => d.id === item.id.videoId);
      const channel = channelData.items.find((c: any) => c.id === item.snippet.channelId);
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
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
    const videoUrl = `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(videoUrl);
    const data = await response.json();

    if (!response.ok || !data.items.length) {
      throw new Error('Video not found');
    }

    const video = data.items[0];
    
    // Get channel details
    const channelUrl = `${YOUTUBE_API_BASE_URL}/channels?part=snippet&id=${video.snippet.channelId}&key=${YOUTUBE_API_KEY}`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
      duration: parseDuration(video.contentDetails.duration),
      views: formatViewCount(video.statistics.viewCount),
      likes: parseInt(video.statistics.likeCount || '0'),
      channelName: video.snippet.channelTitle,
      channelAvatar: channelData.items[0]?.snippet?.thumbnails?.default?.url,
      publishedAt: video.snippet.publishedAt,
      tags: video.snippet.tags || []
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};
