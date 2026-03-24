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

// Firebase auth (Google or email+password) → app JWT
export const firebaseLogin = async (idToken, username) => {
    const payload = { id_token: idToken };
    if (username) payload.username = username;
    return apiRequest(`${apiUrl}/auth/google/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }, 'Error al iniciar sesión');
}

// Request password reset email
export const requestPasswordReset = async (email) => {
    return apiRequest(`${apiUrl}/auth/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    }, 'Error al solicitar el recupero de contraseña');
}

// Confirm password reset with token + new password
export const confirmPasswordReset = async (token, new_password) => {
    return apiRequest(`${apiUrl}/auth/password-reset/confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password }),
    }, 'Error al restablecer la contraseña');
}