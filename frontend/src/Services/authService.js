import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  refreshToken: async (token) => {
    try {
      const response = await axios.post(`${API_URL}/refreshToken`, { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async (token) => {
    try {
      await axios.post(`${API_URL}/logout`, { token });
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
