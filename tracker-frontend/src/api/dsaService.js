import apiClient from './axios';

export const dsaService = {
  // READ: Fetch all problems (predefined + user-added)
  getAll: async () => {
    const response = await apiClient.get('/dsa');
    return response.data;
  },

  // CREATE: Add a new personal problem
  create: async (problemData) => {
    const response = await apiClient.post('/dsa', problemData);
    return response.data;
  },

  // UPDATE: Modify an existing problem (respects isPredefined guard)
  update: async (id, updatedDetails) => {
    const response = await apiClient.put(`/dsa/${id}`, updatedDetails);
    return response.data;
  },

  // DELETE: Remove a user-added problem
  delete: async (id) => {
    await apiClient.delete(`/dsa/${id}`);
  }
};