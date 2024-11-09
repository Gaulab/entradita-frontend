export const getEvents = async (authToken) => {
  // eslint-disable-next-line no-undef
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${apiUrl}/api/v1/events/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      return await response.json(); // Devuelve los datos de los eventos
    } else {
      throw new Error('Error al obtener eventos');
    }
  } catch (error) {
    throw new Error(error.message || 'Error desconocido al obtener eventos');
  }
};
