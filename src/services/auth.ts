const API_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'watch-shop-access-token';

const saveToken = (token: string, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
};

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

export const login = async (email: string, password: string, remember = false) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Correo o contraseña incorrectos.');
  }

  const data = await response.json();
  if (typeof data.access_token !== 'string') {
    throw new Error('El servidor no devolvió un token de sesión válido.');
  }

  saveToken(data.access_token, remember);
  return data;
};

export const signup = async (name: string, email: string, password: string, age: string, gender: string, address: string, phone: string) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, age, gender, address, phone }),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear la cuenta. Intenta nuevamente.');
  }

  const data = await response.json();
  if (typeof data.access_token !== 'string') {
    throw new Error('El servidor no devolvió un token de sesión válido.');
  }

  saveToken(data.access_token, false); // No se recuerda la sesión por defecto al registrarse
  return data;
};

export const authenticatedFetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(init.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers });
};

export const getCurrentUser = async () => {
  const response = await authenticatedFetch(`${API_URL}/me`);

  if (!response.ok) {
    logout();
    throw new Error('La sesión expiró.');
  }

  return response.json();
};