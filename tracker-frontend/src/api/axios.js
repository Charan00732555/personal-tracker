import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Inject JWT token on every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tracker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If backend returns 401 or 403, clear stored auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('tracker_token');
      localStorage.removeItem('tracker_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;