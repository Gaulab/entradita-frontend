import { handleApiError } from "../utils/apiUtils";

const apiUrl = import.meta.env.VITE_API_URL;

// Create token
export const login = async (e) => {
    try {
        const response = await fetch(`${apiUrl}/auth/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
        });
        await handleApiError(response, 'Error al obtener el token');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Update token
export const refreshToken = async (authToken) => {
    try {
        const response = await fetch(`${apiUrl}/auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authToken?.refresh })
        });
        await handleApiError(response, 'Error al actualizar el token');
        return await response.json();
    } catch (error) {
        throw error;
    }
}