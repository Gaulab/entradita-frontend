// utils/notify.js
// Funciones centralizadas para notificar al usuario.
// Usa sonner (https://sonner.emilkowal.ski/) como librería de toasts.
// Importar el <Toaster> en App.jsx es suficiente para que funcionen en toda la app.

import { toast } from 'sonner';

export const notifyError = (message) =>
  toast.error(message || 'Ocurrió un error inesperado.');

export const notifySuccess = (message) =>
  toast.success(message);

export const notifyWarning = (message) =>
  toast.warning(message);

export const notifyInfo = (message) =>
  toast.info(message);
