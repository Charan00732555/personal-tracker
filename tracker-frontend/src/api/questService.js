import api from './axios';

export const getTodayQuests = async () => {
    const response = await api.get('/quests/daily');
    return response.data;
};
