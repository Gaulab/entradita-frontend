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

export const getMyTicketRequests = async (token) => {
  return apiRequest(`${apiUrl}/api/v1/main/ticket-requests/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, 'Error al cargar las solicitudes');
};

export const createTicketRequest = async (formData, token) => {
  return apiRequest(`${apiUrl}/api/v1/main/ticket-requests/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }, 'Error al crear la solicitud');
};
