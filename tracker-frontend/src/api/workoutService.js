import apiClient from './axios';

export const workoutService = {
  // Get all workouts
  getAll: async () => {
    const response = await apiClient.get('/workouts');
    return response.data;
  },

  // Add a new workout
  create: async (workoutData) => {
    const response = await apiClient.post('/workouts', workoutData);
    return response.data;
  },

  // Delete a workout
  delete: async (id) => {
    await apiClient.delete(`/workouts/${id}`);
  }
};