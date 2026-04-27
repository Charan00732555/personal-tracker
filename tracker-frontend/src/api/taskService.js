import api from './axios';

export const getTasks = async () => {
    const response = await api.get('/tasks');
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

export const completeTask = async (taskId) => {
    const response = await api.put(`/tasks/${taskId}/complete`);
    return response.data;
};

export const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
};
