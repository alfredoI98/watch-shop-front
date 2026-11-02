import api from '../api';
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const USER_KEY = import.meta.env.VITE_USER_KEY;
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;
const TOKEN_EXPIRY_KEY = import.meta.env.VITE_TOKEN_EXPIRY_KEY ?? 'token_expiry';
import type { User } from '../interfaces/user';

export class SessionExpiredError extends Error {
  constructor(message = 'Tu sesión expiró.') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

const getStorage = (remember: boolean) =>
  remember ? localStorage : sessionStorage;

const getCurrentTokenStorage = () =>
  localStorage.getItem(TOKEN_KEY) !== null ? localStorage : sessionStorage;

const saveToken = (token: string, remember: boolean) => {
  getStorage(remember).setItem(TOKEN_KEY, token);
};

const saveRefreshToken = (token: string, remember: boolean) => {
  getStorage(remember).setItem(REFRESH_TOKEN_KEY, token);
};

const saveTokenExpiry = (expiresIn: number) => {
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
};

const saveUser = (user: User, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

export const getRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_KEY) ?? sessionStorage.getItem(REFRESH_TOKEN_KEY);

export const shouldRefreshToken = () => {
  const expiresAt = Number(
    localStorage.getItem(TOKEN_EXPIRY_KEY) ?? sessionStorage.getItem(TOKEN_EXPIRY_KEY) ?? 0,
  );

  if (!expiresAt) return false;

  return expiresAt - Date.now() <= 120000;
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  // Elimina el token y la información del usuario del almacenamiento local y de sesión
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem('ecommerce-cart');
  localStorage.removeItem('ecommerce-favorites');
};

export const refreshTokenIfNeeded = async () => {
  if (!shouldRefreshToken()) return null;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new SessionExpiredError('No hay refresh token disponible.');
  }

  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    const newAccessToken = response.data?.access_token;
    const expiresIn = Number(response.data?.expires_in ?? 900);

    if (typeof newAccessToken !== 'string') {
      throw new SessionExpiredError('No se pudo renovar el token de sesión.');
    }

    const remember = localStorage.getItem(TOKEN_KEY) !== null;
    const storage = remember ? localStorage : getCurrentTokenStorage();
    storage.setItem(TOKEN_KEY, newAccessToken);
    saveTokenExpiry(expiresIn);

    return newAccessToken;
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      throw error;
    }

    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401 || status === 403) {
      throw new SessionExpiredError('Tu sesión expiró o el refresh token ya no es válido.');
    }

    return null;
  }
};

export const login = async (email: string, password: string, remember = false) => {
  try {
    const response = await api.post('/login', {
      email,
      password,
    });

    const data = response.data;
    if (typeof data.access_token !== 'string') {
      throw new Error('El servidor no devolvió un token de sesión válido.');
    }

    if (typeof data.refresh_token !== 'string') {
      throw new Error('El servidor no devolvió un refresh token válido.');
    }

    saveToken(data.access_token, remember);
    saveRefreshToken(data.refresh_token, remember);
    saveTokenExpiry(Number(data.expires_in ?? 900));
    saveUser(data.user, remember);
    return data;
  } catch (error) {
    throw new Error('Error al iniciar sesión. Por favor, intenta nuevamente.', {
      cause: error,
    });
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  age: string,
  gender: string,
  address: string,
  phone: string,
) => {
  try {
    const response = await api.post('/signup', {
      name,
      email,
      password,
      age,
      gender,
      address,
      phone,
    });

    const data = response.data;
    if (typeof data.access_token !== 'string') {
      throw new Error('El servidor no devolvió un token de sesión válido.');
    }

    if (typeof data.refresh_token !== 'string') {
      throw new Error('El servidor no devolvió un refresh token válido.');
    }

    saveToken(data.access_token, false); // No se recuerda la sesión por defecto al registrarse
    saveRefreshToken(data.refresh_token, false);
    saveTokenExpiry(Number(data.expires_in ?? 900));
    saveUser(data.user, false);
    return data;
  } catch (error) {
    throw new Error('No se pudo crear la cuenta. Intenta nuevamente.', {
      cause: error,
    });
  }
};