/*import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  refreshToken: async (token) => {
    const response = await api.post('/auth/refreshToken', { token });
    return response.data;
  },
  logout: async (token) => {
    await api.post('/auth/logout', { token });
  }
};

export default authService;
*/

import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'; // Base URL for authentication API

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
