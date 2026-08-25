import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from "firebase/auth";
import { auth as firebaseAuth, googleProvider } from "../config/firebaseConfig";
import { login, refreshToken, firebaseLogin } from "../api/userApi";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const _setSession = (data) => {
        const decoded = jwtDecode(data.access);
        setAuthToken(data);
        setUser(decoded);
        localStorage.setItem('authTokens', JSON.stringify(data));
        return decoded;
    };

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const data = await login(e);
            const decoded = _setSession(data);
            return { success: true, user: decoded };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const _loginWithFirebaseToken = async (firebaseUser, username) => {
        const idToken = await firebaseUser.getIdToken();
        const data = await firebaseLogin(idToken, username);
        const decoded = _setSession(data);
        return { success: true, user: decoded };
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            return await _loginWithFirebaseToken(result.user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const registerWithEmail = async (email, password, username) => {
        try {
            const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            // Guardamos el usuario elegido para reusarlo en el primer login verificado
            // (la cuenta en el backend recien se crea cuando el email esta verificado).
            if (username) {
                try { await updateProfile(result.user, { displayName: username }); } catch { /* noop */ }
            }
            // Verificacion de email OBLIGATORIA: enviamos el mail y NO logueamos.
            await sendEmailVerification(result.user);
            await signOut(firebaseAuth);
            return { success: true, pendingVerification: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
            if (!result.user.emailVerified) {
                // Reenviamos el mail de verificacion y no dejamos entrar.
                try { await sendEmailVerification(result.user); } catch { /* noop */ }
                await signOut(firebaseAuth);
                return {
                    success: false,
                    needsVerification: true,
                    error: 'Tenés que verificar tu correo antes de ingresar. Te reenviamos el email de verificación.',
                };
            }
            return await _loginWithFirebaseToken(result.user, result.user.displayName || undefined);
        } catch (error) {
            return { success: false, error: error.message };
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
            _setSession(data);
        } catch (error) {
            console.error(error)
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    const contextData = {
        user,
        authToken,
        loginUser,
        loginWithGoogle,
        registerWithEmail,
        loginWithEmail,
        logoutUser,
    }

    useEffect(() => {
        if (loading){
            updateToken()
        }

        let interval = setInterval(() => {
            if (authToken) {
                updateToken()
            }
        }, 240000)
        return () => clearInterval(interval)

    }, [authToken, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
