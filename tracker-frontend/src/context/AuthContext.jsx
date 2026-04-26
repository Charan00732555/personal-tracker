import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('tracker_token'));

    // Re-hydrate user info from localStorage on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('tracker_user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const { token: newToken, username: backendUsername, email: userEmail } = response.data;
        localStorage.setItem('tracker_token', newToken);
        localStorage.setItem('tracker_user', JSON.stringify({ username: backendUsername, email: userEmail }));
        setToken(newToken);
        setUser({ username: backendUsername, email: userEmail });
    };

    const register = async (username, email, password) => {
        const response = await api.post('/auth/register', { username, email, password });
        const { token: newToken, username: regUsername, email: regEmail } = response.data;
        localStorage.setItem('tracker_token', newToken);
        localStorage.setItem('tracker_user', JSON.stringify({ username: regUsername, email: regEmail }));
        setToken(newToken);
        setUser({ username: regUsername, email: regEmail });
    };

    const logout = () => {
        localStorage.removeItem('tracker_token');
        localStorage.removeItem('tracker_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
