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

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Error al obtener la URL de autorización');
    }
  } catch (error) {
    throw new Error(error.message || 'Error desconocido al obtener la URL de autorización');
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

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error + (data.details ? `: ${data.details}` : '') || 'Error al crear la preferencia de pago');
    }
  } catch (error) {
    throw new Error(error.message || 'Error desconocido al crear la preferencia de pago');
  }
}