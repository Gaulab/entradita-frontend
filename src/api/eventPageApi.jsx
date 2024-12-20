// entraditaFront/src/api/eventApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;
export const getEventPage = async (eventId) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/event/${eventId}/page`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Evento no encontrado');
        }
    }
    catch (error) {
        throw new Error(error.message || 'Error al obtener los datos del evento');
    }
}

export const updateEventPage = async (eventId, pageData, authToken ) => {
    console.log('pageData', pageData);
    try {
        const response = await fetch(`${apiUrl}/api/v1/event/${eventId}/page/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(pageData),
        });

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Error al actualizar la página');
        }
    }
    catch (error) {
        throw new Error(error.message || 'Error al actualizar la página');
    }
}