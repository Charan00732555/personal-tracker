import api from './axios';

export const getPlayerStats = async () => {
    const response = await api.get('/stats');
    return response.data;
};

export const calculateRetroactiveXp = async () => {
    const response = await api.post('/stats/retroactive');
    return response.data;
};

export const getHunterClass = (overallLevel) => {
    if (overallLevel <= 5) return 'E';
    if (overallLevel <= 10) return 'D';
    if (overallLevel <= 20) return 'C';
    if (overallLevel <= 40) return 'B';
    if (overallLevel <= 75) return 'A';
    return 'S';
};
