import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { ToastContainer } from 'react-toastify'
const TOKEN_KEY = 'watch-shop-access-token';

const ProtectedRoutes = () => {
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

  // Si no hay token, lo manda al login. Si hay, renderiza el componente hijo (Outlet)
  return token ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <ToastContainer theme='dark' />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  )
}

export default App
