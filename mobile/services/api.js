import axios from "axios";
import { getToken } from "./auth";

const API_BASE = "https://ma-video-hub-backend.onrender.com/api";
const PAGE_LIMIT = 10;
const SERVER_BASE = API_BASE.replace(/\/api$/, ''); // remove trailing /api

// create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Request interceptor to attach JWT if available
api.interceptors.request.use(
  async (config) => {
    try {
      // get token from async storage or wherever you store it
      const token = await getToken(); // implement getToken() to fetch from AsyncStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Error attaching token:", err);
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
export const normalizeVideo = (video) => ({
  ...video,
  thumbnailUrl: video.thumbnailUrl ? `${SERVER_BASE}${video.thumbnailUrl}` : null,
  videoUrl: video.videoUrl ? `${SERVER_BASE}${video.videoUrl}` : null,
  category: video.category?.name || 'Uncategorized',
});

export const normalizeVideos = (videos) => videos.map(normalizeVideo);

export {api, PAGE_LIMIT, SERVER_BASE, API_BASE};