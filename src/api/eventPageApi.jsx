// entraditaFront/src/api/eventApi.jsx
const apiUrl = import.meta.env.VITE_API_URL;

export const getEventPage = async (eventId) => {
    try {
        const response = await fetch(`${apiUrl}/api/v1/main/event/${eventId}/info-for-web/`, {
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

