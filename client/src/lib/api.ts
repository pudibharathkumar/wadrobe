import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = (session?.user as any)?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const wardrobeApi = {
  getAll: () => api.get('/wardrobe'),
  upload: (formData: FormData) => api.post('/wardrobe/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  create: (data: any) => api.post('/wardrobe', data),
  autoTag: (imageUrl: string) => api.post('/wardrobe/auto-tag', { imageUrl }),
};

export const outfitApi = {
  getAll: () => api.get('/outfits'),
  generate: (data: { occasion: string; weather: string; preferences?: any }) => api.post('/outfits/generate', data),
  create: (data: any) => api.post('/outfits', data),
};

export default api;
