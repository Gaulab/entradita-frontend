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

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Error al obtener el token');
        }
    } catch (error) {
        throw new Error(error.message || 'Error desconocido al obtener el token');
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

        if (response.ok) {
            return await response.json();
        }
        else {
            throw new Error('Error al actualizar el token');
        }
    } catch (error) {
        throw new Error(error.message || 'Error desconocido al actualizar el token');
    }
}