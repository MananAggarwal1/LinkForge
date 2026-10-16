import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('linkforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and has token, clear expired token
      if (localStorage.getItem('linkforge_token')) {
        localStorage.removeItem('linkforge_token');
        localStorage.removeItem('linkforge_user');
        window.dispatchEvent(new Event('linkforge_auth_expired'));
      }
    }
    return Promise.reject(error);
  }
);

export const getEffectiveShortUrl = (link) => {
  if (!link) return '';
  const rawUrl = typeof link === 'string' ? link : (link.shortUrl || '');
  const shortCode = typeof link === 'object' ? link.shortCode : '';
  const apiUrl = import.meta.env.VITE_API_URL || '';

  if (rawUrl && /https?:\/\/localhost:8080/.test(rawUrl) && apiUrl && !apiUrl.includes('localhost:8080')) {
    const cleanApi = apiUrl.replace(/\/+$/, '');
    return rawUrl.replace(/https?:\/\/localhost:8080/, cleanApi);
  }

  if (rawUrl) return rawUrl;

  if (shortCode && apiUrl && !apiUrl.includes('localhost:8080')) {
    return `${apiUrl.replace(/\/+$/, '')}/r/${shortCode}`;
  }

  return rawUrl || (shortCode ? `http://localhost:8080/r/${shortCode}` : '');
};

export default api;
