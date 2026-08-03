/**
 * Utility functions for YouTube URL parsing and embed URL generation.
 * Handles standard watch URLs, shortened (youtu.be), embed URLs, and YouTube Shorts.
 */

export function parseYouTubeId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // Match shorts URLs: youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // Match standard embed URLs: youtube.com/embed/ID
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // Match shortened URLs: youtu.be/ID
  const shortenedMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortenedMatch && shortenedMatch[1]) {
    return shortenedMatch[1];
  }

  // Match standard watch URLs: youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/(?:v=|\/v\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Fallback: search for 11-char ID pattern
  const generalMatch = trimmed.match(/([a-zA-Z0-9_-]{11})/);
  if (generalMatch && generalMatch[1] && !trimmed.includes('http') && !trimmed.includes('www.')) {
    return generalMatch[1];
  }

  return null;
}

export function getYouTubeEmbedUrl(url?: string, autoplay: boolean = true): string {
  const videoId = parseYouTubeId(url);
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
  }

  // Default channel showcase playlist fallback if no valid video ID is provided
  return `https://www.youtube.com/embed/videoseries?list=PL3x-videos-jayshree&autoplay=${autoplay ? 1 : 0}`;
}
