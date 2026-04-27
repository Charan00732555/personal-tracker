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
        const { token: newToken, username: backendUsername, email: userEmail, avatarId } = response.data;
        localStorage.setItem('tracker_token', newToken);
        localStorage.setItem('tracker_user', JSON.stringify({ username: backendUsername, email: userEmail, avatarId }));
        setToken(newToken);
        setUser({ username: backendUsername, email: userEmail, avatarId });
    };

    const register = async (username, email, password) => {
        const response = await api.post('/auth/register', { username, email, password });
        const { token: newToken, username: regUsername, email: regEmail, avatarId } = response.data;
        localStorage.setItem('tracker_token', newToken);
        localStorage.setItem('tracker_user', JSON.stringify({ username: regUsername, email: regEmail, avatarId }));
        setToken(newToken);
        setUser({ username: regUsername, email: regEmail, avatarId });
    };

    const logout = () => {
        localStorage.removeItem('tracker_token');
        localStorage.removeItem('tracker_user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUserData) => {
        const newUser = { ...user, ...updatedUserData };
        localStorage.setItem('tracker_user', JSON.stringify(newUser));
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
