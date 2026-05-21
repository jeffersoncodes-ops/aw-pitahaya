import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import './App.css';
import { Navbar } from './components/Navbar';
import { Home } from './Pages/Home';
import Investigacion from './Pages/Investigacion';
import Noticias from './Pages/Noticias';
import Catalogos from './Pages/Catalogos';
import Admin from './Pages/Admin';
import LoginPage from './components/LoginPage/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuth } = useAuth();
  if (!isAuth) return <LoginPage />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuth, user, logoutUser } = useAuth();

  return (
    <>
      <Navbar isAuth={isAuth} userName={user?.nombre} userRol={user?.rol} onLogout={logoutUser} />
      <Box className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/investigacion" element={<Investigacion />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/catalogos" element={<Catalogos />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
