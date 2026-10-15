import api from '../api';
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const USER_KEY = import.meta.env.VITE_USER_KEY;
import type { User } from '../interfaces/user';


const saveToken = (token: string, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
};

const saveUser = (user: User, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem('ecommerce-cart');
};

export const login = async (email: string, password: string, remember = false) => {
  try {
    const response = await api.post('/login', {
      email,
      password
    });

    const data = response.data;
    if (typeof data.access_token !== 'string') {
      throw new Error('El servidor no devolvió un token de sesión válido.');
    }

    saveToken(data.access_token, remember);
    saveUser(data.user, remember);
    return data;
    
  } catch (error) {
    throw new Error('Error al iniciar sesión. Por favor, intenta nuevamente.', { cause: error });
  }
};

export const signup = async (name: string, email: string, password: string, age: string, gender: string, address: string, phone: string) => {
  try {
  const response = await api.post('/signup', {
    name,
    email,
    password,
    age,
    gender,
    address,
    phone
  });

  const data = response.data;
  if (typeof data.access_token !== 'string') {
    throw new Error('El servidor no devolvió un token de sesión válido.');
  }

  saveToken(data.access_token, false); // No se recuerda la sesión por defecto al registrarse
  return data;

  } catch (error) {
    throw new Error('No se pudo crear la cuenta. Intenta nuevamente.', { cause: error });
  }
};