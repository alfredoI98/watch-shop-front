import axios from 'axios';
import { toast } from 'react-toastify';
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const TOKEN_EXPIRY_KEY = import.meta.env.VITE_TOKEN_EXPIRY_KEY ?? 'token_expiry';
import { getRefreshToken, getToken, logout, SessionExpiredError } from './services/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });

  failedQueue = [];
};

const getStorageForToken = () =>
  localStorage.getItem(TOKEN_KEY) !== null ? localStorage : sessionStorage;

const saveToken = (token: string, expiresInSeconds: number) => {
  const storage = getStorageForToken();
  storage.setItem(TOKEN_KEY, token);

  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new SessionExpiredError('No hay refresh token disponible.');
  }

  try {
    toast.info('Renovando sesión...', { toastId: 'refresh-session-toast' });

  const response = await axios.post('http://localhost:3000/api/auth/refresh', {
      refreshToken,
    });

    const newAccessToken = response.data?.access_token;
    const expiresIn = Number(response.data?.expires_in ?? 900);

    if (typeof newAccessToken !== 'string') {
      throw new SessionExpiredError('El servidor no devolvió un nuevo access token.');
    }

    saveToken(newAccessToken, expiresIn);
    return newAccessToken;
  } catch (error) {
    if (
      error instanceof SessionExpiredError ||
      (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403))
    ) {
      throw new SessionExpiredError('Tu sesión expiró o el refresh token ya no es válido.');
    }

    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRetry = originalRequest?.url?.includes('/auth/refresh');
    const isLoginRequest = originalRequest?.url?.includes('/login');

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthRetry &&
      !isLoginRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue();
        isRefreshing = false;
        toast.dismiss('refresh-session-toast');
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        toast.dismiss('refresh-session-toast');

        if (refreshError instanceof SessionExpiredError) {
          logout();
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
