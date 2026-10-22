import axios from 'axios';
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const USER_KEY = import.meta.env.VITE_USER_KEY;

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // La URL de tu backend en NestJS
});

// Interceptor para añadir el token a CADA petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar si el token expira (Error 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.endsWith('/login')
    ) {
      // Si el token expira, se elimina y se redirige al login. Tambien se elimina la data del usuario del localStorage y sessionStorage
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
      localStorage.removeItem('ecommerce-cart');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
