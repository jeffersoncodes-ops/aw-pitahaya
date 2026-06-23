import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { LoginPage } from './Pages/LoginPage';
import NotFound from './Pages/NotFound';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificacionProvider } from './components/Notificacion';
import { WhatsAppButton } from './components/WhatsAppButton';
import PageLoader from './components/PageLoader';

const Home = lazy(() =>
  import('./Pages/Home').then((m) => ({ default: m.Home })),
);
const Investigacion = lazy(() => import('./Pages/Investigacion'));
const Noticias = lazy(() => import('./Pages/Noticias'));
const Catalogos = lazy(() => import('./Pages/Catalogos'));
const Admin = lazy(() => import('./Pages/Admin'));

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
        <Suspense fallback={<PageLoader />}>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Box>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificacionProvider>
        <AppRoutes />
        <WhatsAppButton />
      </NotificacionProvider>
    </AuthProvider>
  );
}

export default App;
