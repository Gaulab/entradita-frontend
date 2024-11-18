import PropTypes from 'prop-types'; // Importa PropTypes
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// API
import { login } from "../api/userApi";
import { refreshToken } from '../api/userApi';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        try{
            const data = await login(e);
            setAuthToken(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            return { success: true }; // Devuelve éxito
        } catch (error) {
            return { success: false, error: error.message }; // Devuelve error
        }
    };

    const logoutUser = () => {
        setUser(null)
        setAuthToken(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    const updateToken = async () => {
        try {
            const data = await refreshToken(authToken)
            setAuthToken(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } catch (error) {
            console.error(error)
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    const contextData = {
        user: user,
        authToken: authToken,
        loginUser: loginUser,
        logoutUser: logoutUser
    }

    useEffect(() => {
        if (loading){
            updateToken()
        }

        let interval = setInterval(() => {
            if (authToken) {
                updateToken()
            }
        }, 240000) // 4 minutos
        return () => clearInterval(interval)

    }, [authToken, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {/* {loading ? null : children} */}
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

// Agrega la validación de PropTypes
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
