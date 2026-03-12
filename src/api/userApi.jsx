import { apiRequest } from "../utils/apiUtils";

const apiUrl = import.meta.env.VITE_API_URL;

// Create token
export const login = async (e) => {
    return apiRequest(`${apiUrl}/auth/token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
    }, 'Error al obtener el token');
}

// Update token
export const refreshToken = async (authToken) => {
    return apiRequest(`${apiUrl}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'refresh': authToken?.refresh })
    }, 'Error al actualizar el token');
}