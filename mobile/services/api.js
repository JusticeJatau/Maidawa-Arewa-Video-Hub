import axios from "axios";
import { getToken } from "./auth";
import { EXPO_PUBLIC_API_BASE, EXPO_PUBLIC_PAGE_LIMIT } from '@env';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;
const PAGE_LIMIT = Number(process.env.EXPO_PUBLIC_PAGE_LIMIT);
const SERVER_BASE = API_BASE.replace(/\/api$/, '');

// create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Request interceptor to attach JWT if available
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Warning: could not attach token:", err);
      // don't throw — just continue without token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Prepares a video object for frontend use
 * - prepends SERVER_BASE to videoUrl and thumbnailUrl
 * - ensures category is a string
 */
/**
 * For offline use online when node acts as server
 * 
 */
export const normalizeVideo = (video) => ({
  ...video,
  thumbnailUrl: video.thumbnailUrl ? `${SERVER_BASE}${video.thumbnailUrl}` : null,
  videoUrl: video.videoUrl ? `${SERVER_BASE}${video.videoUrl}` : null,
  category: video.category?.name || 'Uncategorized',
});

export const getYouTubeEmbedUrl = (url) => {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);
  if (!match) return null;

  return `https://www.youtube.com/embed/${match[1]}?playsinline=1&rel=0`;
};

export const getYouTubeThumbnail = (url) => {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);
  if (match && match[1]) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  return null;
};

export const normalizeVideos = (videos) => videos.map(normalizeVideo);

export {api, PAGE_LIMIT, SERVER_BASE, API_BASE};