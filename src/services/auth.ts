export const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3000/api/login', {
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
  return data;
};

export const signup = async (name: string, email: string, password: string, age: string, gender: string, address: string, phone: string) => {
  const response = await fetch('http://localhost:3000/api/signup', {
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
  return data;
};