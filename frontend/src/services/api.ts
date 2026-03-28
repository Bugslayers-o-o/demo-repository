import axios, { AxiosInstance } from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts API
export const postsAPI = {
  createPost: (content: string, moodTag?: string, imageUrls: string[] = []) =>
    api.post('/posts', { content, moodTag, imageUrls }),

  getPosts: (page: number = 1, limit: number = 10) =>
    api.get('/feed', { params: { page, limit } }),

  getPost: (postId: string) => api.get(`/posts/${postId}`),
};

// Reactions API
export const reactionsAPI = {
  addReaction: (postId: string, reactionType: 'support' | 'relate' | 'care') =>
    api.post(`/posts/${postId}/react`, { type: reactionType }),
  
  removeReaction: (postId: string) =>
    api.delete(`/posts/${postId}/react`),
  
  getReactions: (postId: string) =>
    api.get(`/posts/${postId}/reactions`),
};

// Comments API
export const commentsAPI = {
  addComment: (postId: string, content: string) =>
    api.post(`/posts/${postId}/comment`, { content }),
  
  getComments: (postId: string) =>
    api.get(`/posts/${postId}/comments`),
  
  deleteComment: (postId: string, commentId: string) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),
};

export default api;
