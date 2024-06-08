import axios from 'axios';

const refreshAccessToken = async () => {
  try {
    const res = await axios.post('http://localhost:8080/auth/refreshToken', {
      token: localStorage.getItem('authToken')
    });
    const accessToken = res.data.accessToken;
    console.log('Refreshed token:', accessToken);
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', 
});

// Request interceptor to attach the token to the request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 403) {
      try {
        const accessToken = await refreshAccessToken();
        console.log(accessToken)
        // Retry the original request with the new access token
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        // Handle refresh error
        console.error('Error refreshing access token:', refreshError);
        throw refreshError;
      }
    }
    // For other errors, just return the error
    return Promise.reject(error);
  }
);

export default axiosInstance;