import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function verify() {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const data = await authAPI.me();
                setUser(data.data);
            } catch {
                localStorage.removeItem('token');
                setToken(null);
            } finally {
                setLoading(false);
            }
        }
        verify();
    }, [token]);

    const login = async (username, password) => {
        const data = await authAPI.login({ username, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser({ id: data.user_id, username });
        return data;
    };

    const register = async (username, email, password) => {
        const data = await authAPI.register({ username, email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser({ id: data.user_id, username });
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}