import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
// import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

function App() {

  // Create a client
  const queryClient = new QueryClient();

  // const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <ToastContainer theme='dark' />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </QueryClientProvider>
  )
}

export default App
