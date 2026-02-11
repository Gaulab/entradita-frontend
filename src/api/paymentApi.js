import { handleApiError } from "../utils/apiUtils";

const apiUrl = import.meta.env.VITE_API_URL;

// Función para procesar el pago
export const getAuthorizationUrl = async (authToken) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/payments/auth/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    await handleApiError(response, 'Error al obtener la URL de autorización');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const createPaymentPreference = async (purchaseData) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/payments/create-preference/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseData),
    });
    await handleApiError(response, 'Error al crear la preferencia de pago');
    return await response.json();
  } catch (error) {
    throw error;
  }
}