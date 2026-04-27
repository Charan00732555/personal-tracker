import api from './axios';

export const getUserProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateUserProfile = async (profileData) => {
    const response = await api.put('/users/me', profileData);
    return response.data;
};
