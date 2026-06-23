import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';

interface Notificacion {
  mensaje: string;
  tipo: AlertColor;
}

interface NotificacionContextType {
  notificar: (mensaje: string, tipo?: AlertColor) => void;
}

const NotificacionContext = createContext<NotificacionContextType>({
  notificar: () => {},
});

export function NotificacionProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notificacion, setNotificacion] = useState<Notificacion>({ mensaje: '', tipo: 'info' });

  const notificar = useCallback((mensaje: string, tipo: AlertColor = 'info') => {
    setNotificacion({ mensaje, tipo });
    setOpen(true);
  }, []);

  return (
    <NotificacionContext.Provider value={{ notificar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={notificacion.tipo}
          variant="filled"
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </NotificacionContext.Provider>
  );
}

export const useNotificar = () => useContext(NotificacionContext);
