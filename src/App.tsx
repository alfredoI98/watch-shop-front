import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { AddNewProduct } from './pages/AddNewProduct/AddNewProduct';
import { ToastContainer } from 'react-toastify'
import { ShoppingCart } from './pages/UserCart/ShoppingCart';
import { Favorites } from './pages/Favorites/Favorites';
import { MyAccount } from './pages/MyAccount/MyAccount';
import { getUser } from './services/auth';
import { useFavoritesStore } from './store/useFavoritesStore';
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

const ProtectedRoutes = () => {
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

  // Si no hay token, lo manda al login. Si hay, renderiza el componente hijo (Outlet)
  return token ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  // Create a client
  const queryClient = new QueryClient();
  const fetchUserFavorites = useFavoritesStore((state) => state.fetchUserFavorites);

  useEffect(() => {
    const userId = getUser()?._id;
    if (userId) {
      void fetchUserFavorites(userId);
    }
  }, [fetchUserFavorites]);

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
            <Route path="/products/new" element={<AddNewProduct />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/account" element={<MyAccount />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  )
}

export default App
