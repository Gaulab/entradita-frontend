import { apiRequest } from '../utils/apiUtils';

const apiUrl = import.meta.env.VITE_API_URL;

export const getTicketPurchaseConfig = async (token) => {
  return apiRequest(`${apiUrl}/api/v1/main/ticket-requests/config/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar la configuración de precios');
};

// Crea la preferencia de MercadoPago para recargar créditos y devuelve el init_point.
export const createTopUpPreference = async (quantity, token) => {
  return apiRequest(`${apiUrl}/api/v1/payments/topup/create-preference/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  }, 'Error al iniciar el pago');
};

// Historial de recargas del organizador.
export const getTopUpHistory = async (token) => {
  return apiRequest(`${apiUrl}/api/v1/payments/topup/history/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar el historial de recargas');
};
