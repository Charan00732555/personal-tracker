import axios from 'axios';

const API_URL = 'http://localhost:8080/api/journal';

export const journalService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createOrUpdate: async (entry) => {
    const response = await axios.post(API_URL, entry);
    return response.data;
  }
};