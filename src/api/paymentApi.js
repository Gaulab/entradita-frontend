import { apiRequest } from "../utils/apiUtils";

const apiUrl = import.meta.env.VITE_API_URL;

// Función para procesar el pago
export const getAuthorizationUrl = async (authToken) => {
  return apiRequest(`${apiUrl}/api/v1/payments/auth/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  }, 'Error al obtener la URL de autorización');
}

export const createPaymentPreference = async (purchaseData) => {
  return apiRequest(`${apiUrl}/api/v1/payments/create-preference/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(purchaseData),
  }, 'Error al crear la preferencia de pago');
}