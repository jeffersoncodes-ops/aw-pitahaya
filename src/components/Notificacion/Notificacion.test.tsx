import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificacionProvider, useNotificar } from './Notificacion';

function BotonMensaje({ mensaje }: { mensaje: string }) {
  const { notificar } = useNotificar();
  return <button onClick={() => notificar(mensaje)}>{mensaje}</button>;
}

function BotonError() {
  const { notificar } = useNotificar();
  return <button onClick={() => notificar('Algo salio mal', 'error')}>Error</button>;
}

describe('NotificacionProvider', () => {
  it('renderiza el mensaje en un Alert al llamar notificar', async () => {
    render(
      <NotificacionProvider>
        <BotonMensaje mensaje="Hola mundo" />
      </NotificacionProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Hola mundo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Hola mundo');
  });

  it('muestra un mensaje distinto segun el parametro', async () => {
    render(
      <NotificacionProvider>
        <BotonMensaje mensaje="Mensaje de prueba" />
      </NotificacionProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Mensaje de prueba' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Mensaje de prueba');
  });

  it('muestra un error con severity error', async () => {
    render(
      <NotificacionProvider>
        <BotonError />
      </NotificacionProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Algo salio mal');
  });
});
